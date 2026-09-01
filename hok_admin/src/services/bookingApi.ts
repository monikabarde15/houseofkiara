const BASE = 'http://localhost:5000/api';
export const reserveBooking = async (productId: string, payload: { startDate: string; endDate: string; mode?: 'Rental' | 'Preloved' | 'Buy'; orderId?: string; customerName?: string; amount?: number; deposit?: number }) => {
  const response = await fetch(`${BASE}/products/${encodeURIComponent(productId)}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const body = await response.json().catch(() => ({})); if (!response.ok || body.success === false) throw new Error(body.message || 'Booking could not be reserved'); return body.data;
};
