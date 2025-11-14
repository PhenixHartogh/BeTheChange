# Be the Change - Petition Platform

## Overview
Be the Change is a petition platform enabling users to create, sign, and manage petitions for social causes. It supports petition creation, signature collection (with email verification), progress tracking, and secure management by creators. The platform emphasizes privacy, social sharing, and responsive design, with all MVP features completed.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend uses **React 18 with TypeScript** and **Vite** for a fast development experience. **Wouter** handles client-side routing. UI components are built with **shadcn/ui** (based on Radix UI) and styled using **Tailwind CSS**, following a "new-york" design preset with a focus on clarity and bold typography. **TanStack Query** manages server state and caching, while **React Hook Form** with **Zod** handles form validation. The architecture is component-first, ensuring reusability and separation of concerns.

### Backend Architecture
The backend is built with **Express.js** and **TypeScript** (Node.js, ESM). It features a **RESTful API** with clear separation of public and protected endpoints. **Auth0** is integrated via `express-openid-connect` for secure OAuth 2.0/OIDC authentication and role-based access control. Data access is abstracted through an `IStorage` interface, implemented using **Drizzle ORM** for type-safe PostgreSQL queries.

### Data Storage
The platform uses **PostgreSQL** via **Neon serverless** for its database, managed with **Drizzle ORM**. The schema is defined in `shared/schema.ts` and includes tables for `Users`, `Petitions`, `Signatures`, `Announcements`, `Comments`, and `DecisionMakers`. Data privacy is paramount, with full signature PII accessible only to petition creators. Drizzle Kit is used for schema migrations.

### UI/UX Decisions
The design is inspired by Change.org and Stripe, featuring a clean, accessible interface with bold typography (Inter font family) and an activist energy. It includes custom CSS variables for theming, responsive design across all devices, and prominent search functionality.

### Technical Implementations
- **Authentication**: Auth0 for secure user login, registration, and automatic user provisioning.
- **Authorization**: Role-based access ensures petition creators have exclusive access to sensitive data.
- **Data Validation**: Zod schemas are used for robust server-side and client-side validation.
- **Email Verification**: Token-based email verification for signatures.
- **Spam Prevention**: hCaptcha protects forms from bots.

### Feature Specifications
- **Petition Management**: Create, edit, close, win, and delete petitions.
- **Signature Collection**: Comprehensive form with PII collection, email verification, and privacy consent.
- **Reporting**: Organizer dashboard for full signature data view and CSV export.
- **Communication**: Announcement system for creators to notify signers; "Contact Author" feature for supporters.
- **Legal Compliance**: Comprehensive legal pages (T&C, Privacy Policy, Cookie Policy, Accessibility Statement, Community Guidelines) and cookie consent banner.
- **Analytics**: GA4 integration with user consent.

## External Dependencies

### Authentication
- **Auth0**: OAuth 2.0 / OpenID Connect provider for user authentication and session management.

### Database
- **Neon Serverless PostgreSQL**: Managed PostgreSQL database with WebSocket support for connection pooling.

### Email Service
- **Resend**: Transactional email provider for verification emails, announcements, and contact messages.

### Spam Protection
- **hCaptcha**: CAPTCHA service for bot protection on forms.
- **Email Verification**: Verifies email addrese before signature counted.

### UI Libraries
- **Radix UI**: Headless UI component primitives for accessibility.
- **Lucide React**: Icon library.
- **embla-carousel-react**: Carousel functionality.

### Utility Libraries
- **date-fns**: Date manipulation.
- **class-variance-authority**, **clsx**, **tailwind-merge**: CSS class utilities.
- **Zod**: Schema validation.

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express.

### Development Tools
- **TypeScript**: Type safety.
- **Vite**: Frontend build tool.
- **ESBuild**: Backend bundling.
- **PostCSS** with **Autoprefixer**: CSS processing.