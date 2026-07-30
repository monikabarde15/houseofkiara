// src/components/products/index.ts

export { default as ProductsView } from './ProductsView';
export { ProductHeader } from './ProductHeader';
export { ProductFilters } from './ProductFilters';
export { ProductTable } from './ProductTable';
export { ProductTabs, DEFAULT_TAB_LABELS } from './ProductTabs';

// Tabs
export { CoreDetailsTab } from './tabs/CoreDetailsTab';
export { PricingTaxTab } from './tabs/PricingTaxTab';
export { ImagesTab } from './tabs/ImagesTab';
export { SEOTab } from './tabs/SEOTab';
export { RelatedProductsTab } from './tabs/RelatedProductsTab';
export { AvailabilityCalendarTab } from './tabs/AvailabilityCalendarTab';

// Hooks
export { useProductEditor } from '../hooks/useProductEditor';

// Types
export * from '../types/product';