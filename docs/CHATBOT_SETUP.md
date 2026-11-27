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
4. Category → Subcategory → Product (from `jk-chatbot-catalog.js`), product questions (specifications, price, minimum order, delivery time, certifications, comparison / types available, uses) and typed questions. **Aluminium and uPVC skip the product step**: the visitor picks Windows, Doors or Facades and goes straight to the product. Window and door styles (sliding, casement…) are shown only if they ask "Types available"; they are never a choice the visitor has to make.
5. Only the relevant requirement questions (all skippable): quantity, specifications, delivery location, timeline, additional message. The size / specifications question offers **📷 Send a photo** for visitors who can't name a size.
6. Summary card (your details, your requirement, photos; empty answers left out) with **Confirm & submit** and **Edit details** at the bottom. "Successfully submitted" is shown **only after the ERP confirms**. If the ERP can't be reached, the visitor sees a retry button plus WhatsApp / call options, and nothing is lost.

**Photos & drawings.** After giving their details, a visitor can send up to 5 files: photos (JPG, PNG…) or PDF drawings up to 3 MB. They can use:
- the 📎 paper-clip next to the message box (works on every step, including the summary and the Edit form),
- the "📎 Send a photo or drawing" option on the size / specifications question,
- the **Add a photo or drawing** button on the summary card and in the **Edit details** form (typed but unsaved edits are kept while a file uploads).

The browser shrinks each photo to a JPEG of at most 1600 px (usually 100–600 KB); PDFs are sent as-is. The ERP checks the file really is a JPEG / PNG / WebP / PDF, stores it on Cloudinary (`jkerp/<company>/WEBSITE_CHATBOT/<conversation>`), and shows it in CRM → Leads → 💬 Conversation (in the transcript and under *Photos & drawings from customer*). These buttons only appear when the ERP reports `"attachments":true`.

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
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | already used by ERP attachments; visitor photos need them too |
| `WEBSITE_CHATBOT_ATTACHMENTS` | optional: `false` turns visitor photos off (the camera button disappears) |

Then deploy the ERP as usual (commit + push the ERP changes). The database migration `20261118_website_chatbot_leads.sql` is **already applied**; photos need no new migration (they are stored in the existing `crm_lead_chat_messages.meta`).

Check: open `https://jk-international-erp.vercel.app/api/public/website-chatbot` — it should show `{"ok":true,"service":"website-chatbot","enabled":true,"ai":false,"attachments":true}`. `attachments` missing means the ERP deploy with photo support is not live yet; `false` means Cloudinary is not configured (or switched off).

### 2. Website
`src/assets/js/lead-config.js` → `chatbot.erpEndpoint` already points at the ERP. Publish the site as usual (GitHub Pages). Either order is safe: the site shows the camera button only once the ERP says it accepts photos.

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
| No paper-clip / "Add a photo or drawing" button | The health URL must show `"attachments":true` (ERP deployed with photo support, Cloudinary variables set). The buttons also stay hidden until the visitor has entered their name and mobile. |
| "File could not be uploaded" | Usually the visitor's connection; they can tap *Try again* (the same file is never stored twice) or use WhatsApp. If it happens for everyone, check the Cloudinary variables. |
| A PDF drawing opens with an error in the CRM | Cloudinary blocks PDF delivery on some accounts: Cloudinary console → Settings → Security → allow delivery of PDF and ZIP files. (Same setting the ERP's own PDF attachments rely on.) |
