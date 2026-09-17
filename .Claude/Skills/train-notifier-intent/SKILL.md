---
name: train-notifier-intent
description: Product intent, stack, hard constraints and agreed decisions for the train booking-open reminder app in this repo. Use before planning, designing or implementing any feature here, and when a request would change scope, data collected, notification timing, or the IRCTC boundary.
---

# RailNotify: intent

Read this before touching the codebase. It is the source of truth for scope and constraints. Details live in `intent.md` (intent), `plan.md` (implementation plan) and `spec.md` (requirements and design, when written).

## Problem
Indian Railways opens reservations 60 days before the travel date, at 8:00 AM IST (journey day excluded: travel on 1 Mar opens 31 Dec). Travellers forget the date and find popular trains sold out within minutes. A calendar reminder needs the user to know the rule and compute the date themselves.

## Outcome
A signed-in user saves a trip. They get an email the day before booking opens and at 7:45 AM IST on the booking-open day. The on-day email opens a Quick Book page with a countdown and their saved passenger details. Follow-up emails ask whether they booked and flag the Tatkal window the day before travel. Booking itself stays on IRCTC, done by the user.

## Stack (fixed)
Next.js 16 App Router, Supabase Postgres (service-role client, server only), Clerk for authentication, Resend for email, Upstash QStash schedules for the two daily runs, hosted on Vercel Hobby. Do not propose other ORMs, databases, auth providers or hosts.

## Hard constraints
- **Never automate IRCTC.** No scripted login, form fill, captcha handling or booking. It breaks IRCTC terms and Section 143 of the Railways Act. Quick Book only copies text and links out.
- **Data minimisation.** Passengers hold only name, age, gender and berth preference. No ID numbers, Aadhaar, PAN, phone or date of birth. Notes reject ID-number patterns. Passenger data and notes never appear in emails, logs, URLs or `.ics` files.
- **Two daily crons, nothing more frequent.** Two Upstash QStash schedules (decided 2026-09-16, replacing Vercel Cron so runs fire on time and retry on 5xx) call the cron routes, each once a day; requests are verified by QStash signature, with the `CRON_SECRET` bearer kept for local runs. The 7:45 AM IST run (`/api/cron/send-reminders`) sends day-before, on-day and follow-up emails and does housekeeping; the 10:30 AM IST run (`/api/cron/send-tatkal`) sends the Tatkal email the day before travel (AC opens 10:00, non-AC 11:00). Both are idempotent via per-type sent timestamps, which is what makes QStash retries safe.
- **Near-date edge cases** (decided 2026-09-15): a trip for tomorrow saved after 10:30 AM gets the Tatkal email immediately from `createReminder`; a trip for today gets "check current booking" guidance and no further reminders; `closeness` in the form state drives the copy.
- **Next.js 16 conventions.** Read `node_modules/next/dist/docs/` before writing code: `proxy.ts` replaces `middleware.ts`; `PageProps<'/route'>` and `RouteContext<'/route'>` are generated types; server actions are `'use server'` files validated with zod and consumed via `useActionState`.
- **Authorization in code.** RLS is on with no policies; every query filters on the Clerk `user_id` from `auth()`, never from input. Every server action re-checks `auth()` before any DB call.
- **Dates are strings.** Dates cross boundaries as `YYYY-MM-DD`; "today" is always computed in `Asia/Kolkata`; times are shown as "8:00 AM IST".
- **Trademark.** "IRCTC" and "Indian Railways" must not appear in the product name, logo, domain or sender. State non-affiliation in the footer and every email.

## Agreed decisions
- Email is the only channel in v1. `.ics` invite on confirmation gives a device alarm.
- Return-trip prompt after saving a trip; "Mark as booked" and Cancel on the dashboard.
- Saved passengers (max 20) and an assisted Quick Book page instead of any automation.
- Standards in place of missing org policies: OWASP ASVS 4.0 L1, WCAG 2.2 AA, DPDP Act 2023. Replace with org documents when they exist.

## Decisions made on 2026-09-15 (do not reopen without asking)
- Cron runs at 7:45 AM IST (`CRON_TZ=Asia/Kolkata 45 7 * * *` in `scripts/qstash-schedules.mts`); if a delivery is late the on-day email switches to a "booking opened" subject.
- A trip whose booking is already open is saved anyway; it skips the day-before and on-day emails and still gets the follow-up and Tatkal reminders.
- Passengers under 18 are refused (age 18–120); no guardian attestation in v1.
- Completed and cancelled trips are purged 30 days after travel. Per-user caps: 10 active trips, 10 trips per day, 20 passengers.
- Product name is **RailNotify** (`APP_NAME` in `lib/config.ts`). Decided 2026-09-15.

## Decisions still open (ask before assuming)
- Hobby (personal use) vs Pro (product) hosting.
- v2 candidates: trip sharing, festival warnings, PNR tracking, Telegram or WhatsApp.

## Code map
- `lib/db.ts` is the only place that queries Supabase; every function takes the Clerk user id.
- `lib/dates.ts` owns all IST date math; `lib/email.ts` the five templates; `lib/ics.ts` the calendar invite.
- `proxy.ts` (Clerk), `lib/cron.ts` (auth, date override, claim-then-send pass) shared by `app/api/cron/send-reminders` (7:45 AM) and `app/api/cron/send-tatkal` (10:30 AM), `app/api/webhooks/clerk/route.ts` (account deletion and email sync).
- Clerk 7 ("Core 3"): use `<Show when="signed-in">`, not `SignedIn`/`SignedOut`.

## Git
The project has its own `.git` (initialised 2026-09-15). The enclosing home directory is also a git repo; always run git commands from the project directory and check `git ls-files` before pushing.
