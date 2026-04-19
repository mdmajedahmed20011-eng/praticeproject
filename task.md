# 🚀 Elite Secure Admin Dashboard (Phase 5)

- [x] 1. Schema Upgrades (CMS & Business Logic)
  - [x] Add `SiteSetting`, `Collection`, `Discount` models to `schema.prisma`.
  - [x] Update `Product` to map to `Collection`.
  - [x] Run Prisma migration / push.

- [x] 2. Secure Admin Authentication
  - [x] Install `next-auth` and configure credentials login.
  - [x] Protect all `/admin/*` routes using Next.js Middleware.
  - [x] Build `/login` custom secure page.

- [x] 3. Homepage Visual CMS & Settings Hub (`/admin/settings`)
  - [x] Build `Settings` UI for Hero Banner, Colors, and Layout toggles.
  - [x] Backend API to save/fetch settings.
  - [x] Connect Frontend `app/page.tsx` to read `SiteSettings`.

- [x] 4. Advanced Analytics Dashboard (`/admin`)
  - [x] Install `recharts` for visual revenue analytics.
  - [x] Calculate real KPIs (Total Revenue, AOV, Low Stock).

- [x] 5. Collection Management (`/admin/collections`)
  - [x] UI to create collections, upload images.
  - [x] API for collections.

- [x] 6. Elite Products Table & Editor
  - [x] Add Bulk Edit capabilities.
  - [x] Add Rich-text editor integration (`react-quill` or similar).
  - [x] UI for managing variants (Size/Color) matrix.

- [x] 7. Advanced Orders CRM (`/admin/orders`)
  - [x] Advanced status modifier (Processing -> Shipped -> Tracking Details).
  - [x] Customer order history view.

- [x] 8. Dynamic Discount Engine
  - [x] Build `/admin/discounts` portal.

- [x] 9. Final Frontend Glue
  - [x] Rewrite `/collections` to use DB products and categories.
  - [x] Rewrite Checkout to POST to true DB and validate Discounts.
