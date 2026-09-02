
# ExamYodha - Pro Auto-Update System
# Architecture: Next.js 14 + Supabase + Python Scrapers + GitHub Actions

## Daily Flow (6 AM IST)
Official Sites (UPSC/SSC/IBPS/RRB/LIC/State PCS) -> Python Scrapers -> AI Summary -> Supabase DB -> Vercel Webhook -> Site Rebuilds

## Quick Setup (30 mins)
1. Create Supabase project at supabase.com (free)
2. Run supabase_schema.sql in SQL Editor
3. Copy .env.example to .env
4. Deploy frontend to Vercel (import GitHub repo)
5. Add GitHub Secrets: SUPABASE_URL, SUPABASE_KEY, VERCEL_DEPLOY_HOOK
6. Push code - GitHub Actions will run daily automatically

## Your SSC Teaching Format Integration
Every exam page has a `teacher_notes` field where your clean large-text slides are embedded. Format preserved.
