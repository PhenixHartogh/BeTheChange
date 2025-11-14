# Be the Change - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from Change.org's clarity and Stripe's modern restraint, with bold activist energy. This platform needs to inspire action while maintaining trust and professionalism.

**Core Principles**: Empowerment through bold typography, clarity in calls-to-action, progress transparency, and community trust signals.

---

## Typography

**Font System** (Google Fonts):
- **Headings**: Inter Bold (700) - commanding, modern
- **Body**: Inter Regular (400) and Medium (500)
- **Accents**: Inter SemiBold (600) for CTAs and emphasis

**Scale**:
- Hero headlines: text-5xl to text-7xl
- Section headers: text-3xl to text-4xl  
- Petition titles: text-2xl to text-3xl
- Body text: text-base to text-lg
- Metadata/counts: text-sm to text-base

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Tight spacing: p-2, gap-2 (compact elements)
- Standard: p-4, p-6, gap-4 (cards, forms)
- Section padding: py-12, py-16, py-20 (desktop sections)
- Generous: p-8, p-12 (featured content)

**Container Strategy**:
- Full-width hero: w-full with max-w-7xl inner
- Content sections: max-w-6xl
- Petition cards grid: max-w-7xl
- Form containers: max-w-2xl

---

## Core Components

### Navigation
- Sticky header with logo left, auth buttons right
- "Start a Petition" primary CTA in header (always visible)
- Clean, minimal navigation links
- User profile dropdown when authenticated

### Petition Cards
- Image thumbnail (16:9 ratio)
- Bold petition title
- Signature count with progress bar
- Creator name and timeframe
- Category badge
- Grid layout: 1 column mobile, 2 columns tablet, 3 columns desktop

### Petition Detail Page
- Large petition image (hero-style, 3:2 ratio)
- Title + description in readable column (max-w-3xl)
- Sticky signature panel (right sidebar desktop, bottom mobile)
- Signature count with animated progress ring
- Recent signatures list (showing first name, last initial, location)

### Signature Form
- Single-column form with clear labels
- Fields: First Name, Last Name, Email, Phone, Postcode
- Privacy notice below form
- Bold "Sign This Petition" primary button
- Success state with sharing options

### Create Petition Form
- Multi-step or single-page form
- Image upload with preview
- Title, description (rich text), category selector, signature goal
- Preview mode before publishing

### Dashboard (Organizer View)
- Petition stats cards (total signatures, recent growth, completion %)
- Downloadable signature list
- Table view of all signatures with sortable columns

---

## Page Layouts

### Homepage
- **Hero Section** (80vh): Impactful hero image showing diverse activists/community, overlay with "Start a Petition" CTA and headline "Be the Change You Want to See"
- **Featured Petitions** (3-column grid): Trending petitions with high signature counts
- **Categories Section**: Icon-based category cards (Environment, Social Justice, Education, etc.)
- **Impact Stats**: Large numbers showing total petitions, signatures, victories
- **How It Works**: 3-step process (Create → Share → Win)
- **Recent Victories**: Success stories in 2-column layout
- **Final CTA**: Bold section encouraging petition creation

### Browse Petitions
- Filter sidebar (desktop) or dropdown (mobile): Category, status, location
- Search bar prominent at top
- Petition cards in responsive grid
- Load more or pagination

### Petition Detail
- Full-width hero image with gradient overlay
- Content in centered column with signature panel
- Updates section (timeline of petition progress)
- Similar petitions at bottom

---

## Images

**Hero Image (Homepage)**: Diverse group of activists holding signs, showing energy and community - warm, inspiring tone. Full-width, 1920x1080px minimum.

**Petition Images**: User-uploaded photos related to their cause. Placeholder suggestions: community gatherings, environmental scenes, educational settings. Aspect ratio 16:9 for cards, 3:2 for detail pages.

**Success Stories**: Real or illustrative photos of petition victories - celebrations, policy changes, community impact. 2:1 landscape ratio.

**Category Icons**: Use Heroicons for category representations (scale, academic-cap, globe, heart, etc.)

---

## Interactions & States

**Progress Indicators**: Circular progress rings for petition goals, animated on scroll into view

**Form Validation**: Inline validation with clear error states, green checkmarks on valid fields

**Loading States**: Skeleton screens for petition cards, subtle pulse animation

**Signature Success**: Confetti animation or success checkmark, immediate signature count update, sharing modal

**Hover States**: Petition cards lift slightly (shadow increase), buttons darken/brighten appropriately

---

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation throughout
- Focus indicators on all form fields and buttons
- Color contrast ratios meet WCAG AA standards
- Screen reader announcements for signature count updates

---

**Design Philosophy**: Bold yet professional, empowering yet trustworthy. Every element should encourage action while building credibility. This is about real change, so the design must feel authentic, not gimmicky.