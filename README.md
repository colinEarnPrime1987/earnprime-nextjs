# EarnPrime

**Secure, transparent short-term investment platform** designed to help users grow their wealth with confidence through investment notes.

[![Version](https://img.shields.io/badge/version-0.1.0-green.svg)](https://github.com/colinEarnPrime1987/earnprime-nextjs)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:3001](http://localhost:3001) to see the application.

## 📁 Project Structure

```
earnprime-nextjs/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Landing page
│   ├── page.module.css          # Landing page styles
│   ├── globals.css              # Global styles
│   │
│   ├── login/                   # Login page
│   │   ├── page.tsx
│   │   └── login.module.css
│   │
│   ├── register/                # Multi-step registration
│   │   ├── page.tsx
│   │   └── register.module.css
│   │
│   ├── dashboard/               # User dashboard
│   │   ├── page.tsx
│   │   └── dashboard.module.css
│   │
│   └── api/                     # API routes
│       └── auth/
│           ├── login/route.ts
│           └── register/route.ts
│
├── components/
│   ├── base/                    # Base UI components
│   │   ├── EPButton.tsx / .module.css
│   │   ├── EPLogo.tsx / .module.css
│   │   ├── AnimatedBackground.tsx / .module.css
│   │   └── AnimatedLogo.tsx / .module.css
│   │
│   └── layout/                  # Layout components
│       └── EPContainer.tsx / .module.css
│
├── lib/                         # Core utilities
│   └── session.ts              # Session management
│
├── styles/                      # Design system
│   ├── variables.css           # CSS custom properties
│   └── base.css                # Global base styles
│
├── public/
│   ├── assets/                 # Logos and branding
│   └── icon.svg                # Favicon
│
├── docs/                        # Documentation
│   └── PHASE-1-AUTHENTICATION.md
│
├── CHANGELOG.md                 # Version history
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
└── package.json                # Dependencies
```

## ✨ Features

### Phase 1: Authentication & Registration ✅

- **Landing Page**
  - Particle network animated background
  - Parallax scrolling effects
  - Features showcase
  - Responsive navigation bar
  - Call-to-action sections

- **User Authentication**
  - Login page with form validation
  - Session management with HttpOnly cookies
  - Protected dashboard routes

- **User Registration**
  - Multi-step registration wizard
  - Personal information collection
  - Contact details validation
  - Financial information and KYC
  - Account creation with security
  - Accredited investor qualification logic

- **API Routes**
  - `/api/auth/login` - User authentication
  - `/api/auth/register` - User registration
  - In-memory session storage (development)

### Coming Soon

- **Phase 2**: Dashboard & Wallet Management
- **Phase 3**: Investment Notes System
- **Phase 4**: Transaction History & Reporting
- **Phase 5**: Settings & Profile Management
- **Phase 6**: Production Deployment

## 🎨 Design System

### Components

#### EPButton
Button component with multiple variants and sizes:
```tsx
<EPButton variant="primary" size="lg" onClick={handleClick}>
  Click Me
</EPButton>
```

**Variants**: `primary`, `secondary`, `outline`, `ghost`
**Sizes**: `sm`, `md`, `lg`

#### EPLogo
Logo component with flexible sizing and themes:
```tsx
<EPLogo size="md" theme="light" variant="full" />
```

**Sizes**: `sm`, `md`, `lg`, `xl`
**Themes**: `default`, `dark`, `light`, `monochrome`
**Variants**: `full`, `symbol`, `text`

#### EPContainer
Responsive container with max-width constraints:
```tsx
<EPContainer maxWidth="xl">
  {children}
</EPContainer>
```

**Max Widths**: `sm`, `md`, `lg`, `xl`

#### AnimatedBackground
Canvas-based particle network animation:
```tsx
<AnimatedBackground />
```

### Color Palette

- **Primary Green**: `#00CE84`, `#00EA96`, `#02BF76`
- **Dark**: `#1A1A1A`, `#2D2D2D`, `#3A3A3A`
- **Neutral**: White, grays
- **Semantic**: Success, error, warning, info

### Typography

- **Font Family**: Poppins (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Scale**: 12px - 48px with CSS custom properties

## 🔧 Technology Stack

- **Framework**: Next.js 16.1.6 (App Router)
- **UI Library**: React 19.2.4
- **Language**: TypeScript 5.9.3
- **Styling**: CSS Modules + CSS Custom Properties
- **Animations**: Canvas API + CSS animations
- **Session Management**: HttpOnly cookies (in-memory store for development)
- **Module System**: ES Modules

## 📝 Available Scripts

```bash
# Development server (port 3001)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## 🔐 Authentication

Current implementation uses mock authentication with in-memory session storage for rapid prototyping.

**Demo User**:
- Username: `demo`
- Password: `password123`

**⚠️ Note**: This is for development only. See [docs/PHASE-1-AUTHENTICATION.md](docs/PHASE-1-AUTHENTICATION.md) for production migration guide.

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 768px, 1024px, 1280px
- Touch-friendly interactions
- Fluid typography and spacing

## 🎭 Animations & Effects

- Particle network background with canvas rendering
- Parallax scrolling on landing page
- Scroll-triggered fade-in animations
- Smooth page transitions
- Interactive hover states

## 🧪 Development

### Adding New Pages

Create a new directory in `app/` with a `page.tsx` file:

```tsx
// app/my-page/page.tsx
export default function MyPage() {
  return <div>My Page</div>
}
```

Route will be available at `/my-page`.

### Creating Components

Use TypeScript and CSS Modules:

```tsx
// components/MyComponent.tsx
import styles from './MyComponent.module.css'

interface MyComponentProps {
  title: string
}

export default function MyComponent({ title }: MyComponentProps) {
  return <div className={styles.container}>{title}</div>
}
```

### API Routes

Create route handlers in `app/api/`:

```tsx
// app/api/my-endpoint/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Hello' })
}
```

## 🚢 Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

See [CHANGELOG.md](CHANGELOG.md) for version history.

## 📚 Documentation

- [Phase 1: Authentication & Registration](docs/PHASE-1-AUTHENTICATION.md) - Complete implementation guide
- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features
- [React Documentation](https://react.dev) - React fundamentals
- [TypeScript Documentation](https://www.typescriptlang.org/docs) - TypeScript guide

## 🎯 Roadmap

- [x] **Phase 1**: Authentication & Registration (v0.1.0)
- [ ] **Phase 2**: Dashboard & Wallet Management
- [ ] **Phase 3**: Investment Notes System
- [ ] **Phase 4**: Transaction History & Reporting
- [ ] **Phase 5**: Settings & Profile Management
- [ ] **Phase 6**: Production Deployment

## 🔒 Security Considerations

**Current (Development)**:
- In-memory session storage
- Plain-text passwords (mock only)
- No database persistence

**Production Requirements**:
- PostgreSQL/MySQL database
- bcrypt password hashing
- JWT or session-based auth with Redis
- HTTPS/SSL enforcement
- CSRF protection
- Rate limiting
- Input sanitization

See [docs/PHASE-1-AUTHENTICATION.md](docs/PHASE-1-AUTHENTICATION.md) for detailed security migration path.

## 📄 License

Copyright © 2026 EarnPrime. All rights reserved.

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

---

**Current Version**: 0.1.0 - Phase 1 Complete
**Last Updated**: February 4, 2026
