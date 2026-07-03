# Elegant Drapes Order Tracker

Mobile-first order and profit tracker for a small WhatsApp and Instagram reselling business.

## MVP Included

- Supabase Auth login screen
- Dashboard with live monthly sales, profit, payment, and delivery summaries
- Add and edit booked item form with live profit and balance calculations
- Supabase Storage photo upload for order photos
- Orders page with mobile cards, desktop table, search, filters, quick status actions, edit, and delete
- Source group add, edit, and delete
- Reports summary with pending payment list and source group performance
- Supabase schema for orders, source groups, generated profit, generated balance, and order codes

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Add Supabase values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=order-photos
```

4. Run the SQL in `supabase/schema.sql` inside Supabase SQL Editor, or apply the files in `supabase/migrations` in order.

5. Create one admin user in Supabase Authentication.

6. Start the app:

```bash
pnpm dev
```

## Notes

The app falls back to demo data when Supabase keys are missing, so the interface can still be reviewed immediately. Once `.env.local` is configured and the SQL has run, the same screens use live Supabase data.

Order codes are generated in Supabase as `ED001`, `ED002`, and so on.

## Deploy To Vercel

1. Push this project to GitHub.
2. Open Vercel and choose **Add New Project**.
3. Import the GitHub repository.
4. Keep the framework as **Next.js**.
5. Add these Environment Variables in Vercel:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=order-photos
```

6. Click **Deploy**.

The included `vercel.json` uses `pnpm install` and `pnpm build`.
