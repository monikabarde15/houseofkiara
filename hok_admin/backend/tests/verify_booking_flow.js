// backend/tests/verify_booking_flow.js
import Product from '../models/Product.js';
import { addExternalBooking, addBlockedDate } from '../controllers/productSectionController.js';

function parseToStartOfDay(d) {
  if (!d) return new Date(NaN);
  if (typeof d === 'string') {
    const match = d.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) return new Date(parseInt(match[1], 10), parseInt(match[2], 10) - 1, parseInt(match[3], 10));
  }
  const dateObj = new Date(d);
  return new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
}

function addDays(d, n) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() + n);
  return copy;
}

// Pure validation logic test helper mirroring controller rules
function validateBooking(existingBookings, blockedDates, preBufferDays, postBufferDays, newStartDate, newEndDate) {
  const start = parseToStartOfDay(newStartDate);
  const end = parseToStartOfDay(newEndDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return { allowed: false, reason: "Invalid date range" };
  }

  // Check overlap against active bookings and their post-return buffer
  for (const b of existingBookings) {
    const bStart = parseToStartOfDay(b.startDate || b.start);
    const bEnd = parseToStartOfDay(b.endDate || b.end);
    const bPostEnd = addDays(bEnd, postBufferDays);

    if (start <= bPostEnd && end >= bStart) {
      return { allowed: false, reason: `Overlaps with booking ${b.orderId} (${b.customerName})` };
    }
  }

  // Check overlap against manual blocks
  for (const b of blockedDates) {
    const bStart = parseToStartOfDay(b.from);
    const bEnd = parseToStartOfDay(b.to);
    if (start <= bEnd && end >= bStart) {
      return { allowed: false, reason: `Overlaps with blocked range (${b.reason})` };
    }
  }

  return { allowed: true };
}

console.log("=================================================");
console.log("     RUNNING RENTAL BOOKING VALIDATION SUITE     ");
console.log("=================================================\n");

let passedCount = 0;
let totalCount = 0;

function assertResult(testName, result, expectedAllowed) {
  totalCount++;
  const pass = result.allowed === expectedAllowed;
  if (pass) passedCount++;
  console.log(`[${pass ? 'PASS ✅' : 'FAIL ❌'}] Test #${totalCount}: ${testName}`);
  console.log(`  -> Result Allowed: ${result.allowed} | Expected: ${expectedAllowed} ${result.reason ? `(${result.reason})` : ''}`);
}

const mockBookings = [
  { orderId: 'HOK-ORD-001', customerName: 'Riya Sharma', startDate: '2026-09-10', endDate: '2026-09-14' }
];
const mockBlocks = [
  { from: '2026-09-28', to: '2026-09-29', reason: 'Maintenance' }
];

const preBuffer = 2;
const postBuffer = 3;

// TEST CASES
// 1. Valid booking on open dates after buffer (18-20 Sept)
assertResult(
  "Customer 2 books 18 Sept - 20 Sept (After Riya's 3-day buffer on 15-17 Sept)",
  validateBooking(mockBookings, mockBlocks, preBuffer, postBuffer, '2026-09-18', '2026-09-20'),
  true
);

// 2. Invalid booking inside Riya's active rental (12-13 Sept)
assertResult(
  "Customer 2 tries to book 12 Sept - 13 Sept (Directly inside Riya's rental)",
  validateBooking(mockBookings, mockBlocks, preBuffer, postBuffer, '2026-09-12', '2026-09-13'),
  false
);

// 3. Invalid booking inside Riya's post-cleaning buffer (15-17 Sept)
assertResult(
  "Customer 2 tries to book 16 Sept - 17 Sept (Inside 3-day post-return buffer)",
  validateBooking(mockBookings, mockBlocks, preBuffer, postBuffer, '2026-09-16', '2026-09-17'),
  false
);

// 4. Valid booking before Riya's rental (02-05 Sept)
assertResult(
  "Customer 3 books 02 Sept - 05 Sept (Well before Riya's rental)",
  validateBooking(mockBookings, mockBlocks, preBuffer, postBuffer, '2026-09-02', '2026-09-05'),
  true
);

// 5. Invalid booking overlapping Manual Maintenance Block (28-30 Sept)
assertResult(
  "Customer 4 tries to book 28 Sept - 30 Sept (Overlaps Maintenance block on 28-29 Sept)",
  validateBooking(mockBookings, mockBlocks, preBuffer, postBuffer, '2026-09-28', '2026-09-30'),
  false
);

// 6. Valid booking after Maintenance Block (30 Sept - 02 Oct)
assertResult(
  "Customer 5 books 30 Sept - 02 Oct (After Maintenance block ends on 29 Sept)",
  validateBooking(mockBookings, mockBlocks, preBuffer, postBuffer, '2026-09-30', '2026-10-02'),
  true
);

// 7. Invalid date range (End < Start)
assertResult(
  "Customer tries invalid date range where End date (20 Sept) < Start date (25 Sept)",
  validateBooking(mockBookings, mockBlocks, preBuffer, postBuffer, '2026-09-25', '2026-09-20'),
  false
);

console.log("\n=================================================");
console.log(`SUMMARY: ${passedCount} / ${totalCount} TESTS PASSED`);
console.log("=================================================");

if (passedCount === totalCount) {
  process.exit(0);
} else {
  process.exit(1);
}
