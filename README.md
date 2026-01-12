# SenTracker - Premium MYR Finance Companion 💎

A high-end, consumer-grade expense tracker tailored for Malaysians. Built with a focus on **"Liquid Finance"** aesthetics, **privacy-first** architecture, and seamless **PWA** performance.

Now featuring **Natural Language Entry** — just type what you spent, and we'll handle the rest.

![SenTracker Hero Details](/public/icon.png)

---

## ✨ Flagship Features

### 🪄 Natural Language Entry (New!)

Skip the boring forms. Just type naturally, and our deterministic parser extracts the details instantly.

- **Input**: _"RM12 grab today"_
- **Output**: `RM12.00` • `Transport` • `Grab` • `Today`
- **Input**: _"Spent 15 myr on nasi lemak at ali mamak"_
- **Output**: `RM15.00` • `Food` • `Ali Mamak` • `Today`

_Powered by a custom deterministic parsing engine with Malaysian context awareness._

### 💰 Smart Finance

- **Money Vibe**: Instant visual indicator of your spending health.
- **Budget Coach**: Rule-based mentoring based on your spending patterns.
- **Monthly Insights**: Visual breakdowns of where your Ringgit goes.

### 📱 Progressive Web App (PWA)

- **Installable**: Native-like experience on iOS/Android.
- **Offline Capable**: View data without internet.
- **Adaptive Theming**: Seamless Day/Midnight modes.

---

## 🛠️ Tech Stack

**Core**

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **State**: Server Actions + React Hooks

**UI & Styling**

- **Styling**: Tailwind CSS
- **Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix Primitives)
- **Motion**: Framer Motion + GSAP
- **Icons**: Lucide React

**Features**

- **Validation**: Zod + React Hook Form
- **Date Handling**: date-fns (Malaysian Formats)
- **PWA**: next-pwa

---

## 📂 Project Structure

```bash
c:/Dev/BountyKD/SenTracker/
├── app/                  # Next.js App Router pages
│   ├── (auth)/          # Authentication routes (login/register)
│   ├── (protected)/     # App routes (dashboard, expenses, etc.)
│   └── layout.tsx       # Root layout with providers
├── components/           # React components
│   ├── expenses/        # Expense-specific components (NL entry, list)
│   ├── landing/         # Marketing page components
│   └── ui/              # shadcn/ui reusable primitives
├── lib/                  # Utilities and Logic
│   ├── actions/         # Server Actions (database mutations)
│   ├── nl/              # Natural Language Parsing Engine 🧠
│   │   ├── parser.ts    # Main parsing logic
│   │   ├── date.ts      # Date extraction (today, semalam)
│   │   └── keywords.ts  # Category mapping (food, mamak, grab)
│   └── supabase/        # Database clients
└── __tests__/           # Unit tests (Jest)
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/MuhdAqmarr/SenTracker.git
cd sentracker
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 4. Run Tests

Verify the Natural Language parser logic:

```bash
npm test
```

---

## 🇲🇾 Malaysian Context

- **Currency**: Figures formatted in **RM** (Ringgit Malaysia).
- **Date Formats**: Supports `DD/MM` (e.g., 12/01) and `D MMM` (e.g., 12 Jan).
- **Local Lingo**: Understands "semalam" (yesterday), "mamak", "teh ais", etc.

---

## 📄 License

MIT License.
