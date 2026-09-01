# TODO — Delete Customer Feature

- [ ] 1. `src/App.tsx` — add `handleDeleteCustomer(id)` callback that removes customer from `customers` state.
- [ ] 2. `src/App.tsx` — pass `onDeleteCustomer` prop to `<CustomersView>`.
- [ ] 3. `src/components/CustomersView.tsx` — add `onDeleteCustomer` prop to interface + destructuring.
- [ ] 4. `src/components/CustomersView.tsx` — add delete modal state (`deleteTarget`, `deleteConfirmed`, `deleting`) and `handleDeleteCustomer` logic.
- [ ] 5. `src/components/CustomersView.tsx` — add Delete button (Trash2 icon) adjacent to View button in table rows; rename column header to "Actions".
- [ ] 6. `src/components/CustomersView.tsx` — render confirmation modal with tick box; disable confirm until ticked; call API + update UI on confirm.
- [ ] 7. Verify TypeScript compiles (`npx tsc --noEmit`).

