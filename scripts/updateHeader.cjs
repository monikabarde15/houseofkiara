const fs = require('fs');
const filePath = 'hok_admin/src/components/Pages/components/PagesHeader.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add Plus import if not present
if (!content.includes('Plus,')) {
  content = content.replace(
    "import { ArrowLeft, Search, Calendar, CheckCircle2, Sparkles, ExternalLink, Bell } from 'lucide-react';",
    "import { ArrowLeft, Search, Calendar, CheckCircle2, Sparkles, ExternalLink, Bell, Plus } from 'lucide-react';"
  );
}

// 2. Add onOpenAddPage to interface
if (!content.includes('onOpenAddPage?: () => void;')) {
  content = content.replace(
    '  onSelectPage?: (slug: string) => void;\r\n  userRole?:',
    '  onSelectPage?: (slug: string) => void;\r\n  onOpenAddPage?: () => void;\r\n  userRole?:'
  );
  // fallback for LF
  content = content.replace(
    '  onSelectPage?: (slug: string) => void;\n  userRole?:',
    '  onSelectPage?: (slug: string) => void;\n  onOpenAddPage?: () => void;\n  userRole?:'
  );
}

// 3. Add onOpenAddPage to component parameters
if (!content.includes('onOpenAddPage,\r\n  userRole =')) {
  content = content.replace(
    '  onSelectPage,\r\n  userRole =',
    '  onSelectPage,\r\n  onOpenAddPage,\r\n  userRole ='
  );
  content = content.replace(
    '  onSelectPage,\n  userRole =',
    '  onSelectPage,\n  onOpenAddPage,\n  userRole ='
  );
}

// 4. Add "+ Add Policy" button in Row 1 (before Notifications)
const buttonRow1 = `            {accessLevel !== 'View Only' && onOpenAddPage && (
              <button
                onClick={onOpenAddPage}
                className="inline-flex h-8 items-center gap-1.5 rounded-md bg-[#2c2926] hover:bg-[#1a1612] px-3.5 text-[12px] font-semibold text-[#fffefb] transition cursor-pointer shadow-2xs"
                title="Add a new policy or page"
              >
                <Plus className="h-3.5 w-3.5 text-[#e5ddd3]" />
                <span>+ Add Policy</span>
              </button>
            )}\r\n\r\n`;

if (!content.includes('Add a new policy or page')) {
  content = content.replace(
    '            <button\r\n              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e5ddd3]',
    buttonRow1 + '            <button\r\n              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e5ddd3]'
  );
  content = content.replace(
    '            <button\n              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e5ddd3]',
    buttonRow1.replace(/\r\n/g, '\n') + '            <button\n              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-[#e5ddd3]'
  );
}

// 5. Add "+ Add Policy" in Row 2 (next to search and review)
const buttonRow2 = `\r\n                {accessLevel !== 'View Only' && onOpenAddPage && (
                  <button
                    onClick={onOpenAddPage}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-[6px] text-xs font-semibold bg-[#b89047] hover:bg-[#a67e37] text-white border border-[#9a7633] transition-colors shadow-2xs cursor-pointer"
                    title="Select and add a policy or page to the database"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span>+ Add Policy</span>
                  </button>
                )}`;

if (!content.includes('Select and add a policy or page')) {
  content = content.replace(
    '                {/* Scheduled Pill (Screen 16) */}',
    buttonRow2 + '\r\n\r\n                {/* Scheduled Pill (Screen 16) */}'
  );
  content = content.replace(
    '                {/* Scheduled Pill (Screen 16) */}',
    buttonRow2.replace(/\r\n/g, '\n') + '\n\n                {/* Scheduled Pill (Screen 16) */}'
  );
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('PagesHeader updated successfully!');

