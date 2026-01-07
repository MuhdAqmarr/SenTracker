# SenTracker - MYR Expense Tracker & Budget Coach

A modern expense tracking application built for Malaysian Ringgit (MYR) users. Track expenses, set budgets, and get insights into your spending habits.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ecf8e)

## Features

- **OAuth Authentication** - Sign in with Google or GitHub
- **Expense Tracking** - Add, edit, and delete expenses with categorization
- **Budget Management** - Set monthly budgets for each category
- **Analytics Dashboard** - View spending breakdown, top merchants, and budget health
- **CSV Export** - Export monthly expense data to CSV
- **Mobile Responsive** - Works great on all devices

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd sentracker
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration file at `supabase/migrations/001_initial_schema.sql`
3. Configure OAuth providers:
   - Go to **Authentication** > **Providers**
   - Enable **Google** and **GitHub**
   - Add your OAuth credentials
4. Set the redirect URL to: `http://localhost:3000/auth/callback`

### 3. Configure Environment

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (auth)/           # Auth routes (login)
│   ├── (protected)/      # Protected routes (dashboard, budget)
│   └── auth/callback/    # OAuth callback handler
├── components/
│   ├── auth/             # Auth components
│   ├── budget/           # Budget form components
│   ├── dashboard/        # Dashboard analytics components
│   ├── expenses/         # Expense CRUD components
│   ├── layout/           # Layout components (sidebar, header)
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── actions/          # Server actions
│   ├── supabase/         # Supabase clients
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod schemas
├── types/
│   └── database.ts       # TypeScript types for Supabase
└── supabase/
    └── migrations/       # SQL migrations
```

## Malaysian Context

- All currency displayed in **RM** (Malaysian Ringgit)
- Date format: **DD/MM/YYYY**
- Pre-configured expense categories relevant to Malaysian lifestyle

## License

MIT
