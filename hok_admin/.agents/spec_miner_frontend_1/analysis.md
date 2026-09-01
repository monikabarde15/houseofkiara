# Frontend Codebase & Mock Data Specification Mining Report

**Agent**: `spec_miner_frontend_1`  
**Date**: 2026-08-25  
**Project**: HOK Admin Panel (`d:/HOKAdmin/hok_admin`)

---

## 1. Executive Summary

This report documents the exhaustive frontend architecture survey, mock dataset inventory, UI view requirements, and API client contracts for the HOK Admin Panel.

The frontend is a React 19 single-page application built with TypeScript, Vite 6, and Tailwind CSS 4. The application currently operates with a mix of:
1. Real API service integrations (with graceful fallbacks to in-memory/mock state).
2. Hardcoded mock arrays and simulated delays in component files.
3. `localStorage` caching for session tokens, customer state, site settings, and homepage configuration.

---

## 2. Frontend Structure & Stack

- **Build Tool**: Vite 6.2.3 (`vite.config.ts`), dev server on port `3000` with `/api` proxy forwarding to `http://localhost:5000`.
- **Framework**: React 19.0.1, React DOM 19.0.1.
- **Styling**: Tailwind CSS 4 (`@tailwindcss/vite`), custom CSS stylesheets per module.
- **Icons**: Lucide React (`lucide-react`).
- **Path Aliases**: `@/` maps to project root `.` via `vite.config.ts` and `tsconfig.json`.
- **Layout & Routing**: Tab-based view router in `src/App.tsx` controlled by `currentView` state (`dashboard`, `orders`, `order_detail:<id>`, `offers`, `calendar`, `dispatch`, `returns`, `payouts`, `customers`, `products`, `designers`, `listers`, `lyp`, `reports`, `promotions`, `messaging`, `notifications`, `settings`, `homepage`, `pages`).

---

## 3. Operations Subsections Analysis

### 3.1 Orders (`orders` & `order_detail:<id>`)
- **Components**: `src/components/OrdersView.tsx`, `src/components/OrderDetailView.tsx`.
- **Service**: `src/services/orderApi.ts`.
- **Current Flow**:
  - `App.tsx` initializes `orders` state via `orderApi.getOrders()`, falling back to `initialOrders` from `src/data.ts`.
  - `OrdersView.tsx` provides MTD metrics (Orders MTD, Rentals Today, Deposits Held, Revenue MTD), multi-filter search (search query, status, mode, rental date range), and navigation to `order_detail:<id>`.
  - `OrderDetailView.tsx` provides multi-tab operations:
    1. **Summary**: Customer info, rental timeline, internal admin notes.
    2. **Items & Pricing**: Pricing, GST, refundable deposit, discount breakdown, invoice generation (`orderApi.getInvoice(order.id)`).
    3. **Dispatch**: Handled by, dispatch date, tracking number, courier partner, pre-dispatch photo/video evidence upload (`orderApi.saveEvidence(order.id, index, 'dispatch', photos)`).
    4. **Return & Condition**: Received by, received date, condition grade (A, B, C, D), condition notes, return evidence upload (`orderApi.saveEvidence(...)`).
    5. **Deposit Decision**: Status (`Released`, `Partial`, `Forfeited`), released amount, deducted amount, decision reason.
    6. **Log & Notes**: Audit log list, manual event addition (`orderApi.addOrderLog(...)`).
- **Required API Endpoints**:
  - `GET /api/orders`
  - `GET /api/orders/:id`
  - `POST /api/orders`
  - `PUT /api/orders/:id`
  - `PATCH /api/orders/:id/status`
  - `POST /api/orders/:id/logs`
  - `PATCH /api/orders/:id/items/:index`
  - `PATCH /api/orders/:id/items/:index/dispatch`
  - `PATCH /api/orders/:id/items/:index/return`
  - `PATCH /api/orders/:id/items/:index/deposit`
  - `PATCH /api/orders/:id/items/:index/evidence`
  - `GET /api/orders/:id/invoice`

### 3.2 Offers & Enquiries (`offers`)
- **Components**: `src/components/OffersView.tsx`.
- **Service**: `src/services/offerApi.ts`.
- **Current Flow**:
  - `App.tsx` loads offers via `offerApi.getOffers()`.
  - Metrics: Pending offers, Accepted MTD, Avg offer %, Revenue from offers MTD.
  - Table filter by status (`All Status`, `Pending`, `Countered`, `Accepted`, `Declined`, `Expired`, `On Hold`, `Enquiry`).
  - Offline offer modal (`createOffer`), Counter-offer modal (`sendCounterOffer`), negotiation notes (`getOfferNotes`, `addOfferNote`), and CSV export (`/api/offers/export/csv`).
- **Required API Endpoints**:
  - `GET /api/offers`
  - `POST /api/offers`
  - `PUT /api/offers/:id`
  - `PATCH /api/offers/:id/status`
  - `POST /api/offers/:id/counter-offer`
  - `GET /api/offers/:id/notes`
  - `POST /api/offers/:id/notes`
  - `GET /api/offers/export/csv`

### 3.3 Rental Calendar (`calendar`)
- **Components**: `src/components/RentalCalendar/tsx/RentalCalendarView.tsx`, `CalendarGrid.tsx`, `Sidebar.tsx`, `agenda/AgendaView.tsx`, `gantt/GanttView.tsx`.
- **Legacy Component**: `src/components/CalendarView.tsx`.
- **Mock Files**:
  - `src/components/RentalCalendar/mockdata.ts` (`mockEvents`, `mockDispatches`)
  - `src/components/RentalCalendar/tsx/agenda/agendaMockData.ts` (`agendaMockData`)
  - `src/components/RentalCalendar/tsx/gantt/ganttMockData.ts` (`ganttMockData`)
- **Current Flow**:
  - Three view modes: `month` (Calendar grid with event pills and detail popovers), `agenda` (day-by-day task checklist), and `gantt` (product rental timeline lanes).
  - Sidebar shows dispatch cards and monthly action items.
- **Required Backend Integration**:
  - Calendar events and dispatches should derive directly from real database orders (`orders` collection / table with `rentalStartDate`, `rentalEndDate`, `dispatchDetails`, `returnLogistics`, and blocked dates).
  - API endpoint: `GET /api/orders` (or dedicated `GET /api/calendar/events`).

### 3.4 Dispatch Schedule (`dispatch`)
- **Components**: `src/components/Dispatch/jsx/DispatchView.jsx`, `tabs/TodayTab.jsx`, `tabs/TomorrowTab.jsx`, `tabs/ThisWeekTab.jsx`.
- **Mock Data Hardcoded**:
  - `todayOrders` in `TodayTab.jsx`
  - `tomorrowOrders` in `TomorrowTab.jsx`
  - `weekOrders`, `conflictOrder`, `rotationItems` in `ThisWeekTab.jsx`
- **Current Flow**:
  - Tabs: Today, Tomorrow, This Week.
  - Cards show order ID, day/month, item name, designer, customer, city, rental dates, deposit status, courier partner, tracking number, and action button (Mark Dispatched / Print Label / WhatsApp).
- **Required Backend Integration**:
  - Compute dispatches from real `orders` where `status` is `Confirmed`/`Packed`/`Shipped` and dispatch date matches today, tomorrow, or the current 7-day window.
  - Dispatch status update calls `orderApi.updateDispatch` or `orderApi.transitionOrder`.

### 3.5 Returns & Deposits (`returns`)
- **Components**: `src/components/ReturnsView.tsx`.
- **Current Flow**:
  - Metrics: Pending Returns, Deposits Held, Released Deposits, Deductions/Fines.
  - "Pieces Due for Return" list: Orders in `Shipped` or `Delivered` state nearing `rentalEndDate`.
  - "Recent Returns Assessment Log" table: Completed returns with quality grades (A, B, C, D) and deposit release/deduction numbers.
  - Quick action: "Log Return (Excellent Cond.)" updates order status to `Returned`, sets assessment grade to `A`, and releases deposit in full.
- **Required Backend Integration**:
  - Driven by `orderApi` (`updateOrder`, `updateReturn`, `decideDeposit`).

### 3.6 Payouts to Listers (`payouts`)
- **Components**: `src/components/payouts/PayoutsView.tsx`, `tabs/PaymentQueueTab.tsx`, `tabs/AllPayoutsTab.tsx`, `tabs/ByListerTab.tsx`, `tabs/ByProductTab.tsx`, `tabs/DamageCompensationTab.tsx`.
- **Service**: `src/services/payoutApi.ts`.
- **Mock Files / Data**:
  - `PaymentQueueTab.tsx`: 5 hardcoded approval cards (Crimson Zardozi Rental #3, Rajputana Silk Damage Comp, Rose Georgette Rental #1, Crimson Zardozi Rental #4, Gulabi Silk Preloved).
  - `AllPayoutsTab.tsx`: `MOCK_PAYOUTS` (8 static rows).
  - `ByListerTab.tsx`: Hardcoded summary cards and transactions table for Aishwarya Sharma.
  - `ByProductTab.tsx`: `MOCK_TRANSACTIONS` for 5 rentals across products.
  - `DamageCompensationTab.tsx`: `MOCK_DAMAGE_COMP` for damage reimbursement calculations.
  - `src/components/payouts/data/mockData.ts` (currently empty placeholder).
- **Required Backend Integration**:
  - `GET /api/payouts`
  - `PATCH /api/payouts/:id/paid`
  - `PATCH /api/payouts/:id/status`
  - `GET /api/payouts/export/csv`
  - All tabs should dynamically consume real payout records generated from completed orders and deposit settlements.

### 3.7 Customers (`customers`)
- **Components**: `src/components/CustomersView.tsx`.
- **Service**: `src/services/customerApi.ts`.
- **Current Flow**:
  - Customer directory table with search, status filters, LTV, orders count.
  - Detailed 9-tab profile editor: Profile, Order History, Wishlist, Cart, Rentals, Deposits, Offers, Communication Log, Account Settings.
  - Sub-resource endpoints implemented: `addCustomerAddress`, `addCustomerOccasion`, `addCustomerCommLog`.
- **Required API Endpoints**:
  - `GET /api/customers` (supports `?search=`, `?status=`, `?source=`)
  - `GET /api/customers/:id`
  - `POST /api/customers`
  - `PUT /api/customers/:id`
  - `DELETE /api/customers/:id`
  - `POST /api/customers/:id/addresses`
  - `POST /api/customers/:id/occasions`
  - `POST /api/customers/:id/communication-log`

---

## 4. Catalogue Subsections Analysis

### 4.1 Products (`products`)
- **Components**: `src/components/products/ProductsView.tsx`, `ProductTable.tsx`, `ProductSidebar.tsx`, `ProductEditor.tsx`, `tabs/*`.
- **Services**: `src/services/productApi.ts`, `src/services/productSectionsApi.ts`, `src/services/uploadApi.ts`.
- **Current Flow**:
  - Comprehensive 8-tab product editor: Core Details, Pricing & Tax, Images, Related Products, SEO, Availability Calendar, Payout History, Activity Log.
  - Real-time quote calculation via `productQuoteApi.getProductQuote`.
  - Date blocking via `productSectionsApi.addBlockedDate` / `removeBlockedDate`.
- **Required API Endpoints**:
  - `GET /api/products`
  - `GET /api/products/:id`
  - `POST /api/products`
  - `PUT /api/products/:id`
  - `DELETE /api/products/:id`
  - `PATCH /api/products/:id/archive`
  - `PATCH /api/products/:id/restore`
  - `PUT /api/products/:id/images`
  - `GET /api/products/:id/calendar`
  - `POST /api/products/:id/blocked-dates`
  - `DELETE /api/products/:id/blocked-dates/:index`
  - `GET /api/products/:id/activity`
  - `GET /api/products/:id/payout-history`
  - `PUT /api/products/:id/related-products`
  - `POST /api/products/:id/external-bookings`
  - `GET /api/products/:id/quote`
  - `GET /api/products/:id/availability`

### 4.2 Designers (`designers`)
- **Components**: `src/components/Designers/tsx/DesignersView.tsx`, `Designers.tsx`, `DesignerEdit.tsx`.
- **Service**: `src/services/designerApi.ts`.
- **Mock File**: `src/components/Designers/data/mockDesigners.ts`.
- **Current Flow**:
  - Grid and detail editing of designer profiles (Sabyasachi, Manish Malhotra, Anita Dongre, Tarun Tahiliani).
  - Tabs: Profile, Contact & Commercial, Performance & Pieces, Authentication.
- **Required API Endpoints**:
  - `GET /api/designers`
  - `GET /api/designers/:id`
  - `POST /api/designers`
  - `PUT /api/designers/:id`
  - `DELETE /api/designers/:id`

### 4.3 Listers (`listers`)
- **Components**: `src/components/Listers/ListersView.tsx`, `ListerDetailView.tsx`, `components/*`, `tabs/*`.
- **Services**: `src/services/listerApi.ts`, `src/components/Listers/services/listerService.ts`.
- **Mock File**: `src/components/Listers/data/mockListers.ts`.
- **Current Flow**:
  - Lister management: Profile & Contact, Listings & Wardrobe, Payouts & Statements, Submissions Intake, Recalls & Returns, Communication & Notes, Compliance & Legal, Activity Log.
  - Bank verification & PAN verification.
- **Required API Endpoints**:
  - `GET /api/listers`
  - `GET /api/listers/:id`
  - `POST /api/listers`
  - `PUT /api/listers/:id`
  - `DELETE /api/listers/:id`
  - `PUT /api/listers/:id/bank-details`

### 4.4 LYP Submissions (`lyp`)
- **Components**: `src/components/LYP/index.tsx`, `LYPView.tsx`, `LYPDetailView.tsx`, `intake/*`.
- **Service**: `src/components/LYP/services/submissionService.ts`.
- **Mock File**: `src/components/LYP/data/mockSubmissions.ts`.
- **Current Flow**:
  - List Your Piece intake portal for submissions from prospective wardrobe sharers.
  - Review queue, AI designer recognition, SKU generator, approve/reject/request more info/withdraw actions.
  - Approving a submission creates a live Product in the catalog and increments the Lister's listings count.
- **Required Backend Integration**:
  - Dedicated submissions endpoints or integration into database `listers` / `products` schema.

---

## 5. Admin Authentication & Session Security

### 5.1 Authentication Flow
- **Component**: `src/components/AdminAuth.tsx`.
- **Service**: `src/services/authApi.ts`.
- **Storage**: `localStorage.getItem('hok_admin_session')`.
- **Session Object Shape**:
  ```json
  {
    "token": "eyJhbGciOi...",
    "admin": {
      "id": "ADM-001",
      "name": "Soumya",
      "email": "admin@houseofkaira.com",
      "role": "Super Admin"
    }
  }
  ```
- **Login Check in `App.tsx`**:
  ```tsx
  const [adminSession, setAdminSession] = useState<any>(() => authApi.getSession());
  if (!adminSession) return <AdminAuth onLogin={setAdminSession} />;
  ```

### 5.2 Critical Gap Identified: Authorization Headers
Currently, `authApi.ts`, `orderApi.ts`, `productApi.ts`, `customerApi.ts`, `designerApi.ts`, `listerApi.ts`, `payoutApi.ts` execute HTTP requests using standard `fetch` without extracting the session token and setting `Authorization: Bearer <token>`.
When the backend enforces JWT / session validation on protected routes, every frontend service must send:
```ts
const session = getSession();
const token = session?.token;
headers: {
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  ...(options?.headers || {})
}
```

---

## 6. Complete Inventory of Mock Files to Replace

| # | Mock File Path | Entities Contained | Components Dependent On It |
|---|----------------|-------------------|----------------------------|
| 1 | `src/data.ts` | `initialCustomers`, `initialProducts`, `initialOrders`, `initialOffers`, `initialDesigners`, `initialListers`, `initialListerSubmissions`, `initialPromoCodes`, `initialEmailTemplates`, `initialSiteSettings`, `initialHomepage` | `App.tsx`, `OrdersView.tsx`, `CustomersView.tsx`, `ReportsView.tsx`, `SettingsView.tsx` |
| 2 | `src/components/RentalCalendar/mockdata.ts` | `mockEvents`, `mockDispatches` (March 2026 calendar data) | `RentalCalendarView.tsx`, `CalendarGrid.tsx`, `Sidebar.tsx` |
| 3 | `src/components/RentalCalendar/tsx/agenda/agendaMockData.ts` | `agendaMockData` (9 agenda checklist entries) | `AgendaView.tsx` |
| 4 | `src/components/RentalCalendar/tsx/gantt/ganttMockData.ts` | `ganttMockData` (10 Gantt timeline rows) | `GanttView.tsx` |
| 5 | `src/components/Dispatch/tabs/TodayTab.jsx` | `todayOrders` (hardcoded HOK-ORD-010) | `DispatchView.jsx` |
| 6 | `src/components/Dispatch/tabs/TomorrowTab.jsx` | `tomorrowOrders` (hardcoded HOK-ORD-013, HOK-ORD-011) | `DispatchView.jsx` |
| 7 | `src/components/Dispatch/tabs/ThisWeekTab.jsx` | `weekOrders`, `conflictOrder`, `rotationItems` | `DispatchView.jsx` |
| 8 | `src/components/payouts/tabs/PaymentQueueTab.tsx` | Hardcoded card states (cards 1–5) | `PayoutsView.tsx` |
| 9 | `src/components/payouts/tabs/AllPayoutsTab.tsx` | `MOCK_PAYOUTS` (8 static payout entries) | `PayoutsView.tsx` |
| 10 | `src/components/payouts/tabs/ByListerTab.tsx` | Static transactions & summary cards | `PayoutsView.tsx` |
| 11 | `src/components/payouts/tabs/ByProductTab.tsx` | `MOCK_TRANSACTIONS` (5 product rental rows) | `PayoutsView.tsx` |
| 12 | `src/components/payouts/tabs/DamageCompensationTab.tsx` | `MOCK_DAMAGE_COMP` (1 damage comp row) | `PayoutsView.tsx` |
| 13 | `src/components/Designers/data/mockDesigners.ts` | `designers`, `unmappedLabels`, `mockPieces` | `DesignersView.tsx`, `Designers.tsx` |
| 14 | `src/components/Listers/data/mockListers.ts` | `mockListers`, `mockSubmissions`, `mockPayouts`, `mockActivities`, `mockCommunications`, `mockRecalls`, `mockProducts` | `ListersView.tsx`, `listerService.ts` |
| 15 | `src/components/LYP/data/mockSubmissions.ts` | `mockSubmissions` (LYP wardrobe submissions) | `LYPView.tsx`, `submissionService.ts` |
| 16 | `src/components/Messaging/data/mockMessages.ts` | `mockMessages`, `mockWordGroups`, `mockDocuments` | `MessagingView.tsx` |
| 17 | `src/components/Promotions/data/mockPromotions.ts` | `mockPromotions`, `mockRules`, `mockVouchers` | `PromotionsView.tsx` |

---

## 7. Master API Client Endpoints Catalog

| Category | Method | Path | Request Body | Response Body | Frontend Source |
|---|---|---|---|---|---|
| **Auth** | `GET` | `/api/auth/status` | None | `{ success, data: { registered: boolean } }` | `authApi.ts` |
| **Auth** | `POST` | `/api/auth/register` | `{ name, email, password }` | `{ success, data: { token, admin } }` | `authApi.ts` |
| **Auth** | `POST` | `/api/auth/login` | `{ email, password }` | `{ success, data: { token, admin } }` | `authApi.ts` |
| **Orders** | `GET` | `/api/orders` | None | `{ success, data: Order[] }` | `orderApi.ts` |
| **Orders** | `GET` | `/api/orders/:id` | None | `{ success, data: Order }` | `orderApi.ts` |
| **Orders** | `POST` | `/api/orders` | `Partial<Order>` | `{ success, data: Order }` | `orderApi.ts` |
| **Orders** | `PUT` | `/api/orders/:id` | `Partial<Order>` | `{ success, data: Order }` | `orderApi.ts` |
| **Orders** | `PATCH` | `/api/orders/:id/status` | `{ status: string }` | `{ success, data: Order }` | `orderApi.ts` |
| **Orders** | `POST` | `/api/orders/:id/logs` | `{ message, type, user }` | `{ success, data: Order }` | `orderApi.ts` |
| **Orders** | `PATCH` | `/api/orders/:id/items/:index` | `any` | `{ success, data: Order }` | `orderApi.ts` |
| **Orders** | `PATCH` | `/api/orders/:id/items/:index/dispatch`| `{ dispatchedBy, date, trackingNumber, courierPartner }` | `{ success, data: Order }` | `orderApi.ts` |
| **Orders** | `PATCH` | `/api/orders/:id/items/:index/return` | `{ receivedDate, receivedBy, grade, notes }` | `{ success, data: Order }` | `orderApi.ts` |
| **Orders** | `PATCH` | `/api/orders/:id/items/:index/deposit` | `{ status, releasedAmount, deductedAmount, reason }` | `{ success, data: Order }` | `orderApi.ts` |
| **Orders** | `PATCH` | `/api/orders/:id/items/:index/evidence`| `{ stage, photos, videoUrl }` | `{ success, data: Order }` | `orderApi.ts` |
| **Orders** | `GET` | `/api/orders/:id/invoice` | None | `{ success, data: InvoiceData }` | `orderApi.ts` |
| **Offers** | `GET` | `/api/offers` | None (`?limit=1000`) | `{ success, data: Offer[] }` | `offerApi.ts` |
| **Offers** | `POST` | `/api/offers` | `{ productName, customerName, customerEmail, customerPhone, originalAmount, offeredAmount, notes }` | `{ success, data: Offer }` | `offerApi.ts` |
| **Offers** | `PUT` | `/api/offers/:id` | `{ customerName, customerEmail, customerPhone, productName, originalAmount, offeredAmount }` | `{ success, data: Offer }` | `offerApi.ts` |
| **Offers** | `PATCH` | `/api/offers/:id/status` | `{ status: string }` | `{ success, data: Offer }` | `offerApi.ts` |
| **Offers** | `POST` | `/api/offers/:id/counter-offer`| `{ amount, remarks, sentBy }` | `{ success, data }` | `offerApi.ts` |
| **Offers** | `GET` | `/api/offers/:id/notes` | None | `{ success, data: Note[] }` | `offerApi.ts` |
| **Offers** | `POST` | `/api/offers/:id/notes` | `{ message, createdBy }` | `{ success, data }` | `offerApi.ts` |
| **Offers** | `GET` | `/api/offers/export/csv` | None | CSV stream / download | `offerApi.ts` |
| **Payouts** | `GET` | `/api/payouts` | None | `{ success, data: Payout[] }` | `payoutApi.ts` |
| **Payouts** | `PATCH` | `/api/payouts/:id/paid` | `{ paidBy, paymentReference, taxDeduction }` | `{ success, data: Payout }` | `payoutApi.ts` |
| **Payouts** | `PATCH` | `/api/payouts/:id/status` | `{ status, notes }` | `{ success, data }` | `payoutApi.ts` |
| **Payouts** | `GET` | `/api/payouts/export/csv` | None | CSV stream / download | `payoutApi.ts` |
| **Customers** | `GET` | `/api/customers` | Query `?search=&status=&source=` | `{ success, data: Customer[] }` | `customerApi.ts` |
| **Customers** | `GET` | `/api/customers/:id` | None | `{ success, data: Customer }` | `customerApi.ts` |
| **Customers** | `POST` | `/api/customers` | `Partial<Customer>` | `{ success, data: Customer }` | `customerApi.ts` |
| **Customers** | `PUT` | `/api/customers/:id` | `Partial<Customer>` | `{ success, data: Customer }` | `customerApi.ts` |
| **Customers** | `DELETE` | `/api/customers/:id` | None | `{ success, data }` | `customerApi.ts` |
| **Customers** | `POST` | `/api/customers/:id/addresses` | `{ label, address, isDefault }` | `{ success, data: Customer }` | `customerApi.ts` |
| **Customers** | `POST` | `/api/customers/:id/occasions` | `{ occasion, date }` | `{ success, data: Customer }` | `customerApi.ts` |
| **Customers** | `POST` | `/api/customers/:id/communication-log` | `{ message, channel }` | `{ success, data: Customer }` | `customerApi.ts` |
| **Products** | `GET` | `/api/products` | None | `{ success, data: Product[] }` | `productApi.ts` |
| **Products** | `GET` | `/api/products/:id` | None | `{ success, data: Product }` | `productApi.ts` |
| **Products** | `POST` | `/api/products` | `Product` | `{ success, data: Product }` | `productApi.ts` |
| **Products** | `PUT` | `/api/products/:id` | `Product` | `{ success, data: Product }` | `productApi.ts` |
| **Products** | `DELETE` | `/api/products/:id` | None | `{ success, data }` | `productApi.ts` |
| **Products** | `PATCH` | `/api/products/:id/archive` | `{ user }` | `{ success, data }` | `productApi.ts` |
| **Products** | `PATCH` | `/api/products/:id/restore` | `{ user }` | `{ success, data }` | `productApi.ts` |
| **Products** | `PUT` | `/api/products/:id/images` | `{ images, user }` | `{ success, data }` | `productApi.ts` |
| **Products** | `GET` | `/api/products/:id/calendar`| None | `{ success, data }` | `productSectionsApi.ts` |
| **Products** | `POST` | `/api/products/:id/blocked-dates` | `{ from, to, reason }` | `{ success, data }` | `productSectionsApi.ts` |
| **Products** | `DELETE` | `/api/products/:id/blocked-dates/:index` | None | `{ success, data }` | `productSectionsApi.ts` |
| **Products** | `GET` | `/api/products/:id/activity` | None | `{ success, data }` | `productSectionsApi.ts` |
| **Products** | `GET` | `/api/products/:id/payout-history` | None | `{ success, data }` | `productSectionsApi.ts` |
| **Products** | `PUT` | `/api/products/:id/related-products` | `{ relatedProductIds }` | `{ success, data }` | `productSectionsApi.ts` |
| **Products** | `POST` | `/api/products/:id/external-bookings` | `{ orderId, customerName, startDate, endDate, amount }` | `{ success, data }` | `productSectionsApi.ts` |
| **Products** | `GET` | `/api/products/:id/quote` | Query `?mode=&startDate=&endDate=&quantity=` | `{ success, data: ProductQuote }` | `productQuoteApi.ts` |
| **Products** | `GET` | `/api/products/:id/availability` | Query `?startDate=&endDate=&mode=&excludeOrderId=` | `{ success, data: AvailabilityResult }` | `availabilityApi.ts` |
| **Designers** | `GET` | `/api/designers` | Query `?search=&status=&type=` | `{ success, data: Designer[] }` | `designerApi.ts` |
| **Designers** | `GET` | `/api/designers/:id` | None | `{ success, data: Designer }` | `designerApi.ts` |
| **Designers** | `POST` | `/api/designers` | `Partial<Designer>` | `{ success, data: Designer }` | `designerApi.ts` |
| **Designers** | `PUT` | `/api/designers/:id` | `Partial<Designer>` | `{ success, data: Designer }` | `designerApi.ts` |
| **Designers** | `DELETE` | `/api/designers/:id` | None | `{ success, data }` | `designerApi.ts` |
| **Listers** | `GET` | `/api/listers` | Query `?search=&status=` | `{ success, data: Lister[] }` | `listerApi.ts` |
| **Listers** | `GET` | `/api/listers/:id` | None | `{ success, data: Lister }` | `listerApi.ts` |
| **Listers** | `POST` | `/api/listers` | `Partial<Lister>` | `{ success, data: Lister }` | `listerApi.ts` |
| **Listers** | `PUT` | `/api/listers/:id` | `Partial<Lister>` | `{ success, data: Lister }` | `listerApi.ts` |
| **Listers** | `DELETE` | `/api/listers/:id` | None | `{ success, data }` | `listerApi.ts` |
| **Listers** | `PUT` | `/api/listers/:id/bank-details` | `{ holder, accct, ifsc, branch, upi, verified }` | `{ success, data: Lister }` | `listerApi.ts` |
| **Uploads** | `POST` | `/api/uploads` | `multipart/form-data` (`file`, `folder`) | `{ success, data: { url, publicId, ... } }` | `uploadApi.ts` |
| **Uploads** | `DELETE` | `/api/uploads` | `{ publicId, resourceType }` | `{ success, data }` | `uploadApi.ts` |
| **Messages** | `POST` | `/api/messages/send` | `{ channel, to, body }` | `{ success, data }` | `messageApi.ts` |
