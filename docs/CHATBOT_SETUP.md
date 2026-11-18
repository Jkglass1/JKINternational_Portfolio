# JK Glasses Assistant — Website chatbot setup

The website chatbot is a guided sales assistant in **English (default), Hindi and Punjabi**. Every enquiry goes **directly into the JK International ERP** (CRM → Leads) together with the complete conversation. Google Sheets and Apps Script are **not** used by the chatbot.

```
Visitor's browser (jkglasses.com)                     JK International ERP (Vercel)
assets/js/jk-chatbot.js ── POST ──▶  https://jk-international-erp.vercel.app/api/public/website-chatbot
  + jk-chatbot-catalog.js (products)                    → crm_leads (source "Website Chatbot", code WEBSITE_CHATBOT)
  + jk-chatbot-faq.js (FAQ)                             → crm_lead_chat_sessions / crm_lead_chat_messages
```

## Visitor journey
1. Greeting → language (English default, Hindi, Punjabi; changeable any time from the header).
2. Full name + mobile (country code, India default) — **email optional**. The lead is created in the ERP at this point.
3. Menu: Explore our products · Product information · Request a quotation · Technical questions · Talk to our sales team · Other enquiries.
4. Category → Subcategory → Product (from `jk-chatbot-catalog.js`), product questions (specifications, price, minimum order, delivery time, certifications, comparison, uses) and typed questions.
5. Only the relevant requirement questions (all skippable): quantity, specifications, delivery location, timeline, additional message.
6. Summary → edit → confirm. "Successfully submitted" is shown **only after the ERP confirms**. If the ERP can't be reached, the visitor sees a retry button plus WhatsApp / call options, and nothing is lost.

Back, Home, refresh and close/reopen keep the conversation for the browser tab's session.

## What the answers are (no AI yet)
- **Knowledge base** — `src/assets/js/jk-chatbot-catalog.js` (products) and `src/assets/js/jk-chatbot-faq.js` (24 FAQs). Verified website facts only.
- **Rules** — fixed flow and policy messages in `jk-chatbot.js` (e.g. prices are quoted per requirement).
- **Not known** → "I'm sorry, I don't have verified information…" + call back / WhatsApp / call.

Each chatbot answer is stored in the ERP with its source (Knowledge base / Rule-based), shown on the conversation timeline.

## One-time deployment

### 1. ERP (Vercel → Project → Settings → Environment Variables, Production)
| Variable | Value |
|---|---|
| `WEBSITE_CHATBOT_ENABLED` | `true` |
| `WEBSITE_CHATBOT_ALLOWED_ORIGINS` | `https://jkglasses.com,https://www.jkglasses.com` (add any other domain the site is served from) |
| `WEBSITE_CHATBOT_IP_SALT` | any random string (e.g. output of `openssl rand -hex 16`) |
| `WEBSITE_CHATBOT_SESSIONS_PER_IP_HOUR` | optional, default 8 |

Then deploy the ERP as usual (commit + push the ERP changes). The database migration `20261118_website_chatbot_leads.sql` is **already applied**.

Check: open `https://jk-international-erp.vercel.app/api/public/website-chatbot` — it should show `{"ok":true,"service":"website-chatbot","enabled":true,"ai":false}`.

### 2. Website
`src/assets/js/lead-config.js` → `chatbot.erpEndpoint` already points at the ERP. Publish the site as usual (GitHub Pages).

### 3. Try it once
Open the live site, run one enquiry with your own number, then open ERP → CRM → Leads → filter **Website Chatbot Leads** → **💬 Conversation**. Delete or mark that test lead LOST afterwards.

## Editing products and answers
- Products: `src/assets/js/jk-chatbot-catalog.js` (guide at the top). Verified facts only — no prices, delivery times or minimum quantities unless the company approves them.
- FAQ: `src/assets/js/jk-chatbot-faq.js`. Test matching in the browser console: `JKChatbot.match('price of 12mm glass')`.

## Future AI answers
Nothing is paid or connected today. When an AI key is approved, a provider is added **inside the ERP** (`src/lib/website-chatbot/ai/provider.ts`) with the key in Vercel environment variables. The chatbot UI, lead creation, conversation storage and ERP screens stay unchanged.

## Legacy files
`docs/GoogleAppsScript_Chatbot.gs` and `docs/GoogleAppsScript_ChatbotKnowledge.gs` belonged to the earlier Sheets/Apps Script chatbot and are **not used**. Do not deploy them. The quotation form on `contact.html` still uses `GoogleAppsScript_Code.gs` as before.

## Troubleshooting
| Symptom | Fix |
|---|---|
| Submit always shows "couldn't submit" | Check the health URL above: `enabled` must be `true`; the site's domain must be in `WEBSITE_CHATBOT_ALLOWED_ORIGINS`. |
| Visitors see "Please enter a valid mobile number" for a real number | Indian mobiles must be 10 digits starting 6–9; other countries need the right country code. |
| Lead is missing a product | The visitor didn't pick one ("Not sure yet") — the conversation still shows what they asked. |
| Hide the chatbot | `lead-config.js` → `chatbot.enabled: false`. Stop ERP writes immediately: set `WEBSITE_CHATBOT_ENABLED=false`. |
