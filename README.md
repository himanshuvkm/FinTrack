<div align="center">
  <h1>FinTrack</h1>
  <p>An AI-powered personal finance platform — track expenses, automate recurring transactions, scan receipts, and get monthly insights powered by Gemini AI.</p>

  <p>
    <a href="https://finnntrack.vercel.app"><strong>Live Demo →</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/github/contributors/himanshuvkm/FinTrack.svg?style=flat-square" />
    <img src="https://img.shields.io/github/stars/himanshuvkm/FinTrack.svg?style=flat-square" />
    <img src="https://img.shields.io/github/forks/himanshuvkm/FinTrack.svg?style=flat-square" />
    <img src="https://img.shields.io/github/issues/himanshuvkm/FinTrack.svg?style=flat-square" />
    <img src="https://img.shields.io/github/license/himanshuvkm/FinTrack.svg?style=flat-square" />
  </p>
</div>

---

[![Product Screenshot](https://github.com/himanshuvkm/FinTrack/blob/main/public/Preview.png?raw=true)](https://finnntrack.vercel.app)

---

## What is FinTrack?

FinTrack gives you a clear, real-time picture of your financial life. Log income and expenses, set budgets with alert thresholds, automate recurring payments, and let AI analyse your spending patterns — all in one place.

---

## Features

| Feature | Description |
|---|---|
| **Dashboard** | Visual overview of income, expenses, and net balance with interactive charts |
| **Transaction management** | Add, edit, and categorise transactions with full history |
| **Budget tracking** | Set per-category budgets; receive email alerts when you approach limits |
| **Recurring transactions** | Automate repeating income or expenses — daily, weekly, or monthly |
| **AI receipt scanning** | Upload a receipt and Gemini AI extracts the amount, merchant, and category |
| **Monthly AI reports** | Personalised financial health summaries delivered to your inbox each month |
| **Secure auth** | Clerk-powered sign-in with social login and MFA support |
| **Rate limiting** | Arcjet protects all API routes from abuse |

---

## Tech Stack

**Frontend**
- [Next.js 14](https://nextjs.org/) — App Router, Server Actions
- [React](https://react.dev/) — UI library
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — styling and components

**Backend & Database**
- [Supabase](https://supabase.com/) — managed Postgres database
- [Prisma](https://www.prisma.io/) — type-safe ORM

**Services**
- [Clerk](https://clerk.com/) — authentication and user management
- [Gemini AI](https://ai.google.dev/) — receipt scanning and monthly insights
- [Inngest](https://www.inngest.com/) — background jobs for recurring transactions and reports
- [Resend](https://resend.com/) — transactional email (budget alerts, monthly reports)
- [Arcjet](https://arcjet.com/) — rate limiting and bot protection

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- A [Supabase](https://supabase.com/) project
- A [Clerk](https://clerk.com/) project
- A [Gemini AI](https://ai.google.dev/) API key

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/himanshuvkm/FinTrack.git
cd FinTrack
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file at the root of the project and fill in the values below.

4. **Push the database schema**

```bash
npx prisma db push
```

5. **Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

```env
# Clerk — https://dashboard.clerk.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Supabase / Prisma — https://supabase.com/dashboard
DATABASE_URL=
DIRECT_URL=

# Gemini AI — https://aistudio.google.com/app/apikey
GEMINI_API_KEY=

# Resend — https://resend.com/api-keys
RESEND_API_KEY=

# Inngest — https://app.inngest.com
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Arcjet — https://app.arcjet.com
ARCJET_KEY=
```

---

## Project Structure

```
fintrack/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Sign-in / sign-up routes
│   ├── (main)/           # Protected app routes (dashboard, accounts, transactions)
│   └── api/              # API route handlers
├── components/           # Shared UI components
├── lib/                  # Utility functions, Prisma client, AI helpers
├── inngest/              # Background job definitions
├── prisma/               # Prisma schema and migrations
└── public/               # Static assets
```

---

## Contributing

Contributions are welcome — bug reports, feature requests, documentation improvements, and code all help.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages where possible.

---

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

## Contact

**Himanshu Vishwakarma**
- Email: himanshuvkm252@gmail.com
- GitHub: [@himanshuvkm](https://github.com/himanshuvkm)
- LinkedIn: [himanshuvkm](https://linkedin.com/in/himanshuvkm)
- Project: [github.com/himanshuvkm/FinTrack](https://github.com/himanshuvkm/FinTrack)