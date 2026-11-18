/**
 * =========================================================================
 * JK INTERNATIONAL — WEBSITE AI CHATBOT BACKEND
 * Chatbot lead capture + Claude AI replies, stored in the same Google Sheet
 * =========================================================================
 *
 * Lives in the same Apps Script project as GoogleAppsScript_Code.gs (whose
 * doPost routes every "chat.*" request here) and
 * GoogleAppsScript_ChatbotKnowledge.gs (assistant instructions + company
 * knowledge). Setup guide: docs/CHATBOT_SETUP.md
 *
 * Script Properties (Project Settings > Script Properties):
 *   ANTHROPIC_API_KEY            required. The Claude API key. Never put it in website code.
 *   CHAT_MODEL                   default "claude-opus-5-5"
 *   CHAT_FALLBACK_MODEL          optional second model if the main one is unavailable, e.g. "claude-sonnet-5-5"
 *   CHAT_EFFORT                  low | medium | high (default "low" keeps replies quick)
 *   CHAT_MAX_TOKENS              default 8000
 *   CHAT_SERVER_FALLBACKS        "default" lets Anthropic re-run a declined request on a suitable model; "off" disables it
 *   CHAT_LIMIT_PER_VISITOR_HOUR  AI replies per visitor per hour (default 30)
 *   CHAT_LIMIT_SITE_HOUR         AI replies per hour across the whole site (default 200)
 *   CHAT_LIMIT_SITE_DAY          AI replies per day across the whole site (default 800)
 *   CHAT_LIMIT_NEW_LEADS_HOUR    new chatbot leads per hour across the site (default 40)
 */

var CHAT_SHEET_NAME = 'Chatbot Leads';
var CHAT_API_URL = 'https://api.anthropic.com/v1/messages';
var CHAT_API_VERSION = '2026-10-21';

var CHAT_SETTINGS = {
  CHAT_MODEL: 'claude-opus-5-5',
  CHAT_FALLBACK_MODEL: '',
  CHAT_EFFORT: 'low',
  CHAT_MAX_TOKENS: '8000',
  CHAT_SERVER_FALLBACKS: 'default',
  CHAT_LIMIT_PER_VISITOR_HOUR: '30',
  CHAT_LIMIT_SITE_HOUR: '200',
  CHAT_LIMIT_SITE_DAY: '800',
  CHAT_LIMIT_NEW_LEADS_HOUR: '40'
};

var CHAT_TOKEN_MAX_AGE_DAYS = 30;
var CHAT_MAX_MESSAGE = 1000;
var CHAT_MAX_HISTORY = 16;
var CHAT_TRANSCRIPT_LIMIT = 45000; // a Sheets cell holds 50,000 characters

var CHAT_LANGUAGE_NAMES = { pa: 'Punjabi', hi: 'Hindi', en: 'English' };
var CHAT_LANGUAGE_SCRIPTS = { pa: 'Punjabi, Gurmukhi script', hi: 'Hindi, Devanagari script', en: 'English' };
var CHAT_STATUSES = ['New', 'Contacted', 'Qualified', 'Quotation Sent', 'Won', 'Lost'];
var CHAT_STATUS_COLOURS = { 'New': '#fef3c7', 'Contacted': '#dbeafe', 'Qualified': '#e0e7ff', 'Quotation Sent': '#ede9fe', 'Won': '#dcfce7', 'Lost': '#f1f5f9' };
var CHAT_ACTIONS = { quote: 'Quotation request', callback: 'Callback request', sales: 'Talk to sales team', enquiry: 'Project enquiry' };
var CHAT_CALL_TIMES = { any: 'Any time', morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' };
var CHAT_CUSTOMER_TYPES = ['', 'Residential', 'Commercial', 'Contractor', 'Architect', 'Builder', 'Dealer', 'Other'];
var CHAT_PRODUCTS = ['Glass', 'Aluminium', 'uPVC'];

var CHAT_COLUMNS = [
  'Lead ID', 'Created (IST)', 'Last Activity (IST)', 'Status', 'Full Name', 'Phone', 'Email', 'Language',
  'Customer Type', 'Product Interest', 'Project Location', 'Project Type', 'Project Size', 'Timeline',
  'Requirements', 'Conversation Summary', 'Requested Actions', 'Source Page', 'Consent', 'AI Messages', 'Transcript'
];
var CHAT_COLUMN_WIDTHS = [150, 160, 160, 120, 170, 140, 220, 90, 120, 140, 150, 160, 130, 120, 280, 380, 300, 200, 220, 90, 420];
var CHAT_COL = {};
CHAT_COLUMNS.forEach(function (name, i) { CHAT_COL[name] = i + 1; });

// Shown when Claude declines a request (stop_reason "refusal")
var CHAT_DECLINE_REPLY = {
  en: "I'm sorry, I can't help with that. I'd be glad to help with JK International's glass, aluminium and uPVC solutions. What are you planning?",
  pa: 'ਮਾਫ਼ ਕਰਨਾ, ਮੈਂ ਇਸ ਵਿੱਚ ਮਦਦ ਨਹੀਂ ਕਰ ਸਕਦਾ। JK International ਦੇ ਗਲਾਸ, ਐਲੂਮੀਨੀਅਮ ਅਤੇ uPVC ਸੋਲਿਊਸ਼ਨਜ਼ ਬਾਰੇ ਮੈਂ ਖੁਸ਼ੀ ਨਾਲ ਮਦਦ ਕਰਾਂਗਾ। ਤੁਸੀਂ ਕਿਸ ਪ੍ਰੋਜੈਕਟ ਦੀ ਯੋਜਨਾ ਬਣਾ ਰਹੇ ਹੋ?',
  hi: 'माफ़ कीजिए, मैं इसमें मदद नहीं कर सकता। JK International के ग्लास, एल्युमिनियम और uPVC सॉल्यूशंस के बारे में मैं खुशी से मदद करूँगा। आप किस प्रोजेक्ट की योजना बना रहे हैं?'
};

/**
 * Entry point for POST requests with action "chat.lead", "chat.message" or "chat.action".
 * Always answers JSON: { ok: true, ... } or { ok: false, error: "<code>" }.
 */
function handleChatbotRequest(data) {
  var result;
  try {
    if (data.action === 'chat.lead') result = chatSaveLead_(data);
    else if (data.action === 'chat.message') result = chatReply_(data);
    else if (data.action === 'chat.action') result = chatRecordAction_(data);
    else result = chatError_('bad_request');
  } catch (err) {
    // Never log visitor details, only what failed
    console.error('Chatbot ' + data.action + ' failed: ' + (err && err.stack ? err.stack : err));
    result = chatError_('server_error');
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

/** Reported by doGet so the website only turns the chatbot on once this file is deployed. */
function chatbotStatus() {
  return { ready: true, ai: !!chatSetting_('ANTHROPIC_API_KEY') };
}

/** Run once from the editor to check the API key and model before going live (see CHATBOT_SETUP.md). */
function testChatbotAI() {
  var key = chatSetting_('ANTHROPIC_API_KEY');
  if (!key) throw new Error('Add ANTHROPIC_API_KEY in Project Settings > Script Properties first.');
  var lead = {};
  CHAT_COLUMNS.forEach(function (col) { lead[col] = ''; });
  lead['Full Name'] = 'Test Visitor';
  var answer = chatAskClaude_(key, [], 'What is toughened glass, and do you make it?', 'en', lead, chatPageLabel_('index.html'));
  if (answer.error) throw new Error('Claude did not answer (' + answer.error + '). See the execution log above for the API error.');
  Logger.log('SUCCESS — model ' + chatSetting_('CHAT_MODEL') + ' replied:\n' + answer.reply);
}

/* -------------------------------------------------------------------------
 * chat.lead — name, phone, email + consent → row in "Chatbot Leads"
 * ------------------------------------------------------------------------- */

function chatSaveLead_(data) {
  var name = chatLine_(data.name, 80);
  var phone = chatNormalizePhone_(data.phone);
  var email = chatLine_(data.email, 254).toLowerCase();
  if (!chatValidName_(name)) return chatError_('invalid_name');
  if (!phone) return chatError_('invalid_phone');
  if (!chatValidEmail_(email)) return chatError_('invalid_email');
  if (data.consent !== true && data.consent !== 'true') return chatError_('consent_required');

  // Bots fill the hidden "website" field: answer like a success, store nothing
  if (data.website) return { ok: true, token: 'JKC-0.0.0', returning: false };

  var language = chatLanguage_(data.language);
  var sessionId = chatSessionId_(data.sessionId);
  var page = chatPageLabel_(data.page);
  var cache = CacheService.getScriptCache();

  var saved = chatWithLock_(function () {
    var sheet = chatSheet_();
    var now = chatNow_();
    var consent = 'Agreed in website chat on ' + now;

    // A phone number we already have, or a correction within the same browser session:
    // update that lead instead of adding a duplicate
    var sessionLead = sessionId ? cache.get('chat-session:' + sessionId) : '';
    var row = chatFindRow_(sheet, 'Phone', phone) || (sessionLead ? chatFindRow_(sheet, 'Lead ID', sessionLead) : 0);
    if (row) {
      var lead = chatReadRow_(sheet, row);
      chatUpdateRow_(sheet, row, lead, {
        'Last Activity (IST)': now,
        'Full Name': name,
        'Phone': phone,
        'Email': email,
        'Language': CHAT_LANGUAGE_NAMES[language],
        'Consent': consent,
        'Transcript': chatTrimTranscript_(lead['Transcript'] + (lead['Transcript'] ? '\n' : '') + '--- Visitor started a new chat on ' + now + ' (' + page + ') ---')
      });
      return { leadId: lead['Lead ID'], isNew: false, token: chatIssueToken_(lead['Lead ID']) };
    }

    if (!chatTakeQuota_('chat-new-leads:' + chatNow_('yyyyMMddHH'), chatNumber_('CHAT_LIMIT_NEW_LEADS_HOUR'), 3600)) return null;

    var leadId = chatNewLeadId_();
    var record = {
      'Lead ID': leadId,
      'Created (IST)': now,
      'Last Activity (IST)': now,
      'Status': 'New',
      'Full Name': name,
      'Phone': phone,
      'Email': email,
      'Language': CHAT_LANGUAGE_NAMES[language],
      'Source Page': page,
      'Consent': consent,
      'AI Messages': 0
    };
    sheet.appendRow(CHAT_COLUMNS.map(function (col) { return chatCell_(record.hasOwnProperty(col) ? record[col] : ''); }));
    sheet.getRange(sheet.getLastRow(), 1, 1, CHAT_COLUMNS.length).setVerticalAlignment('top');
    return { leadId: leadId, isNew: true, token: chatIssueToken_(leadId) };
  });

  if (!saved) return chatError_('rate_limited');
  if (sessionId) cache.put('chat-session:' + sessionId, saved.leadId, 21600);

  // One email per lead every few hours, so a visitor reopening the chat doesn't flood the inbox
  if (!cache.get('chat-notified:' + saved.leadId)) {
    cache.put('chat-notified:' + saved.leadId, '1', 21600);
    chatNotifyTeam_(saved.isNew ? 'new' : 'returning', saved.leadId, null);
  }

  return { ok: true, token: saved.token, returning: !saved.isNew };
}

/* -------------------------------------------------------------------------
 * chat.message — one visitor message → Claude reply + updated lead details
 * ------------------------------------------------------------------------- */

function chatReply_(data) {
  var leadId = chatVerifyToken_(data.token);
  if (!leadId) return chatError_('unauthorized');

  var message = chatText_(data.message);
  if (!message) return chatError_('bad_request');
  if (message.length > CHAT_MAX_MESSAGE) return chatError_('too_long');

  var apiKey = chatSetting_('ANTHROPIC_API_KEY');
  if (!apiKey) return chatError_('not_configured');

  var hour = chatNow_('yyyyMMddHH');
  var allowed = chatWithLock_(function () {
    return chatTakeQuota_('chat-visitor:' + leadId + ':' + hour, chatNumber_('CHAT_LIMIT_PER_VISITOR_HOUR'), 3600) &&
      chatTakeQuota_('chat-site:' + hour, chatNumber_('CHAT_LIMIT_SITE_HOUR'), 3600) &&
      chatTakeDailyQuota_(chatNumber_('CHAT_LIMIT_SITE_DAY'));
  });
  if (!allowed) return chatError_('rate_limited');

  var sheet = chatSheet_();
  var row = chatFindRow_(sheet, 'Lead ID', leadId);
  if (!row) return chatError_('unauthorized');

  var language = chatLanguage_(data.language);
  var answer = chatAskClaude_(apiKey, chatHistory_(data.history), message, language, chatReadRow_(sheet, row), chatPageLabel_(data.page));
  if (answer.error) return chatError_(answer.error);

  // The reply matters more than the record: still answer if the sheet is busy
  try {
    chatWithLock_(function () { chatRecordTurn_(sheet, leadId, message, answer); });
  } catch (err) {
    console.error('Chatbot could not update lead row: ' + err);
  }

  return {
    ok: true,
    reply: answer.reply,
    language: answer.language,
    suggestions: answer.suggestions,
    links: answer.links,
    showActions: answer.showActions
  };
}

function chatRecordTurn_(sheet, leadId, message, answer) {
  // Look the row up again: the team may have sorted or edited the sheet meanwhile
  var row = chatFindRow_(sheet, 'Lead ID', leadId);
  if (!row) return;
  var lead = chatReadRow_(sheet, row);
  var updates = {
    'Last Activity (IST)': chatNow_(),
    'Language': CHAT_LANGUAGE_NAMES[answer.language],
    'AI Messages': (Number(lead['AI Messages']) || 0) + 1,
    'Transcript': chatAppendTranscript_(lead['Transcript'], 'Visitor', message, answer.reply)
  };

  var found = answer.lead;
  if (found) {
    if (CHAT_CUSTOMER_TYPES.indexOf(found.customer_type) > 0) updates['Customer Type'] = found.customer_type;
    var products = chatList_(lead['Product Interest']);
    (Array.isArray(found.product_interest) ? found.product_interest : []).forEach(function (p) {
      if (CHAT_PRODUCTS.indexOf(p) !== -1 && products.indexOf(p) === -1) products.push(p);
    });
    if (products.length) updates['Product Interest'] = products.join(', ');
    [['project_location', 'Project Location', 150], ['project_type', 'Project Type', 150], ['project_size', 'Project Size', 150],
      ['timeline', 'Timeline', 150], ['requirements', 'Requirements', 1500]].forEach(function (field) {
      var value = chatLine_(found[field[0]], field[2]);
      if (value) updates[field[1]] = value;
    });
  }
  if (answer.summary) updates['Conversation Summary'] = answer.summary;
  chatUpdateRow_(sheet, row, lead, updates);
}

/* -------------------------------------------------------------------------
 * chat.action — quotation / callback / sales / project enquiry buttons
 * ------------------------------------------------------------------------- */

function chatRecordAction_(data) {
  var leadId = chatVerifyToken_(data.token);
  if (!leadId) return chatError_('unauthorized');
  var type = CHAT_ACTIONS.hasOwnProperty(data.type) ? data.type : '';
  if (!type) return chatError_('bad_request');
  var time = CHAT_CALL_TIMES.hasOwnProperty(data.time) ? data.time : 'any';
  var note = chatText_(data.note, 1000);

  var request = CHAT_ACTIONS[type] + (type === 'callback' ? ' (' + CHAT_CALL_TIMES[time] + ')' : '');
  var recorded = chatWithLock_(function () {
    if (!chatTakeQuota_('chat-actions:' + leadId + ':' + chatNow_('yyyyMMddHH'), 10, 3600)) return 'rate_limited';
    var sheet = chatSheet_();
    var row = chatFindRow_(sheet, 'Lead ID', leadId);
    if (!row) return 'unauthorized';
    var lead = chatReadRow_(sheet, row);
    var now = chatNow_();
    var entry = now + ' — ' + request + (note ? ': ' + note : '');
    chatUpdateRow_(sheet, row, lead, {
      'Last Activity (IST)': now,
      'Requested Actions': (lead['Requested Actions'] ? lead['Requested Actions'] + '\n' : '') + entry,
      'Transcript': chatTrimTranscript_(lead['Transcript'] + (lead['Transcript'] ? '\n' : '') + '[' + chatNow_('dd MMM HH:mm') + '] Visitor requested: ' + request + (note ? ' — ' + note : ''))
    });
    return '';
  });
  if (recorded) return chatError_(recorded);

  chatNotifyTeam_('action', leadId, { request: request, note: note });
  return { ok: true };
}

/* -------------------------------------------------------------------------
 * Claude API
 * ------------------------------------------------------------------------- */

function chatAskClaude_(apiKey, history, message, language, lead, page) {
  var request = {
    max_tokens: chatNumber_('CHAT_MAX_TOKENS'),
    system: [
      // Identical for every visitor, so Anthropic can cache it between requests
      { type: 'text', text: chatSystemPrompt_(), cache_control: { type: 'ephemeral' } },
      { type: 'text', text: chatSessionContext_(language, lead, page) }
    ],
    messages: history.concat([{ role: 'user', content: message }]),
    output_config: {
      effort: chatSetting_('CHAT_EFFORT'),
      format: { type: 'json_schema', schema: chatReplySchema_() }
    }
  };

  var models = [chatSetting_('CHAT_MODEL')];
  var backup = chatSetting_('CHAT_FALLBACK_MODEL');
  if (backup && backup !== models[0]) models.push(backup);

  for (var i = 0; i < models.length; i++) {
    var outcome = chatCallClaude_(apiKey, models[i], request);
    if (outcome.message) return chatParseReply_(outcome.message, language);
    if (!outcome.retry) break;
  }
  return { error: 'ai_unavailable' };
}

function chatCallClaude_(apiKey, model, request) {
  var serverFallbacks = chatSetting_('CHAT_SERVER_FALLBACKS') === 'default';
  for (var attempt = 0; attempt < 2; attempt++) {
    var body = Object.assign({ model: model }, request);
    var headers = { 'x-api-key': apiKey, 'anthropic-version': CHAT_API_VERSION };
    if (serverFallbacks) {
      body.fallbacks = 'default';
      headers['anthropic-beta'] = 'server-side-fallback-2026-07-01';
    }

    var response;
    try {
      response = UrlFetchApp.fetch(CHAT_API_URL, {
        method: 'post',
        contentType: 'application/json',
        headers: headers,
        payload: JSON.stringify(body),
        muteHttpExceptions: true
      });
    } catch (err) {
      console.error('Claude request to ' + model + ' failed: ' + err);
      return { retry: true };
    }

    var status = response.getResponseCode();
    var text = response.getContentText();
    if (status === 200) {
      var reply = JSON.parse(text);
      console.log(JSON.stringify({ event: 'chat_reply', model: reply.model, stop_reason: reply.stop_reason, usage: reply.usage }));
      return { message: reply };
    }

    var apiError = {};
    try { apiError = JSON.parse(text).error || {}; } catch (e) { /* not JSON */ }
    var detail = String(apiError.message || '').slice(0, 300);
    console.error('Claude API ' + status + ' from ' + model + ': ' + (apiError.type || '') + ' ' + detail);

    // A model or account without server-side fallbacks: ask once more without them
    if (status === 400 && serverFallbacks && /fallback/i.test(detail)) {
      serverFallbacks = false;
      continue;
    }
    // Missing model, rate limit, overload or outage: the backup model may still answer
    return { retry: status === 404 || status === 408 || status === 429 || status >= 500 };
  }
  return { retry: true };
}

function chatParseReply_(message, language) {
  if (message.stop_reason === 'refusal') {
    return { reply: CHAT_DECLINE_REPLY[language], language: language, suggestions: [], links: [], showActions: false, lead: null, summary: '' };
  }

  // After a server-side fallback, only the blocks following the last "fallback" block belong to the final answer
  var blocks = message.content || [];
  for (var i = blocks.length - 1; i >= 0; i--) {
    if (blocks[i].type === 'fallback') {
      blocks = blocks.slice(i + 1);
      break;
    }
  }
  var text = blocks
    .filter(function (block) { return block.type === 'text'; })
    .map(function (block) { return block.text; })
    .join('');
  var out;
  try {
    out = JSON.parse(text);
  } catch (err) {
    console.error('Claude reply was not valid JSON (stop_reason ' + message.stop_reason + ')');
    return { error: 'ai_unavailable' };
  }

  var reply = chatText_(out.reply, 4000);
  if (!reply) return { error: 'ai_unavailable' };
  var links = (Array.isArray(out.links) ? out.links : []).filter(function (key, i, all) {
    return CHAT_PAGES.hasOwnProperty(key) && all.indexOf(key) === i;
  });
  return {
    reply: reply,
    language: CHAT_LANGUAGE_NAMES[out.reply_language] ? out.reply_language : language,
    suggestions: (Array.isArray(out.suggestions) ? out.suggestions : [])
      .map(function (s) { return chatLine_(s, 80); })
      .filter(Boolean)
      .slice(0, 3),
    links: links.slice(0, 2),
    showActions: out.show_actions === true,
    lead: out.lead && typeof out.lead === 'object' ? out.lead : null,
    summary: chatLine_(out.summary, 1000)
  };
}

/** Per-visitor details, sent after the cached system prompt. */
function chatSessionContext_(language, lead, page) {
  var known = {
    customer_type: lead['Customer Type'] || '',
    product_interest: chatList_(lead['Product Interest']),
    project_location: lead['Project Location'] || '',
    project_type: lead['Project Type'] || '',
    project_size: lead['Project Size'] || '',
    timeline: lead['Timeline'] || '',
    requirements: lead['Requirements'] || ''
  };
  return '<session_context>\n' +
    'Selected language: ' + language + ' (' + CHAT_LANGUAGE_SCRIPTS[language] + ')\n' +
    'Visitor first name: ' + String(lead['Full Name'] || '').split(' ')[0] + '\n' +
    'Website page the visitor is on: ' + page + '\n' +
    'Known needs so far: ' + JSON.stringify(known) + '\n' +
    'Summary so far: ' + (lead['Conversation Summary'] || '(none yet)') + '\n' +
    'Next steps already requested: ' + (String(lead['Requested Actions'] || '').slice(-400) || '(none)') + '\n' +
    '</session_context>';
}

/** JSON schema for Claude's structured reply. Built on demand because CHAT_PAGES lives in another file. */
function chatReplySchema_() {
  var text = { type: 'string' };
  return {
    type: 'object',
    additionalProperties: false,
    required: ['reply', 'reply_language', 'suggestions', 'links', 'show_actions', 'lead', 'summary'],
    properties: {
      reply: { type: 'string', description: 'Message shown to the visitor, written in reply_language.' },
      reply_language: { type: 'string', enum: ['pa', 'hi', 'en'] },
      suggestions: { type: 'array', items: text, description: 'Up to 3 short follow-up questions, in reply_language.' },
      links: { type: 'array', items: { type: 'string', enum: Object.keys(CHAT_PAGES) }, description: 'Up to 2 relevant website pages.' },
      show_actions: { type: 'boolean', description: 'True when the visitor shows buying intent.' },
      lead: {
        type: 'object',
        additionalProperties: false,
        required: ['customer_type', 'product_interest', 'project_location', 'project_type', 'project_size', 'timeline', 'requirements'],
        properties: {
          customer_type: { type: 'string', enum: CHAT_CUSTOMER_TYPES },
          product_interest: { type: 'array', items: { type: 'string', enum: CHAT_PRODUCTS } },
          project_location: text,
          project_type: text,
          project_size: text,
          timeline: text,
          requirements: text
        }
      },
      summary: { type: 'string', description: 'Updated 1-3 sentence English summary for the sales team.' }
    }
  };
}

/* -------------------------------------------------------------------------
 * Sales team email
 * ------------------------------------------------------------------------- */

function chatNotifyTeam_(kind, leadId, action) {
  var lead = chatWithLock_(function () {
    var sheet = chatSheet_();
    var row = chatFindRow_(sheet, 'Lead ID', leadId);
    return row ? chatReadRow_(sheet, row) : null;
  });
  if (!lead) return;

  var recipients = typeof NOTIFICATION_EMAILS === 'string' ? NOTIFICATION_EMAILS : '';
  var owner = '';
  try { owner = Session.getActiveUser().getEmail(); } catch (e) { /* not available for this deployment */ }
  if (owner && recipients.indexOf(owner) === -1) recipients = recipients ? recipients + ', ' + owner : owner;
  if (!recipients) return;

  var name = String(lead['Full Name']);
  var phone = String(lead['Phone']);
  var subject = kind === 'action' ? '🔔 Chatbot: ' + action.request + ' — ' + name
    : kind === 'returning' ? '🤖 Returning chatbot visitor — ' + name
    : '🤖 New chatbot lead — ' + name;
  var heading = kind === 'action' ? action.request : kind === 'returning' ? 'Returning Chatbot Visitor' : 'New Chatbot Lead';

  var rows = [];
  if (action) rows.push(['Request', action.request], ['Visitor note', action.note]);
  rows.push(
    ['Name', name], ['Phone / WhatsApp', phone], ['Email', lead['Email']], ['Language', lead['Language']],
    ['Customer type', lead['Customer Type']], ['Product interest', lead['Product Interest']],
    ['Project location', lead['Project Location']], ['Project type', lead['Project Type']],
    ['Project size', lead['Project Size']], ['Timeline', lead['Timeline']], ['Requirements', lead['Requirements']],
    ['Started on', lead['Source Page']], ['Lead ID', lead['Lead ID']]
  );
  rows = rows.filter(function (r) { return String(r[1] || '').trim(); });
  var summary = String(lead['Conversation Summary'] || '');
  var sheetUrl = SpreadsheetApp.getActiveSpreadsheet().getUrl() + '#gid=' + chatSheet_().getSheetId();

  var bodyText = heading.toUpperCase() + ' — JK INTERNATIONAL WEBSITE CHATBOT\n\n' +
    rows.map(function (r) { return '• ' + r[0] + ': ' + r[1]; }).join('\n') +
    (summary ? '\n\nCONVERSATION SUMMARY (AI):\n' + summary : '') +
    '\n\nFull transcript and lead status: ' + sheetUrl;

  var digits = phone.replace(/[^0-9]/g, '');
  var bodyHtml =
    "<div style='font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;'>" +
      "<div style='background: #1b2671; padding: 22px 28px; color: #ffffff;'>" +
        "<h2 style='margin: 0; font-size: 20px;'>" + chatHtml_(heading) + '</h2>' +
        "<p style='margin: 6px 0 0; font-size: 13px; color: #cbd5e1;'>JK International &bull; Website AI Chatbot</p>" +
      '</div>' +
      "<div style='padding: 24px 28px; background: #ffffff; color: #1e293b; line-height: 1.6;'>" +
        "<table style='width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;'>" +
          rows.map(function (r) {
            var value = chatHtml_(r[1]).replace(/\n/g, '<br>');
            if (r[0] === 'Phone / WhatsApp') {
              value = "<a href='tel:" + chatHtml_(phone) + "' style='color: #1b2671; font-weight: bold;'>" + value + '</a> &nbsp; ' +
                "<a href='https://wa.me/" + digits + "' style='color: #16a34a; font-size: 12px;'>[WhatsApp]</a>";
            } else if (r[0] === 'Email') {
              value = "<a href='mailto:" + chatHtml_(r[1]) + "' style='color: #1b2671;'>" + value + '</a>';
            }
            return "<tr><td style='padding: 7px 0; color: #64748b; width: 150px; vertical-align: top;'><strong>" + chatHtml_(r[0]) + ':</strong></td>' +
              "<td style='padding: 7px 0; color: #0f172a;'>" + value + '</td></tr>';
          }).join('') +
        '</table>' +
        (summary
          ? "<h4 style='margin: 0 0 8px; color: #1b2671; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;'>Conversation summary (AI)</h4>" +
            "<div style='background: #f1f5f9; padding: 14px 16px; border-radius: 8px; font-size: 14px; color: #334155; margin-bottom: 20px;'>" + chatHtml_(summary) + '</div>'
          : '') +
        "<div style='text-align: center;'><a href='" + chatHtml_(sheetUrl) + "' style='display: inline-block; background: #1b2671; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: bold;'>Open Chatbot Leads sheet &rarr;</a></div>" +
      '</div>' +
    '</div>';

  try {
    GmailApp.sendEmail(recipients, subject, bodyText, { htmlBody: bodyHtml, name: 'JK International Website Desk' });
  } catch (errGmail) {
    try {
      MailApp.sendEmail({ to: recipients, subject: subject, body: bodyText, htmlBody: bodyHtml, name: 'JK International Website Desk' });
    } catch (errMail) {
      console.error('Chatbot notification email failed: ' + errMail);
    }
  }
}

/* -------------------------------------------------------------------------
 * Google Sheet storage
 * ------------------------------------------------------------------------- */

function chatSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CHAT_SHEET_NAME);
  if (sheet) return sheet;

  // Added after the existing tabs so the quotation form keeps writing to the first sheet
  sheet = ss.insertSheet(CHAT_SHEET_NAME, ss.getSheets().length);
  sheet.getRange(1, 1, 1, CHAT_COLUMNS.length).setValues([CHAT_COLUMNS])
    .setFontWeight('bold').setBackground('#1b2671').setFontColor('#ffffff').setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
  CHAT_COLUMN_WIDTHS.forEach(function (width, i) { sheet.setColumnWidth(i + 1, width); });

  var dataRows = sheet.getMaxRows() - 1;
  var statusRange = sheet.getRange(2, CHAT_COL['Status'], dataRows, 1);
  statusRange.setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(CHAT_STATUSES, true).setAllowInvalid(false).build());
  sheet.setConditionalFormatRules(CHAT_STATUSES.map(function (status) {
    return SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo(status).setBackground(CHAT_STATUS_COLOURS[status]).setRanges([statusRange]).build();
  }));
  sheet.getRange(2, CHAT_COL['Requirements'], dataRows, 3).setWrap(true);
  sheet.getRange(2, CHAT_COL['Transcript'], dataRows, 1).setWrapStrategy(SpreadsheetApp.WrapStrategy.CLIP);
  return sheet;
}

function chatFindRow_(sheet, column, value) {
  var last = sheet.getLastRow();
  if (!value || last < 2) return 0;
  var match = sheet.getRange(2, CHAT_COL[column], last - 1, 1).createTextFinder(String(value)).matchEntireCell(true).findNext();
  return match ? match.getRow() : 0;
}

function chatReadRow_(sheet, row) {
  var values = sheet.getRange(row, 1, 1, CHAT_COLUMNS.length).getValues()[0];
  var lead = {};
  CHAT_COLUMNS.forEach(function (col, i) { lead[col] = values[i]; });
  return lead;
}

/** Writes only the changed columns, in as few contiguous ranges as possible. */
function chatUpdateRow_(sheet, row, lead, updates) {
  var columns = Object.keys(updates).map(function (col) { return CHAT_COL[col]; }).sort(function (a, b) { return a - b; });
  var start = 0;
  for (var i = 0; i < columns.length; i++) {
    if (i + 1 < columns.length && columns[i + 1] === columns[i] + 1) continue;
    var first = columns[start];
    var values = [];
    for (var c = first; c <= columns[i]; c++) {
      var name = CHAT_COLUMNS[c - 1];
      values.push(chatCell_(updates.hasOwnProperty(name) ? updates[name] : lead[name]));
    }
    sheet.getRange(row, first, 1, values.length).setValues([values]);
    start = i + 1;
  }
}

function chatAppendTranscript_(existing, who, visitorText, replyText) {
  var stamp = '[' + chatNow_('dd MMM HH:mm') + '] ';
  return chatTrimTranscript_(String(existing || '') + (existing ? '\n' : '') +
    stamp + who + ': ' + visitorText + '\n' + stamp + 'JK Assistant: ' + replyText);
}

function chatTrimTranscript_(text) {
  return text.length > CHAT_TRANSCRIPT_LIMIT ? '…' + text.slice(-CHAT_TRANSCRIPT_LIMIT) : text;
}

/** Stops Sheets from treating visitor text that starts with = + - @ as a formula. */
function chatCell_(value) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') return value;
  return /^[=+\-@\t\r\n]/.test(value) ? "'" + value : value;
}

/* -------------------------------------------------------------------------
 * Visitor tokens, rate limits, settings
 * ------------------------------------------------------------------------- */

/** Signed "leadId.issued.signature" token: proves the visitor completed the details step. */
function chatIssueToken_(leadId) {
  var payload = leadId + '.' + Date.now().toString(36);
  return payload + '.' + chatSign_(payload, chatSecret_(true));
}

function chatVerifyToken_(token) {
  var parts = String(token || '').split('.');
  var secret = chatSecret_(false);
  if (parts.length !== 3 || !secret || !/^JKC-[0-9A-Z-]+$/.test(parts[0])) return '';
  var payload = parts[0] + '.' + parts[1];
  if (!chatSameText_(chatSign_(payload, secret), parts[2])) return '';
  var issued = parseInt(parts[1], 36);
  if (!issued || Date.now() - issued > CHAT_TOKEN_MAX_AGE_DAYS * 86400000) return '';
  return parts[0];
}

function chatSign_(payload, secret) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(payload, secret)).replace(/=+$/, '');
}

/** Random signing secret, created on first use and kept in Script Properties. */
function chatSecret_(create) {
  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('CHAT_TOKEN_SECRET');
  if (!secret && create) {
    secret = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty('CHAT_TOKEN_SECRET', secret);
  }
  return secret || '';
}

function chatSameText_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Counts one use of an hourly bucket; false once the limit is reached. Call inside chatWithLock_. */
function chatTakeQuota_(key, limit, seconds) {
  var cache = CacheService.getScriptCache();
  var used = parseInt(cache.get(key) || '0', 10);
  if (used >= limit) return false;
  cache.put(key, String(used + 1), seconds);
  return true;
}

/** Daily site-wide cap. Kept in Script Properties because the cache only lasts six hours. */
function chatTakeDailyQuota_(limit) {
  var props = PropertiesService.getScriptProperties();
  var key = 'CHAT_USAGE_' + chatNow_('yyyyMMdd');
  var used = parseInt(props.getProperty(key) || '0', 10);
  if (used >= limit) return false;
  if (!used) {
    Object.keys(props.getProperties()).forEach(function (k) {
      if (k.indexOf('CHAT_USAGE_') === 0 && k !== key) props.deleteProperty(k);
    });
  }
  props.setProperty(key, String(used + 1));
  return true;
}

function chatWithLock_(fn) {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) throw new Error('Timed out waiting for the script lock');
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

var chatProps_ = null;
function chatSetting_(name) {
  if (!chatProps_) chatProps_ = PropertiesService.getScriptProperties().getProperties();
  var value = String(chatProps_[name] || '').trim();
  return value || CHAT_SETTINGS[name] || '';
}

function chatNumber_(name) {
  var n = parseInt(chatSetting_(name), 10);
  return isNaN(n) ? parseInt(CHAT_SETTINGS[name], 10) : n;
}

/* -------------------------------------------------------------------------
 * Input checks (mirrored in assets/js/jk-chatbot.js)
 * ------------------------------------------------------------------------- */

var CHAT_NAME_LETTERS = 'A-Za-z\\u00C0-\\u024F\\u0900-\\u097F\\u0A00-\\u0A7F';
var CHAT_NAME_PATTERN = new RegExp('^[' + CHAT_NAME_LETTERS + '][' + CHAT_NAME_LETTERS + "\\u200C\\u200D .'-]*$");

function chatValidName_(name) {
  if (name.length < 2 || name.length > 60 || !CHAT_NAME_PATTERN.test(name)) return false;
  return name.replace(new RegExp('[^' + CHAT_NAME_LETTERS + ']', 'g'), '').length >= 2;
}

/** Indian mobiles become +91XXXXXXXXXX; other countries need a leading + and country code. '' when invalid. */
function chatNormalizePhone_(value) {
  var s = String(value || '').replace(/[\s\-().\/]/g, '');
  if (s.indexOf('00') === 0) s = '+' + s.slice(2);
  var international = s.charAt(0) === '+';
  var digits = international ? s.slice(1) : s;
  if (!/^\d{8,15}$/.test(digits)) return '';
  if (international && digits.indexOf('91') !== 0) return digits.charAt(0) === '0' ? '' : '+' + digits;
  if (digits.length === 12 && digits.indexOf('91') === 0) digits = digits.slice(2);
  else if (digits.length === 11 && digits.charAt(0) === '0') digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? '+91' + digits : '';
}

function chatValidEmail_(email) {
  return email.length <= 254 &&
    /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/.test(email);
}

/** Strips control and invisible formatting characters (keeps the joiners Indic scripts need). */
function chatText_(value, maxLength) {
  var s = value === undefined || value === null ? '' : String(value);
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​‪-‮⁦-⁩﻿]/g, '')
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return maxLength ? s.slice(0, maxLength) : s;
}

function chatLine_(value, maxLength) {
  return chatText_(value).replace(/\s+/g, ' ').slice(0, maxLength || 500);
}

function chatHistory_(history) {
  if (!Array.isArray(history)) return [];
  var turns = history.slice(-CHAT_MAX_HISTORY).map(function (item) {
    return { role: item && item.role === 'assistant' ? 'assistant' : 'user', content: chatText_(item && item.text, 2000) };
  }).filter(function (turn) { return turn.content; });
  while (turns.length && turns[0].role !== 'user') turns.shift();
  return turns;
}

function chatLanguage_(value) {
  return CHAT_LANGUAGE_NAMES.hasOwnProperty(value) ? value : 'en';
}

function chatSessionId_(value) {
  var s = String(value || '');
  return /^[A-Za-z0-9_-]{8,64}$/.test(s) ? s : '';
}

function chatPageLabel_(path) {
  var key = String(path || '').split(/[?#]/)[0].split('/').pop() || 'index.html';
  if (key.indexOf('.') === -1) key += '.html';
  return CHAT_PAGES.hasOwnProperty(key) ? CHAT_PAGES[key] + ' (' + key + ')' : 'Website';
}

function chatList_(value) {
  return String(value || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
}

function chatNewLeadId_() {
  return 'JKC-' + chatNow_('yyMMdd') + '-' + Utilities.getUuid().replace(/-/g, '').slice(0, 6).toUpperCase();
}

function chatNow_(pattern) {
  return Utilities.formatDate(new Date(), 'Asia/Kolkata', pattern || 'dd MMM yyyy, hh:mm a');
}

function chatHtml_(value) {
  return String(value === undefined || value === null ? '' : value).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function chatError_(code) {
  return { ok: false, error: code };
}
