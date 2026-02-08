# Changelog

All notable changes to the EarnPrime Next.js application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-02-08

### Fixed
- Register page dropdown backgrounds now use solid dark color so text is visible

### Added
- "Back to top" floating button on the landing page (appears on scroll)
- Logo on dashboard, login, and register pages now links back to landing page
- Landing page nav logo scrolls to top on click

## [0.2.0] - 2026-02-07

### Added
- **Fastify Backend API**
  - Full REST API server on port 3002 with TypeScript and `@/` path aliases
  - JWT authentication with bcrypt password hashing
  - Zod request validation on all endpoints
  - Centralized error handling

- **Plaid Banking Integration**
  - Connect bank accounts via Plaid Link (sandbox environment)
  - Exchange public tokens for encrypted access tokens (AES-256-GCM)
  - View institutions, accounts, and balances
  - Sync and browse transaction history from Plaid
  - Refresh live balances per institution
  - Disconnect institutions (removes from Plaid + database)
  - Institution detail pages with account drill-down
  - Account detail pages with transaction history

- **Notes Marketplace**
  - `notes` and `note_purchases` database tables with seed data
  - Browse investment notes with APY rates, terms, risk ratings, and capacity
  - Note detail page with description, availability progress bar, and risk badge
  - Purchase form with bank account selection and amount validation
  - Atomic purchase transactions (capacity check + insert in single DB transaction)
  - Dedicated "My Investments" portfolio page with stats and purchase cards
  - "My Investments" button on Notes Marketplace for quick navigation

- **Dashboard Enhancements**
  - "Invest" section with Notes Marketplace link card
  - Institution cards with aggregated balances (clickable to detail)
  - Cross-bank transaction feed (click stat card to toggle)

- **Frontend API Client**
  - Centralized `ApiClient` class in `lib/api-client.ts`
  - Auth, Plaid, and Notes endpoint methods
  - Automatic JWT token management via localStorage

- **Documentation**
  - `docs/user-guide.md` — End-to-end walkthrough for all features
  - `docs/plaid-integration-flow.md` — Plaid technical integration details

### Technical
- Aurora PostgreSQL database on AWS RDS
- Backend TypeScript with Fastify, `pg` driver, Zod validation
- Frontend API client pattern for all backend communication
- CSS Modules with consistent glass-morphism design system
- Database migrations via SQL files (`schema.sql`, `migrate-notes.sql`)

## [0.1.1] - 2026-02-05

### Added
- **Marketing Content Pages**
  - FAQ page with accordion-style questions organized by category
  - Contact Us page with form and contact methods
  - Privacy Policy page with comprehensive data protection details
  - Terms of Service page with legal agreements and disclaimers
  - Security page highlighting encryption, compliance, and insurance
  - Testimonials page showcasing customer success stories
  - Blog page with categorized posts and newsletter signup
  - Learning Center page with guides, glossary, and video tutorials

### Changed
- **Navigation Reorganization**
  - Streamlined header navigation to 4 primary links (How It Works, About Us, Blog, Resources)
  - Moved secondary pages to organized footer (8 links across 4 categories)
  - Implemented 4-column footer layout: Company, Resources, Legal, Support
  - Added footer brand section with logo and tagline
  - Improved mobile responsiveness (2-column footer on tablet, 1-column on mobile)

### Improved
- Better information architecture following fintech industry standards
- Enhanced user experience with clearer navigation hierarchy
- Reduced header clutter from 11 items to 6 items
- Added contact information directly in footer (email, phone)
- Consistent navigation and footer across all pages

## [0.1.0] - 2026-02-04

### Added
- **Phase 1: Authentication & Registration System**
  - User login page with validation
  - Multi-step registration wizard (Personal, Contact, Financial, Account)
  - KYC data collection with accredited investor qualification
  - API routes for authentication (`/api/auth/login`, `/api/auth/register`)
  - In-memory session management with HttpOnly cookies
  - Protected dashboard route
  - Comprehensive Phase 1 documentation

- **Landing Page**
  - Particle network animated background
  - Hero section with parallax effects
  - Features showcase grid
  - Call-to-action section
  - Responsive footer
  - Navigation bar with Login/Sign Up buttons

- **UI Components**
  - EPButton component with multiple variants
  - EPLogo component with size and theme options
  - EPContainer layout component
  - AnimatedBackground particle system
  - AnimatedLogo component

- **Branding & Assets**
  - EarnPrime emblem favicon
  - Optimized horizontal logo for navigation (Asset 3.svg)
  - Multiple logo variants (colored, white, emblems)

### Changed
- Optimized navigation bar logo sizing for better space efficiency
- Reduced navbar padding from 1rem to 0.5rem
- Improved logo readability in header and footer

### Technical
- Next.js 16.1.6 with App Router
- React 19.2.4
- TypeScript 5.9.3
- ES Module format
- Canvas-based particle animation system
- Mock authentication (production migration path documented)

### Documentation
- Created comprehensive Phase 1 implementation guide
- Documented API endpoints and data flows
- Outlined security considerations and production migration path

---

## Version History

- **0.2.0** - Plaid Integration, Backend API, and Notes Marketplace
- **0.1.1** - Navigation Reorganization & Marketing Pages
- **0.1.0** - Phase 1 Complete: Authentication & Registration
