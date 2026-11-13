const fs = require('fs');
const filePath = 'hok_admin/src/components/Pages/PagesModule.tsx';

let content = fs.readFileSync(filePath, 'utf8');

// Replace AddPageModal with AddPolicyModal
content = content.replace(
  "import { AddPageModal } from './components/AddPageModal';",
  "import { AddPolicyModal } from './components/AddPolicyModal';\r\nimport { CANONICAL_PAGE_CONTENTS } from './data/pageContentRegistry';\r\nimport { savePageContent as savePageContentApi } from '../../services/pageApi';"
);

// Replace handleSaveNewPage with policy-aware version
const oldHandler = `  const handleSaveNewPage = async (pageData: Partial<PageCardData>) => {
    try {
      await savePageApi(pageData);
      const updated = await getAllPages();
      setPages(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error('Failed to add page:', err);
    }
  };`;

const newHandler = `  const handleSaveNewPage = async (pageData: Partial<PageCardData>, seedContent?: boolean) => {
    try {
      await savePageApi(pageData);
      if (seedContent && pageData.slug) {
        const cleanSlug = pageData.slug.replace(/^\\//, '');
        const initial = (CANONICAL_PAGE_CONTENTS as any)[cleanSlug] || (CANONICAL_PAGE_CONTENTS as any)[pageData.slug];
        if (initial) {
          await savePageContentApi(pageData.slug, initial);
        }
      }
      const updated = await getAllPages();
      setPages(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error('Failed to add policy:', err);
    }
  };

  const handleSeedAllPolicies = async () => {
    try {
      for (const p of SEED_PAGES) {
        await savePageApi(p);
      }
      const updated = await getAllPages();
      setPages(Array.isArray(updated) ? updated : []);
    } catch (err) {
      console.error('Failed to seed policies:', err);
    }
  };`;

content = content.replace(oldHandler.replace(/\r\n/g, '\n'), newHandler);
content = content.replace(oldHandler, newHandler);

// Pass onOpenAddPage to PagesHeader
content = content.replace(
  'accessLevel={accessLevel}\r\n        onBackToDashboard={onBackToDashboard}',
  'accessLevel={accessLevel}\r\n        onBackToDashboard={onBackToDashboard}\r\n        onOpenAddPage={() => setIsAddPageOpen(true)}'
);
content = content.replace(
  'accessLevel={accessLevel}\n        onBackToDashboard={onBackToDashboard}',
  'accessLevel={accessLevel}\n        onBackToDashboard={onBackToDashboard}\n        onOpenAddPage={() => setIsAddPageOpen(true)}'
);

// Pass props to PagesWorkspaceTab
content = content.replace(
  'onNavigateToFigures={() => setActiveTab(\'figures\')}\r\n          />',
  'onNavigateToFigures={() => setActiveTab(\'figures\')}\r\n            onOpenAddPage={() => setIsAddPageOpen(true)}\r\n            onSeedAllPolicies={handleSeedAllPolicies}\r\n          />'
);
content = content.replace(
  'onNavigateToFigures={() => setActiveTab(\'figures\')}\n          />',
  'onNavigateToFigures={() => setActiveTab(\'figures\')}\n            onOpenAddPage={() => setIsAddPageOpen(true)}\n            onSeedAllPolicies={handleSeedAllPolicies}\n          />'
);

// Replace AddPageModal tag with AddPolicyModal tag
content = content.replace(
  `<AddPageModal
        isOpen={isAddPageOpen}
        onClose={() => setIsAddPageOpen(false)}
        onSavePage={handleSaveNewPage}
      />`,
  `<AddPolicyModal
        isOpen={isAddPageOpen}
        onClose={() => setIsAddPageOpen(false)}
        onSavePage={handleSaveNewPage}
        onSeedAll={handleSeedAllPolicies}
      />`
);

content = content.replace(
  `<AddPageModal\r\n        isOpen={isAddPageOpen}\r\n        onClose={() => setIsAddPageOpen(false)}\r\n        onSavePage={handleSaveNewPage}\r\n      />`,
  `<AddPolicyModal\r\n        isOpen={isAddPageOpen}\r\n        onClose={() => setIsAddPageOpen(false)}\r\n        onSavePage={handleSaveNewPage}\r\n        onSeedAll={handleSeedAllPolicies}\r\n      />`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('PagesModule updated successfully!');

