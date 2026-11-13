const fs = require('fs');

// 1. Update PagesHeader.tsx
const headerPath = 'D:/houseofkaira/hok_admin/src/components/Pages/components/PagesHeader.tsx';
let headerContent = fs.readFileSync(headerPath, 'utf8');

headerContent = headerContent.replace(
  '<span>Add Policy</span>',
  '<span>Add Page</span>'
);
headerContent = headerContent.replace(
  'title="Add a new policy or page"',
  'title="Add a new page or policy to the site"'
);
fs.writeFileSync(headerPath, headerContent, 'utf8');
console.log('Updated PagesHeader.tsx');

// 2. Update PageGroupSection.tsx
const pgsPath = 'D:/houseofkaira/hok_admin/src/components/Pages/components/PageGroupSection.tsx';
const newPgsContent = `/* =========================================================
   HOUSE OF KAIRA – ADMIN PANEL – THE PAGES SECTION
   Component: PageGroupSection (Spec A 4, Screen 01 & 02)
   Admin panel v217 – 20 October 2026
   Rule: Zero dashes used as punctuation. Sentence case only.
========================================================= */

import React from 'react';
import { Plus } from 'lucide-react';
import { PageCardData, PageGroupMeta } from '../types';
import { PageCard } from './PageCard';

interface PageGroupSectionProps {
  group: PageGroupMeta;
  pages: PageCardData[];
  onSelectPage: (slug: string) => void;
  onOpenAddPage?: (group?: string) => void;
}

export const PageGroupSection: React.FC<PageGroupSectionProps> = ({
  group,
  pages,
  onSelectPage,
  onOpenAddPage
}) => {
  if (pages.length === 0) {
    return null;
  }

  return (
    <section className="mb-8 last:mb-0">
      {/* Group Header: Title in serif, count, and descriptive line + Add button */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-3.5 pb-1 border-b border-[#eee7dc]/80">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 className="font-serif text-[20px] font-normal text-[#1a1612]">
            {group.label}
          </h2>
          <span className="text-[13px] text-[#8a7f73] font-normal">
            {pages.length}
          </span>
          <p className="text-[12px] text-[#73675a]">
            {group.description}
          </p>
        </div>

        {onOpenAddPage && (
          <button
            type="button"
            onClick={() => onOpenAddPage(group.id)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11.5px] font-medium text-[#8a6a36] hover:text-[#1a1612] bg-[#f7f2ea] hover:bg-[#ede5d8] border border-[#d9ccb6] rounded-md transition cursor-pointer shadow-2xs"
            title={\`Add a new page to \${group.label}\`}
          >
            <Plus className="w-3.5 h-3.5 text-[#8a6a36]" />
            <span>Add to {group.label}</span>
          </button>
        )}
      </div>

      {/* Cards 3-column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map(page => (
          <PageCard
            key={page.slug}
            page={page}
            onClick={onSelectPage}
          />
        ))}

        {/* Quick Add Card inside grid */}
        {onOpenAddPage && (
          <button
            type="button"
            onClick={() => onOpenAddPage(group.id)}
            className="h-full min-h-[160px] border border-dashed border-[#d9ccb6] hover:border-[#8a6a36] hover:bg-[#faf7f2]/80 bg-white/40 rounded-[8px] p-5 flex flex-col items-center justify-center gap-2 text-[#8a7f72] hover:text-[#1a1612] transition cursor-pointer group shadow-2xs"
          >
            <div className="w-8 h-8 rounded-full bg-[#f7f2ea] group-hover:bg-[#ede5d8] flex items-center justify-center text-[#8a6a36] transition">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-[12.5px] font-medium text-[#5c5248] group-hover:text-[#1a1612]">
              Add page to {group.label}
            </span>
          </button>
        )}
      </div>
    </section>
  );
};

export default PageGroupSection;
`;
fs.writeFileSync(pgsPath, newPgsContent, 'utf8');
console.log('Updated PageGroupSection.tsx');

// 3. Update PagesWorkspaceTab.tsx
const pwtPath = 'D:/houseofkaira/hok_admin/src/components/Pages/components/PagesWorkspaceTab.tsx';
let pwtContent = fs.readFileSync(pwtPath, 'utf8');

// Replace the return block of PagesWorkspaceTab to include:
// - Top action bar with Add Page button
// - Empty state when filteredPages.length === 0
// - Passing onOpenAddPage to PageGroupSection
const targetEmptyBlock = `      {/* 3. Empty State OR Four Canonical Page Groups */}
      {pages.length === 0 ? (`;

const newEmptyAndGroupsBlock = `      {/* Quick Action Strip above groups */}
      <div className="flex flex-wrap items-center justify-between gap-3 py-1">
        <div className="text-xs text-[#73675a] flex items-center gap-2">
          <span>Showing <b>{filteredPages.length}</b> of <b>{pages.length}</b> pages</span>
          {(activeGroupFilter !== 'all' || filterNeedsLook) && (
            <button
              type="button"
              onClick={() => {
                setActiveGroupFilter('all');
                setFilterNeedsLook(false);
              }}
              className="text-[#8a6a36] hover:underline font-medium text-[11.5px] ml-1"
            >
              (Clear filter)
            </button>
          )}
        </div>

        {onOpenAddPage && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenAddPage()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#b89047] hover:bg-[#a67e37] text-white text-[12px] font-semibold transition cursor-pointer shadow-2xs"
              title="Add a new page or policy"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Add Page</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Empty State OR Four Canonical Page Groups */}
      {filteredPages.length === 0 ? (
        <div className="bg-[#fffefb] border border-[#e8e0d6] rounded-xl p-8 text-center shadow-xs my-4">
          <div className="w-12 h-12 rounded-full bg-[#f7f2ea] border border-[#d9ccb6] flex items-center justify-center mx-auto mb-3 text-[#8a6a36]">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-[20px] text-[#1a1612] mb-1.5 font-normal">
            {activeGroupFilter === 'not-built'
              ? 'No unbuilt pages found'
              : filterNeedsLook
              ? 'No pages need attention'
              : pages.length === 0
              ? 'No policies or pages added yet'
              : 'No pages found in this view'}
          </h3>
          <p className="text-[12.5px] text-[#73675a] max-w-md mx-auto mb-5 leading-relaxed">
            {activeGroupFilter === 'not-built'
              ? 'Every page linked across the site currently has a built destination, or you can add a new page draft here.'
              : filterNeedsLook
              ? 'All published pages are currently healthy with no outstanding issues.'
              : 'You can add a new page or policy directly to this section, or view all pages.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {pages.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveGroupFilter('all');
                  setFilterNeedsLook(false);
                }}
                className="px-4 py-2 rounded-lg bg-white hover:bg-[#faf7f2] border border-[#d9ccb6] text-[#2c2926] text-[12px] font-medium transition cursor-pointer shadow-2xs"
              >
                Show All Pages
              </button>
            )}
            {onOpenAddPage && (
              <button
                type="button"
                onClick={() => onOpenAddPage(activeGroupFilter !== 'all' ? activeGroupFilter : undefined)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#b89047] hover:bg-[#a67e37] text-white text-[12px] font-semibold transition cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span>Add Page</span>
              </button>
            )}
            {pages.length === 0 && onSeedAllPolicies && (
              <button
                type="button"
                onClick={handleSeedAll}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-[#faf7f2] border border-[#d9ccb6] text-[#2c2926] text-[12px] font-medium transition cursor-pointer shadow-2xs disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8a6a36]" />
                <span>{isSeeding ? 'Populating Database...' : 'Populate All Standard Policies'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
            {PAGE_GROUPS.map(group => {
              const groupPages = filteredPages.filter(p => p.group === group.id);
              return (
                <PageGroupSection
                  key={group.id}
                  group={group}
                  pages={groupPages}
                  onSelectPage={onSelectPage}
                  onOpenAddPage={onOpenAddPage}
                />
              );
            })}
          </div>
        </div>
      )}`;

// We replace from targetEmptyBlock to the end of the return statement
const returnStart = pwtContent.indexOf(targetEmptyBlock);
const returnEnd = pwtContent.lastIndexOf('    </div>\n  );');

if (returnStart !== -1 && returnEnd !== -1) {
  pwtContent = pwtContent.slice(0, returnStart) + newEmptyAndGroupsBlock + '\n    </div>\n  );';
  fs.writeFileSync(pwtPath, pwtContent, 'utf8');
  console.log('Updated PagesWorkspaceTab.tsx');
} else {
  console.log('Could not find target block in PagesWorkspaceTab.tsx');
}

// 4. Update PagesModule.tsx to accept group in onOpenAddPage and pass to modal
const pmPath = 'D:/houseofkaira/hok_admin/src/components/Pages/PagesModule.tsx';
let pmContent = fs.readFileSync(pmPath, 'utf8');

if (!pmContent.includes('targetAddGroup')) {
  pmContent = pmContent.replace(
    'const [isAddPageOpen, setIsAddPageOpen] = useState(false);',
    'const [isAddPageOpen, setIsAddPageOpen] = useState(false);\n  const [targetAddGroup, setTargetAddGroup] = useState<string | undefined>(undefined);\n  const handleOpenAddPage = (group?: string) => {\n    setTargetAddGroup(group);\n    setIsAddPageOpen(true);\n  };'
  );

  pmContent = pmContent.replace(
    'onOpenAddPage={() => setIsAddPageOpen(true)}',
    'onOpenAddPage={() => handleOpenAddPage()}'
  );

  pmContent = pmContent.replace(
    'onOpenAddPage={() => setIsAddPageOpen(true)}',
    'onOpenAddPage={handleOpenAddPage}'
  );

  pmContent = pmContent.replace(
    '<AddPolicyModal\n        isOpen={isAddPageOpen}',
    '<AddPolicyModal\n        initialGroup={targetAddGroup}\n        isOpen={isAddPageOpen}'
  );
  fs.writeFileSync(pmPath, pmContent, 'utf8');
  console.log('Updated PagesModule.tsx');
}

// 5. Update AddPolicyModal.tsx to support initialGroup
const apmPath = 'D:/houseofkaira/hok_admin/src/components/Pages/components/AddPolicyModal.tsx';
let apmContent = fs.readFileSync(apmPath, 'utf8');

if (!apmContent.includes('initialGroup?:')) {
  apmContent = apmContent.replace(
    'export interface AddPolicyModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  onSavePage: (pageData: Partial<PageCardData>, seedContent?: boolean) => Promise<void>;\n  onSeedAll?: () => Promise<void>;\n}',
    'export interface AddPolicyModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  onSavePage: (pageData: Partial<PageCardData>, seedContent?: boolean) => Promise<void>;\n  onSeedAll?: () => Promise<void>;\n  initialGroup?: string;\n}'
  );

  apmContent = apmContent.replace(
    'export const AddPolicyModal: React.FC<AddPolicyModalProps> = ({\n  isOpen,\n  onClose,\n  onSavePage,\n  onSeedAll\n}) => {',
    'export const AddPolicyModal: React.FC<AddPolicyModalProps> = ({\n  isOpen,\n  onClose,\n  onSavePage,\n  onSeedAll,\n  initialGroup\n}) => {'
  );

  apmContent = apmContent.replace(
    'if (!isOpen) return null;',
    `React.useEffect(() => {
    if (isOpen && initialGroup) {
      if (['content-help', 'policies', 'system', 'not-built'].includes(initialGroup)) {
        setGroup(initialGroup as any);
        const match = ALL_POLICY_TEMPLATES.find(t => t.group === initialGroup);
        if (match) {
          handleSelectTemplate(match.slug);
        }
      }
    }
  }, [isOpen, initialGroup]);

  if (!isOpen) return null;`
  );

  fs.writeFileSync(apmPath, apmContent, 'utf8');
  console.log('Updated AddPolicyModal.tsx');
}
