# Telegram Connector for MegaRAG

> **Status:** Proposal / Not Started  
> **Created:** 2026-02-16  
> **Estimated Effort:** ~Half a day  

## Overview

Add a Telegram bot that allows users to:
1. **Query the knowledge base** — ask questions and get RAG-powered answers
2. **Send documents** — upload files (PDF, DOCX, etc.) directly via Telegram for processing

## Feasibility Assessment

### Why This Works

MegaRAG's data layer is **entirely cloud-based**, making external access straightforward:

| Component | Location | Accessible Externally? |
|-----------|----------|----------------------|
| Supabase DB (chunks, entities, documents) | ☁️ Cloud | ✅ Yes |
| Supabase Storage (uploaded files) | ☁️ Cloud | ✅ Yes |
| Gemini API (embeddings, chat, parsing) | ☁️ Cloud | ✅ Yes |
| Next.js server (`npm run dev`) | 💻 Local | ❌ Not without deployment or tunnel |

The only barrier is that the Next.js server runs locally. This is solved by either deploying to Vercel or using a tunnel.

---

## Approach Options

### Option 1: Deploy to Vercel + Webhook (Recommended)

Deploy the existing Next.js app to Vercel and add a Telegram webhook endpoint.

**Pros:**
- Reuses all existing RAG logic (no code duplication)
- Free Vercel tier is sufficient
- One-command deploy (`vercel deploy`)
- Web UI and Telegram bot use the same backend

**Cons:**
- App must be deployed (not just running locally)
- Vercel serverless functions have a 10s timeout on free tier (may need pro for large docs)

**Steps:**
1. Deploy MegaRAG to Vercel
2. Create a Telegram bot via [@BotFather](https://t.me/botfather) → get bot token
3. Add new API route: `src/app/api/telegram/webhook/route.ts`
4. Register the webhook URL with Telegram: `https://api.telegram.org/bot<TOKEN>/setWebhook?url=<VERCEL_URL>/api/telegram/webhook`
5. Store `TELEGRAM_BOT_TOKEN` in environment variables

**New code needed:** ~50-100 lines (one API route file)

### Option 2: Standalone Bot (Direct Supabase + Gemini Access)

A separate Node.js script or Supabase Edge Function that connects directly to the database and Gemini API.

**Pros:**
- Fully independent — doesn't require the Next.js app to be running/deployed
- Can run as a Supabase Edge Function (serverless, always-on)
- Could run on any VPS, Raspberry Pi, etc.

**Cons:**
- Duplicates RAG logic (embedding generation, search, response formatting)
- More code to write and maintain
- Two separate codebases to keep in sync

**Steps:**
1. Create bot script with `grammy` or `node-telegram-bot-api`
2. Connect directly to Supabase using `@supabase/supabase-js`
3. Replicate embedding generation + `search_chunks` RPC calls
4. Deploy as Edge Function or long-running process

**New code needed:** ~200-300 lines

### Option 3: Local Dev with Tunnel (Quick Testing)

Use ngrok or Cloudflare Tunnel to temporarily expose localhost.

**Pros:**
- Zero deployment needed
- Great for testing before committing to a deployment strategy

**Cons:**
- Not persistent — stops when tunnel/dev server stops
- Free ngrok URLs change on restart
- Not suitable for production

**Steps:**
1. `npx ngrok http 3000`
2. Register the ngrok URL as the Telegram webhook
3. Add the webhook route (same as Option 1)

---

## Recommended Architecture (Option 1)

```
┌─────────────────┐     ┌──────────────────────────┐     ┌──────────────┐
│  Telegram User   │────▶│  Telegram Bot API         │────▶│  MegaRAG on  │
│  (sends message  │     │  (forwards to webhook)    │     │  Vercel      │
│   or document)   │◀────│                           │◀────│              │
└─────────────────┘     └──────────────────────────┘     └──────┬───────┘
                                                                │
                                                    ┌───────────┼───────────┐
                                                    │           │           │
                                              ┌─────▼──┐  ┌────▼───┐  ┌───▼────┐
                                              │Supabase│  │Supabase│  │ Gemini │
                                              │   DB   │  │Storage │  │  API   │
                                              └────────┘  └────────┘  └────────┘
```

## Webhook Route Sketch

```typescript
// src/app/api/telegram/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

export async function POST(req: NextRequest) {
  const update = await req.json();
  const message = update.message;
  
  if (!message) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  const text = message.text;

  // Handle document uploads
  if (message.document) {
    // 1. Download file from Telegram
    // 2. Upload to Supabase Storage
    // 3. Create document record
    // 4. Trigger processing
    await sendTelegramMessage(chatId, '📄 Document received! Processing...');
    return NextResponse.json({ ok: true });
  }

  // Handle text queries
  if (text) {
    // 1. Call existing RAG retrieval logic
    // 2. Generate response with context
    // 3. Send back to user
    const answer = await queryKnowledgeBase(text);
    await sendTelegramMessage(chatId, answer);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

async function sendTelegramMessage(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  });
}
```

## Prerequisites

- [ ] Telegram account
- [ ] Create bot via [@BotFather](https://t.me/botfather)
- [ ] Store `TELEGRAM_BOT_TOKEN` in `.env`
- [ ] Deploy to Vercel (or choose alternative approach)
- [ ] Register webhook URL with Telegram API

## Libraries to Consider

| Library | Purpose | Notes |
|---------|---------|-------|
| `grammy` | Telegram Bot framework | Modern, TypeScript-first, webhook-friendly |
| `node-telegram-bot-api` | Telegram Bot library | More established, larger community |
| None (raw fetch) | Direct Telegram API calls | Fewer dependencies, webhook route is simple enough |

## Environment Variables Needed

```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
```
