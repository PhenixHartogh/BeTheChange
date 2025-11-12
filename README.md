# Be the Change - Petition Platform

## Overview

Be the Change is a comprehensive petition platform that enables users to create, sign, and manage petitions for social causes. The application allows authenticated users to start petitions on various topics (environment, social justice, education, healthcare, etc.), collect signatures with detailed contact information, and track progress toward signature goals. Petition creators have exclusive access to view full signature data for their petitions, while the platform maintains public visibility of petition content and aggregate signature counts.

**Status**: In Development
## User Preferences

Preferred communication style: Simple, everyday language.

## Completed Features (November 2024)

### Core MVP Features ✅
- **Auth0 Authentication**: Secure user login and registration with social login support
- **Create Petitions**: Authenticated users can create petitions with title, description, category, signature goals, optional images, and decision maker contacts
- **Browse & Search**: Full petition listing with real-time search and category filtering
- **Sign Petitions**: Comprehensive signature form collecting first name, last name, email, phone, postcode, with consent-to-share checkbox
- **Email Verification**: Automated verification emails sent to signers with secure token-based verification
- **Privacy Protection**: Public views show only first name + last initial, full details visible to creators only
- **Organizer Dashboard**: Petition creators can view all signatures with full contact details
- **CSV Export**: Download complete signature lists for outreach and campaign management
- **User Profiles**: Personal dashboard showing petitions created and signed
- **Social Sharing**: Share petitions via Twitter, Facebook, Email, or copy link
- **Responsive Design**: Beautiful, accessible design that works on all devices
- **Progress Tracking**: Visual progress bars showing petition momentum toward goals

### Advanced Features ✅
- **hCaptcha Protection**: Spam prevention on petition creation and signature submission
- **Decision Makers**: Display key decision maker contacts (name, title, email) on petition pages
- **Announcements System**: Petition creators can post updates that notify all verified signers via email
- **Public Comments**: Verified signers can leave public comments on petitions they've signed
- **Verification Page**: Dedicated success page for email verification with clear user feedback

### Security & Privacy ✅
- SESSION_SECRET enforcement prevents session forgery
- Signature PII (email, phone) only accessible to petition creators
- Public endpoints show limited information (first name, last initial, postcode)
- Duplicate signature prevention for authenticated users
- Proper authentication and authorization on all protected endpoints
- hCaptcha spam protection on forms
- Email verification prevents fake signatures
- Comments restricted to verified signers only
- Announcements restricted to petition creators only

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server, configured for fast HMR and optimized production builds
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component System**
- shadcn/ui components based on Radix UI primitives for accessibility and customization
- Tailwind CSS with custom design tokens following the "new-york" style preset
- Design system inspired by Change.org and Stripe, emphasizing clarity, bold typography (Inter font family), and activist energy
- Custom CSS variables for theming (light mode configured, dark mode supported via `.dark` class)

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- Custom `queryClient` with configured defaults (no automatic refetching, infinite stale time)
- Form state managed via React Hook Form with Zod schema validation
- Auth state managed through custom `AuthContext` provider

**Key Design Decisions**
- Component-first architecture with reusable UI components in `client/src/components/ui/`
- Page-based routing with dedicated components in `client/src/pages/`
- Separation of concerns: UI components, business logic hooks, and API integration layers
- Path aliases configured (`@/`, `@shared/`, `@assets/`) for clean imports

### Backend Architecture

**Server Framework**
- Express.js with TypeScript running on Node.js
- ESM module system for modern JavaScript features
- Middleware stack: JSON parsing, URL encoding, request logging with response capture

**API Design**
- RESTful endpoints under `/api` prefix
- Route organization in `server/routes.ts` with clear separation of public and protected endpoints
- Authentication middleware integration with express-openid-connect
- Validation using express-validator and Drizzle-Zod schemas

**Authentication & Authorization**
- Auth0 integration via express-openid-connect for OAuth 2.0/OIDC authentication
- Session-based authentication with automatic user creation on first login
- Role-based access: petition creators have exclusive access to signature data via `requireAuth` middleware
- Auth flow: `/api/auth/login` → Auth0 → `/api/auth/callback` → session creation

**Data Access Layer**
- Storage abstraction pattern via `IStorage` interface in `server/storage.ts`
- `DatabaseStorage` implementation using Drizzle ORM
- Query methods organized by entity (users, petitions, signatures)
- Relational data loading with creator information and signature counts

**Key Design Decisions**
- Separation of auth logic (`server/auth.ts`) from business logic
- Database connection pooling via Neon serverless with WebSocket support
- Automatic user provisioning on Auth0 authentication
- Privacy-first design: full signature data only accessible to petition creators

### Data Storage

**Database System**
- PostgreSQL via Neon serverless (with WebSocket support for connection pooling)
- Drizzle ORM for type-safe database queries and schema management
- Schema defined in `shared/schema.ts` for sharing between client and server

**Schema Design**

*Users Table*
- Primary key: UUID (auto-generated)
- Auth0 integration: `auth0Id` (unique) for OAuth user mapping
- User profile: email, name, picture (from Auth0)
- Timestamps: `createdAt`

*Petitions Table*
- Primary key: UUID (auto-generated)
- Content fields: title, description, category, imageUrl
- Metadata: `signatureGoal` (default 100), status (active/closed/successful)
- Foreign key: `createdById` → users table
- Timestamps: `createdAt`

*Signatures Table*
- Primary key: UUID (auto-generated)
- Relational keys: `petitionId` (with cascade delete), `userId` (optional - allows anonymous signing)
- Contact data: firstName, lastName, email, phoneNumber, postcode
- Timestamps: `createdAt`

**Relations**
- One-to-many: User → Petitions (creator relationship)
- One-to-many: User → Signatures (signer relationship, optional)
- One-to-many: Petition → Signatures (with cascade delete)

**Data Privacy Strategy**
- Public endpoints return petition data with aggregate signature counts only
- Creator-only endpoints (`/api/petitions/:id/signatures`) require authentication and ownership verification
- Signature data includes full contact information (email, phone, postcode) for organizers to export/contact supporters

**Migration Strategy**
- Drizzle Kit for schema migrations (`npm run db:push`)
- Migrations stored in `/migrations` directory
- Schema versioning via timestamp-based migration files

## External Dependencies

### Authentication Service
- **Auth0**: OAuth 2.0 / OpenID Connect provider
  - Environment variables: `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_CALLBACK_URL`
  - Manages user authentication, session handling, and social login options
  - Automatic profile data sync (email, name, picture)

### Database Service
- **Neon Serverless PostgreSQL**: Managed PostgreSQL with serverless architecture
  - Environment variable: `DATABASE_URL`
  - WebSocket connection support for serverless environments
  - Connection pooling via `@neondatabase/serverless` client

### Development Tools
- **Replit Integration**: Development environment plugins
  - `@replit/vite-plugin-runtime-error-modal`: Error overlay for runtime errors
  - `@replit/vite-plugin-cartographer`: Code navigation and mapping
  - `@replit/vite-plugin-dev-banner`: Development mode indicator

### UI Component Libraries
- **Radix UI**: Headless UI component primitives (~20 components)
  - Accessibility-first design with ARIA compliance
  - Composable components: Dialog, Dropdown, Popover, Tabs, Toast, etc.
- **Lucide React**: Icon library for consistent iconography
- **embla-carousel-react**: Carousel/slider functionality

### Utility Libraries
- **date-fns**: Date formatting and manipulation (e.g., `formatDistanceToNow`)
- **class-variance-authority**: Type-safe CSS class composition
- **clsx** + **tailwind-merge**: Utility for merging Tailwind classes
- **Zod**: Schema validation (shared between client and server)

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions
  - Stores session data in PostgreSQL for persistence across restarts
  - Required by express-openid-connect for Auth0 integration

### Build & Development
- **TypeScript**: Type safety across full stack
- **ESBuild**: Fast bundling for server code
- **PostCSS** with **Autoprefixer**: CSS processing for Tailwind
