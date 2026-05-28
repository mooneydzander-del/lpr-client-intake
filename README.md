# LPR Client Intake

A standalone client intake form for **Landing Page Rocket** — built with Next.js 15, Tailwind CSS, and deployed on Vercel.

This is a separate project from the main LPR website. It is designed to be sent to paid clients after Shopify payment as a single link.

---

## Live URL (after deploy)

```
https://lpr-client-intake.vercel.app
```

or your custom domain if configured.

---

## Tech Stack

| Layer     | Tool                     |
|-----------|--------------------------|
| Framework | Next.js 15 (App Router)  |
| Styling   | Tailwind CSS v4          |
| Email     | Resend                   |
| Alerts    | Telegram Bot API         |
| Deploy    | Vercel                   |

---

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

| Variable                   | Required | Description                                     |
|----------------------------|----------|-------------------------------------------------|
| `RESEND_API_KEY`           | Optional | Resend API key for email notifications          |
| `INTAKE_NOTIFY_EMAIL`      | Optional | Email address to receive intake submissions     |
| `INTAKE_FROM_EMAIL`        | Optional | Verified "from" address in Resend               |
| `TELEGRAM_BOT_TOKEN`       | Optional | Telegram bot token for instant alerts           |
| `TELEGRAM_CHAT_ID_GENERAL` | Optional | Telegram chat/channel ID for alerts             |

> The form will submit successfully without any environment variables set. Notifications are only sent when the relevant env vars are present.

---

## Local Testing

### 1. Install dependencies

```bash
npm install
```

### 2. Create your `.env.local`

```bash
cp .env.local.example .env.local
# Open .env.local and fill in your values
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Test the form

- Fill in all required fields (Business Name, Contact Name, Email, Phone, Main Offer, Desired Action)
- Click **Submit Intake**
- You should see the success screen with the confirmation message
- If `RESEND_API_KEY` and `INTAKE_NOTIFY_EMAIL` are set, you will receive the full intake by email
- If `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID_GENERAL` are set, you will get an instant Telegram alert

### 5. Test the API directly (optional)

```bash
curl -X POST http://localhost:3000/api/client-intake \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Test Business",
    "contactName": "Test User",
    "email": "test@example.com",
    "phone": "555-000-0000",
    "mainOffer": "Test offer description",
    "desiredAction": "Call"
  }'
```

Expected response:

```json
{ "ok": true, "message": "Intake received." }
```

---

## Vercel Deployment

### Option A — Push to GitHub and deploy via Vercel Dashboard

1. Push this repository to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the `lpr-client-intake` repository
4. Vercel auto-detects Next.js — no build settings needed
5. Click **Deploy**
6. After deploy, go to **Settings → Environment Variables** and add each variable from `.env.local.example`
7. Click **Redeploy** to apply the env vars

### Option B — Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Recommended production URL

```
https://lpr-client-intake.vercel.app
```

---

## Routes

| Route                | Description                   |
|----------------------|-------------------------------|
| `/`                  | Main intake form              |
| `/client-intake`     | Alias — same form             |
| `/api/client-intake` | POST endpoint for submissions |

---

## Using as a Shopify Intake Link

After deploying, copy the production URL and paste it as the redirect or post-purchase link in your Shopify checkout:

```
https://lpr-client-intake.vercel.app/
```

---

## Spam Protection

The form includes a hidden honeypot field (`website_url`). If a bot fills it in, the submission is silently discarded with no error shown and no notification sent.

---

## Project Structure

```
lpr-client-intake/
├── src/
│   └── app/
│       ├── page.tsx              # Main intake form (8 sections)
│       ├── layout.tsx            # HTML shell, fonts, metadata
│       ├── globals.css           # LPR design system tokens
│       ├── client-intake/
│       │   └── page.tsx          # /client-intake alias
│       └── api/
│           └── client-intake/
│               └── route.ts      # POST handler (Resend + Telegram)
├── .env.local.example
├── next.config.ts
├── package.json
└── README.md
```
