const fs = require('fs');
const filePath = 'hok_admin/src/components/Pages/components/PagesHeader.tsx';

let content = fs.readFileSync(filePath, 'utf8');

// Replace Row 1 Actions so it cleanly has:
// View Live Site, Notifications, Add Policy (gold button), Save Changes
const oldActionsRow = `          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open('/', '_blank')}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e5ddd3] bg-white px-3.5 text-[12px] font-medium text-[#38332d] hover:bg-[#faf8f5] transition cursor-pointer shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#6f675d]" />
              <span className="hidden sm:inline">View Live Site</span>
            </button>

            {accessLevel !== 'View Only' && onOpenAddPage && (
              <button
                onClick={onOpenAddPage}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#2c2926] hover:bg-[#1a1612] px-3.5 text-[12px] font-semibold text-[#fffefb] transition cursor-pointer shadow-2xs"
                title="Add a new policy or page"
              >
                <Plus className="h-3.5 w-3.5 text-[#e5ddd3]" />
                <span>+ Add Policy</span>
              </button>
            )}

            <button
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e5ddd3] bg-white px-3 text-[12px] font-medium text-[#38332d] hover:bg-[#faf8f5] transition cursor-pointer shadow-2xs"
              title="12 unread notifications"
            >
              <Bell className="h-3.5 w-3.5 text-[#6f675d]" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-semibold bg-[#b85c38] text-white rounded-full">
                12
              </span>
            </button>

            {accessLevel !== 'View Only' && (
              <button
                onClick={() => onConfirmPublish ? onConfirmPublish() : undefined}
                className="inline-flex h-8 items-center rounded-md bg-[#c7a55c] hover:bg-[#b9974b] px-4 text-[12px] font-semibold text-[#2a2118] transition cursor-pointer shadow-2xs"
              >
                {accessLevel === 'Edit' ? 'See the changes' : 'Save Changes'}
              </button>
            )}
          </div>`;

const newActionsRow = `          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open('/', '_blank')}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e5ddd3] bg-white px-3.5 text-[12px] font-medium text-[#38332d] hover:bg-[#faf8f5] transition cursor-pointer shadow-2xs"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#6f675d]" />
              <span className="hidden sm:inline">View Live Site</span>
            </button>

            <button
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e5ddd3] bg-white px-3 text-[12px] font-medium text-[#38332d] hover:bg-[#faf8f5] transition cursor-pointer shadow-2xs"
              title="12 unread notifications"
            >
              <Bell className="h-3.5 w-3.5 text-[#6f675d]" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-semibold bg-[#b85c38] text-white rounded-full">
                12
              </span>
            </button>

            {accessLevel !== 'View Only' && onOpenAddPage && (
              <button
                onClick={onOpenAddPage}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#c7a55c] hover:bg-[#b9974b] px-3.5 text-[12px] font-semibold text-[#2a2118] transition cursor-pointer shadow-2xs"
                title="Add a new policy or page"
              >
                <Plus className="h-3.5 w-3.5 text-[#2a2118]" />
                <span>Add Policy</span>
              </button>
            )}

            {accessLevel !== 'View Only' && (
              <button
                onClick={() => onConfirmPublish ? onConfirmPublish() : undefined}
                className="inline-flex h-8 items-center rounded-md bg-[#2c2926] hover:bg-[#1a1612] px-4 text-[12px] font-semibold text-[#fffefb] transition cursor-pointer shadow-2xs"
              >
                {accessLevel === 'Edit' ? 'See the changes' : 'Save Changes'}
              </button>
            )}
          </div>`;

content = content.replace(oldActionsRow.replace(/\r\n/g, '\n'), newActionsRow);
content = content.replace(oldActionsRow, newActionsRow);

// Now remove the two duplicate buttons inside Row 2
// Search for the duplicate buttons block between Search Box and Scheduled Pill
const regexRow2Buttons = /(\s*\{accessLevel !== 'View Only' && onOpenAddPage && \([\s\S]*?<\/button>\s*\}){1,3}/g;

// Only remove from Row 2 (after Search Box Trigger)
const parts = content.split('{/* Search Box Trigger */}');
if (parts.length > 1) {
  // In parts[1], remove the buttons before {/* Scheduled Pill
  const afterSearch = parts[1];
  const scheduledIndex = afterSearch.indexOf('{/* Scheduled Pill (Screen 16) */}');
  if (scheduledIndex !== -1) {
    let searchToScheduled = afterSearch.slice(0, scheduledIndex);
    // Remove any Add Policy button in this section
    searchToScheduled = searchToScheduled.replace(/\{accessLevel !== 'View Only' && onOpenAddPage && \([\s\S]*?<\/button>\s*\}\s*/g, '');
    parts[1] = searchToScheduled + afterSearch.slice(scheduledIndex);
    content = parts.join('{/* Search Box Trigger */}');
  }
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('PagesHeader cleaned successfully!');

