/**
 * =========================================================================
 * JK INTERNATIONAL — WEBSITE QUOTATION & CONTACT FORM BACKEND
 * Google Sheets + Instant Email Notifications (100% Free Forever)
 * =========================================================================
 */

// ---> ADD YOUR EMAIL ADDRESSES HERE (Separated by commas) <---
var NOTIFICATION_EMAILS = "sales@jkglasses.com, jkglasses@gmail.com";

// Set to true to send a confirmation email back to the customer
var SEND_CUSTOMER_CONFIRMATION = true;

/**
 * -------------------------------------------------------------------------
 * ONE-CLICK TEST FUNCTION:
 * Run this function inside Apps Script by clicking the "Run" button!
 * It will prompt you for authorization (Allow Email Access) and send a 
 * test email immediately to your inbox so you know emails are working!
 * -------------------------------------------------------------------------
 */
function testEmail() {
  var myEmail = Session.getActiveUser().getEmail();
  var recipients = NOTIFICATION_EMAILS;
  if (myEmail && recipients.indexOf(myEmail) === -1) {
    recipients = recipients + ", " + myEmail;
  }

  var subject = "✅ JK International — Email Notification Test";
  var body = "Congratulations! Your Google Apps Script is authorized and email notifications are working perfectly.\n\n" +
             "Configured Recipients: " + recipients + "\n" +
             "Tested at: " + new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  try {
    GmailApp.sendEmail(recipients, subject, body);
    Logger.log("SUCCESS: Test email sent via GmailApp to: " + recipients);
  } catch (e1) {
    Logger.log("GmailApp failed, trying MailApp: " + e1.toString());
    MailApp.sendEmail(recipients, subject, body);
    Logger.log("SUCCESS: Test email sent via MailApp to: " + recipients);
  }
}

/**
 * Handle incoming POST requests from website forms
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000); // Wait up to 10s for concurrent submissions

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create headers if sheet is brand new
    if (sheet.getLastRow() === 0) {
      var headers = [
        "Timestamp (IST)",
        "Source Page",
        "Business Division",
        "First Name",
        "Last Name",
        "Full Name",
        "Email Address",
        "Mobile / WhatsApp",
        "Project Specifications / Requirements",
        "Email Delivery Status"
      ];
      sheet.appendRow(headers);
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#1b2671");
      headerRange.setFontColor("#ffffff");
      headerRange.setHorizontalAlignment("center");
      sheet.setFrozenRows(1);
    }

    // Parse payload (supports JSON and FormData/URL-encoded)
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    var timestamp = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd MMM yyyy, hh:mm:ss a");
    var firstName = (data.firstName || data["First Name"] || "").toString().trim();
    var lastName = (data.lastName || data["Last Name"] || "").toString().trim();
    var fullName = (firstName + " " + lastName).trim() || data.fullName || "Prospective Client";
    var email = (data.email || data["Email"] || "").toString().trim();
    var phone = (data.phone || data.mobile || data["Mobile"] || "").toString().trim();
    var division = (data.division || data["Division"] || "Complete Turnkey").toString().trim();
    var requirements = (data.requirements || data.message || data["Description"] || "No specific details provided.").toString().trim();
    var sourcePage = (data.sourcePage || data.page || "JK International Website").toString().trim();

    // 1. Record lead into Google Sheet
    sheet.appendRow([
      timestamp,
      sourcePage,
      division,
      firstName,
      lastName,
      fullName,
      email,
      phone,
      requirements,
      "Processing..."
    ]);

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("left");
    sheet.autoResizeColumns(1, 10);

    // 2. Prepare recipient list
    // Always include the Google Sheet owner's email so they definitely receive it during testing!
    var ownerEmail = Session.getActiveUser().getEmail();
    var allRecipients = NOTIFICATION_EMAILS;
    if (ownerEmail && allRecipients.indexOf(ownerEmail) === -1) {
      allRecipients = allRecipients + ", " + ownerEmail;
    }

    // 3. Send instant Email Notification to the Factory / Sales team
    var emailStatus = "Not attempted";
    try {
      var emailSubject = "🔔 New Quotation Inquiry: " + division + " (" + fullName + ")";
      
      var emailBodyText = 
        "NEW WEBSITE INQUIRY RECEIVED — JK INTERNATIONAL\n" +
        "====================================================\n\n" +
        "CUSTOMER DETAILS:\n" +
        "• Name: " + fullName + "\n" +
        "• Phone / WhatsApp: " + phone + "\n" +
        "• Email: " + email + "\n" +
        "• Required Division: " + division + "\n" +
        "• Source Page: " + sourcePage + "\n" +
        "• Date & Time: " + timestamp + "\n\n" +
        "PROJECT DETAILS & SPECIFICATIONS:\n" +
        "----------------------------------------------------\n" +
        requirements + "\n\n" +
        "====================================================\n" +
        "✓ View this inquiry in your Google Sheet:\n" +
        SpreadsheetApp.getActiveSpreadsheet().getUrl();

      var emailBodyHtml = 
        "<div style='font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;'>" +
          "<div style='background: #1b2671; padding: 22px 28px; color: #ffffff;'>" +
            "<h2 style='margin: 0; font-size: 20px; letter-spacing: 0.5px;'>New Quotation Inquiry</h2>" +
            "<p style='margin: 6px 0 0; font-size: 13px; color: #cbd5e1;'>JK International &bull; Web Lead Notification Desk</p>" +
          "</div>" +
          "<div style='padding: 26px 28px; background: #ffffff; color: #1e293b; line-height: 1.6;'>" +
            "<div style='background: #f8fafc; border-left: 4px solid #37ab32; padding: 14px 18px; margin-bottom: 22px; border-radius: 0 6px 6px 0;'>" +
              "<strong style='color: #0f172a; font-size: 15px;'>Division: " + division + "</strong><br>" +
              "<span style='color: #64748b; font-size: 13px;'>Received: " + timestamp + " (" + sourcePage + ")</span>" +
            "</div>" +
            "<h4 style='margin: 0 0 12px; color: #1b2671; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;'>Client Contact Details</h4>" +
            "<table style='width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;'>" +
              "<tr><td style='padding: 8px 0; color: #64748b; width: 140px;'><strong>Name:</strong></td><td style='color: #0f172a; font-weight: bold;'>" + fullName + "</td></tr>" +
              "<tr><td style='padding: 8px 0; color: #64748b;'><strong>Mobile / WhatsApp:</strong></td><td><a href='tel:" + phone + "' style='color: #1b2671; font-weight: bold; text-decoration: none;'>" + phone + "</a> &nbsp; <a href='https://wa.me/" + phone.replace(/[^0-9]/g, '') + "' style='color: #16a34a; text-decoration: none; font-size: 12px;'>[Open in WhatsApp]</a></td></tr>" +
              "<tr><td style='padding: 8px 0; color: #64748b;'><strong>Email Address:</strong></td><td><a href='mailto:" + email + "' style='color: #1b2671; text-decoration: none;'>" + email + "</a></td></tr>" +
            "</table>" +
            "<h4 style='margin: 0 0 8px; color: #1b2671; text-transform: uppercase; font-size: 12px; letter-spacing: 1px;'>Project Specifications & Details</h4>" +
            "<div style='background: #f1f5f9; padding: 16px; border-radius: 8px; font-size: 14px; color: #334155; white-space: pre-wrap; margin-bottom: 24px;'>" +
              requirements +
            "</div>" +
            "<div style='text-align: center; margin-top: 15px;'>" +
              "<a href='" + SpreadsheetApp.getActiveSpreadsheet().getUrl() + "' style='display: inline-block; background: #1b2671; color: #ffffff; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: bold;'>View in Google Sheets &rarr;</a>" +
            "</div>" +
          "</div>" +
        "</div>";

      // Try GmailApp first (more reliable), fallback to MailApp
      try {
        GmailApp.sendEmail(allRecipients, emailSubject, emailBodyText, {
          htmlBody: emailBodyHtml,
          name: "JK International Website Desk"
        });
        emailStatus = "Sent successfully via GmailApp to: " + allRecipients;
      } catch (errGmail) {
        MailApp.sendEmail({
          to: allRecipients,
          subject: emailSubject,
          body: emailBodyText,
          htmlBody: emailBodyHtml,
          name: "JK International Website Desk"
        });
        emailStatus = "Sent successfully via MailApp to: " + allRecipients;
      }
    } catch (errEmail) {
      emailStatus = "Failed: " + errEmail.toString();
    }

    // Write delivery status in Column J
    sheet.getRange(lastRow, 10).setValue(emailStatus);

    // 4. Optional: Send confirmation email to customer
    if (SEND_CUSTOMER_CONFIRMATION && email && email.indexOf("@") !== -1) {
      try {
        var customerSubject = "Quotation Request Received — JK International";
        var customerBody = 
          "Dear " + fullName + ",\n\n" +
          "Thank you for reaching out to JK International.\n\n" +
          "We have received your quotation request for " + division + ".\n" +
          "Our engineering & estimation desk is reviewing your requirements and will contact you within 2–4 business hours.\n\n" +
          "Best Regards,\n" +
          "Technical Estimation Team\n" +
          "JK International\n" +
          "Toughened Glass • Aluminium Systems • uPVC Fenestration\n" +
          "Phone: +91-78146-53907 / +91-93189-53907\n" +
          "Website: https://jkglasses.com";

        GmailApp.sendEmail(email, customerSubject, customerBody, {
          name: "JK International"
        });
      } catch (eCustomer) {
        // Continue even if customer auto-responder fails
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", emailStatus: emailStatus }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Handle GET requests to verify the endpoint is online
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "online",
      service: "JK International Lead Dispatcher",
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
