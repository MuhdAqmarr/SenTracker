# SenTracker - Premium MYR Finance Companion 💎

A high-end, consumer-grade expense tracker tailored for Malaysians. Built with a focus on "Liquid Finance" aesthetics, privacy-first architecture, and seamless PWA performance.

![SenTracker Hero Details](/app/icon.png)

## ✨ Premium Features

### 🎨 Awwwards-Level UX

- **Liquid Gradient Engine**: A custom GPU-accelerated background that creates a calm, floating aurora effect.
- **Glassmorphism 2.0**: Multi-layered blur effects with dynamic lighting and noise textures.
- **Cinematic Motion**: Powered by **GSAP** and **Framer Motion** for silky smooth page transitions and scroll triggers.
- **Interactive 3D Elements**: CSS-based 3D transformations for cards and phone mockups (0kb asset weight!).

### 📱 Progressive Web App (PWA)

- **Installable**: Adds to home screen on iOS and Android.
- **Offline Capable**: Check your budget even without data.
- **Haptic Feedback**: Subtle vibrations for tactile interactions (mobile only).
- **Adaptive Theming**: intelligently switches between a crisp "Daylight" mode and a deep "Midnight" OLED mode.

### 💰 Finance Features (MYR Optimized)

- **Smart Dashboard**: "Money Vibe" indicator that tells you if you're safe to spend.
- **Budget Coach**: A rule-based financial mentor that gives actionable advice based on your spending patterns.
- **Monthly Insights**: Visual breakdown of where your Ringgit is going.
- **Quick-Add**: Optimized mobile flow to add expenses in under 3 seconds.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth)
- **Styling**: Tailwind CSS + Custom Design System
- **Animation**: GSAP + Framer Motion
- **Icons**: Lucide React
- **Hosting**: Vercel (Recommended)

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/MuhdAqmarr/SenTracker.git
cd sentracker
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The landing page demonstrates the full premium experience.

---

## 🌐 Deployment (Vercel)

1. **Import** the repository to Vercel.
2. **Add Environment Variables** (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3. **Deploy**!
4. **Important**: Go to Supabase > Authentication > URL Configuration and set your Site URL to your new Vercel domain (e.g., `https://sentracker.vercel.app`).

---

## 🇲🇾 Malaysian Context

- **Currency**: All figures formatted in **RM**.
- **Date**: DD/MM/YYYY format.
- **Lifestyle Categories**: Includes tailored categories like 'Mamak', 'Grab', etc.

## 📄 License

MIT License.
