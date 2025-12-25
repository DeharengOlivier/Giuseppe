# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a professional portfolio application with an integrated CMS (Content Management System) built with Next.js 15, TypeScript, and a dual-database architecture: SQLite for content and MongoDB for analytics.

The application features a fully dynamic front-end where all content can be managed through an admin interface, with real-time analytics tracking visitor behavior including geolocation data.

## Development Commands

### Setup & Database
```bash
# Install dependencies
npm install

# Generate Prisma client (after schema changes)
npm run db:generate

# Push schema changes to SQLite database
npm run db:push

# Seed database with demo data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Development
```bash
# Start development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint
```

### MongoDB Setup
MongoDB must be installed and running for analytics. On macOS:
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

For other systems, see MONGODB_SETUP.md.

### Quick Start Script
```bash
# Automated startup (checks MongoDB, seeds DB if needed)
./start.sh
```

## Architecture Overview

### Dual Database System

**SQLite (via Prisma)** - `/lib/prisma.ts`
- Content management (articles, prestations, experiences, pages, courses)
- User authentication
- Page content
- Theme configuration
- Database file: `prisma/dev.db`
- Schema: `prisma/schema.prisma`

**MongoDB** - `/lib/mongodb.ts`
- Analytics and visit tracking
- Collection: `visits` in `portfolio_analytics` database
- Stores: IP, geolocation, user agent, referer, timestamp
- No rate limiting - all visits tracked

### Authentication & Authorization

- **NextAuth v5** with credentials provider (`auth.ts`)
- JWT-based sessions
- Admin pages protected via route groups: `/app/admin/(protected)`
- Login page: `/app/admin/login`
- Default credentials set via `.env`: `ADMIN_EMAIL` and `ADMIN_PASSWORD`

### App Structure (Next.js App Router)

```
/app
  /admin
    /(protected)          # Protected by NextAuth
      /articles          # Article CRUD
      /prestations       # Prestation CRUD
      /experiences       # Experience CRUD
      /page-content      # Dynamic page content editing
      /analytics         # Analytics dashboard
      /design-system     # Theme editor
      /pages             # Custom pages management
      /courses           # Courses management
    /components          # Admin UI components
    /login              # Auth page
  /articles             # Public article pages
  /prestations          # Public prestations page
  /experiences          # Public experiences timeline
  /[slug]               # Dynamic pages
  /api
    /analytics          # Visit tracking & stats
    /articles           # Article CRUD API
    /prestations        # Prestation CRUD API
    /experiences        # Experience CRUD API
    /page-content       # Content API
    /themes             # Theme management API
    /pages              # Pages API
    /courses            # Courses API
    /upload             # File upload
    /auth/[...nextauth] # NextAuth handlers
  /components           # Public components
    AnalyticsTracker.tsx    # Client-side tracking
    ThemeProvider.tsx       # Dynamic theming
    PageTemplates/          # Reusable page templates
```

### Data Models (Prisma Schema)

**Core Content Models:**
- `Article` - Blog posts with rich text editor (TipTap)
- `Prestation` - Services with benefits array (JSON)
- `Experience` - Professional timeline with skills array (JSON)
- `Course` - Educational/training courses
- `Page` - Dynamic custom pages with JSON content
- `PageContent` - Key-value pairs for editable page sections

**System Models:**
- `User` - Admin authentication (bcrypt hashed passwords)
- `Theme` - Design system configuration (JSON)
- `Settings` - Global key-value settings

**Important:** Arrays like `benefits` and `skills` are stored as JSON strings in SQLite and must be parsed/stringified in API routes.

### Analytics System

**Client-side:** `AnalyticsTracker.tsx` component sends POST to `/api/analytics`

**Server-side:**
- Geolocation via ip-api.com (free tier, 45 req/min)
- Tracks all public pages automatically
- Admin pages excluded from tracking
- Data structure: `{ ip, page, country, city, region, timezone, ll: [lat, lon], userAgent, referer, timestamp }`

**Dashboard:** `/app/admin/(protected)/analytics/page.tsx`
- Stats API: `/api/analytics/stats`
- Real-time metrics (24h, 7d, total)
- Top countries and pages
- Filterable visit list

### Theming System

- Dynamic theme configuration stored in `Theme` model
- Themes loaded via `ThemeProvider` component
- Design tokens stored as JSON config
- Google Fonts integration via `GoogleFontsLoader`
- Theme editor in admin: `/admin/design-system`

## Working with the Codebase

### Adding a New Content Type

1. Add model to `prisma/schema.prisma`
2. Run `npm run db:generate && npm run db:push`
3. Create API routes in `/app/api/[model-name]/route.ts` and `/app/api/[model-name]/[id]/route.ts`
4. Add admin page in `/app/admin/(protected)/[model-name]/page.tsx`
5. Create public page in `/app/[model-name]/page.tsx`
6. Update seed script if needed: `prisma/seed.ts`

### Modifying Page Content

Page content is managed via the `PageContent` model with unique keys (e.g., `home_hero_title`, `home_hero_subtitle`). Fetch and update via `/api/page-content`.

### API Route Patterns

**List/Create:**
```typescript
// app/api/[resource]/route.ts
export async function GET() { /* fetch list */ }
export async function POST() { /* create */ }
```

**Read/Update/Delete:**
```typescript
// app/api/[resource]/[id]/route.ts
export async function GET(req, { params }) { /* fetch one */ }
export async function PUT(req, { params }) { /* update */ }
export async function DELETE(req, { params }) { /* delete */ }
```

### Protected Routes

Admin pages use NextAuth middleware. To protect a page, place it in `/app/admin/(protected)/`.

Access session in server components:
```typescript
import { auth } from '@/auth'
const session = await auth()
```

### Rich Text Editor

Articles use TipTap editor. Content stored as HTML string. Admin components in `/app/admin/components/`.

### File Uploads

Upload endpoint: `/api/upload`
- Saves to `/public/uploads/`
- Returns URL for use in content

## Environment Variables

Required in `.env`:

```env
# SQLite
DATABASE_URL="file:./dev.db"

# MongoDB
MONGODB_URI="mongodb://localhost:27017/portfolio_analytics"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Admin credentials
ADMIN_EMAIL="admin@portfolio.com"
ADMIN_PASSWORD="Admin123!"
```

## Path Aliases

TypeScript configured with `@/*` mapping to project root:
```typescript
import { prisma } from '@/lib/prisma'
import clientPromise from '@/lib/mongodb'
```

## Key Technologies

- **Next.js 15** - App Router, Server Components, API Routes
- **TypeScript** - Strict mode enabled
- **Prisma** - SQLite ORM
- **MongoDB** - Native driver (not Prisma)
- **NextAuth v5** - Credentials auth with bcrypt
- **TipTap** - Rich text editor
- **Tailwind CSS 4** - Styling
- **React Hook Form** - Form handling
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **geoip-lite** - IP geolocation fallback

## Common Gotchas

1. **JSON fields in Prisma:** `benefits` and `skills` are stored as strings - always `JSON.parse()` when reading, `JSON.stringify()` when writing
2. **MongoDB connection:** Uses global promise pattern to avoid reconnections in development
3. **Prisma client:** Uses singleton pattern in development (`lib/prisma.ts`)
4. **Slugs:** Auto-generated from titles in article creation (client-side transforms)
5. **Analytics rate limiting:** ip-api.com has 45 req/min limit - falls back to unknown if exceeded
6. **File uploads:** Files stored in `/public/uploads/` - must be gitignored if sensitive

## Admin Access

Login: `http://localhost:3000/admin/login`
Default: `admin@portfolio.com` / `Admin123!` (configurable via `.env` + reseed)

Change password by updating `.env` and running `npm run db:seed` (overwrites existing admin user).
