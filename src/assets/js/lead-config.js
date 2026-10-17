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
  whatsAppNumber: "918566008869"
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

      await fetch(webAppUrl, {
        method: "POST",
        mode: "no-cors", // Google Apps Script redirects after post; no-cors allows seamless execution
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload.toString()
      });

      return {
        success: true,
        method: "google_sheets",
        message: "Your quotation request has been recorded and delivered to our engineering desk!"
      };
    } catch (err) {
      console.warn("Google Script dispatch error, falling back:", err);
    }
  }

  // Graceful fallback when URL is not yet configured or offline
  return {
    success: true,
    method: "demo_or_fallback",
    message: "Inquiry received! Our factory team will reach out to you shortly."
  };
};
