import { SEED_PAGES, PAGE_GROUPS } from '../hok_admin/src/components/Pages/data/seedPages.js';

console.log('Total Seed Pages:', SEED_PAGES.length);
SEED_PAGES.forEach(p => {
  if (p.health !== 'healthy' || p.checksCount > 0) {
    console.log(`Page: ${p.slug} (${p.title}) -> Health: ${p.health}, Checks: ${p.checksCount} (High: ${p.highChecksCount}, Med: ${p.mediumChecksCount}) Built: ${p.isBuilt}`);
  }
});

