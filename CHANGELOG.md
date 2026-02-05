# Changelog

All notable changes to the EarnPrime Next.js application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

- **0.1.0** - Phase 1 Complete: Authentication & Registration
