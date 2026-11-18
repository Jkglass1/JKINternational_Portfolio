/**
 * =========================================================================
 * JK INTERNATIONAL — LEAD CAPTURE & QUOTATION DISPATCHER CONFIGURATION
 * =========================================================================
 * 
 * 100% Free Google Sheets + Instant Email Notifications Backend.
 * 
 * How to activate:
 * 1. Follow the 2-minute guide in /docs/FREE_EMAIL_AND_SHEETS_SETUP.md
 * 2. Paste your Google Apps Script Web App URL below between the quotes.
 * 3. Save this file — both the homepage and contact page will automatically use it!
 */

window.JK_LEAD_CONFIG = {
  // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
  // Example: "https://script.google.com/macros/s/AKfycb.../exec"
  googleWebAppUrl: "https://script.google.com/macros/s/AKfycbwaqpmtFIlQNt-OlVh3h0wK4e_NI6efIV2ikuebGibw7Xtmqu4W5LL2Hk-wdW0ajXh1HA/exec",

  // Fallback direct email for inquiries
  fallbackEmail: "sales@jkglasses.com",
  fallbackCc: "jkglasses@gmail.com",

  // Factory WhatsApp direct chat
  whatsAppNumber: "918566008869",

  // Website sales assistant (assets/js/jk-chatbot.js). Leads and full conversations
  // go DIRECTLY into the JK International ERP (CRM → Leads, source "Website Chatbot").
  // This is a public URL, not a secret: the ERP endpoint protects itself (origin
  // allow-list, rate limit, per-conversation token). Setup: /docs/CHATBOT_SETUP.md
  chatbot: {
    enabled: true,
    erpEndpoint: "https://jk-international-erp.vercel.app/api/public/website-chatbot"
  }
};

/**
 * Universal dispatcher for quotation and contact form submissions
 * @param {Object} formData { firstName, lastName, email, phone, division, requirements, sourcePage }
 * @returns {Promise<{success: boolean, message: string}>}
 */
window.dispatchQuotationLead = async function(leadData) {
  var config = window.JK_LEAD_CONFIG || {};
  var webAppUrl = (config.googleWebAppUrl || "").trim();

  // If Google Apps Script Web App URL is configured, send via POST
  if (webAppUrl && webAppUrl.startsWith("http")) {
    try {
      // Use URL-encoded / FormData for maximum compatibility with Google Apps Script
      var payload = new URLSearchParams();
      for (var key in leadData) {
        if (leadData.hasOwnProperty(key)) {
          payload.append(key, leadData[key] || "");
        }
      }

      // Give up after 15s so a stalled connection doesn't leave the visitor waiting
      var controller = window.AbortController ? new AbortController() : null;
      var timeout = controller ? setTimeout(function () { controller.abort(); }, 15000) : null;

      await fetch(webAppUrl, {
        method: "POST",
        mode: "no-cors", // Google Apps Script redirects after post; no-cors allows seamless execution
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload.toString(),
        signal: controller ? controller.signal : undefined
      });
      clearTimeout(timeout);

      return {
        success: true,
        method: "google_sheets",
        message: "Your quotation request has been recorded and delivered to our engineering desk!"
      };
    } catch (err) {
      console.warn("Google Script dispatch error:", err);
    }
  }

  // Not configured or offline: report failure so the form can offer WhatsApp / phone instead
  return {
    success: false,
    method: "unavailable",
    message: "We couldn't send your inquiry right now. Please reach us on WhatsApp or phone."
  };
};
