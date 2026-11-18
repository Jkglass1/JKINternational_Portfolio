/* ==========================================================================
   JK International - Quotation / Contact Form
   Powers every <form data-lead-form>: division buttons, quick-add chips,
   inline validation, draft saving, and sending to Google Sheets through
   window.dispatchQuotationLead (assets/js/lead-config.js).
   ========================================================================== */

(function () {
  'use strict';

  var WHATSAPP_NUMBER = (window.JK_LEAD_CONFIG && window.JK_LEAD_CONFIG.whatsAppNumber) || '918566008869';
  var PHONE_DISPLAY = '+91-78146-53907';
  var PHONE_HREF = 'tel:+917814653907';
  var DRAFT_KEY = 'jk-lead-draft';

  var ICON_ERROR = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>';
  var ICON_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';
  var ICON_WHATSAPP = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.3z"/></svg>';

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function whatsAppLink(text) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
  }

  function readDraft() {
    try { return JSON.parse(window.sessionStorage.getItem(DRAFT_KEY)) || {}; } catch (e) { return {}; }
  }

  function writeDraft(data) {
    try { window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data)); } catch (e) { /* storage unavailable */ }
  }

  function clearDraft() {
    try { window.sessionStorage.removeItem(DRAFT_KEY); } catch (e) { /* storage unavailable */ }
  }

  /* --- Field rules: return an error message, or '' when valid --- */
  var RULES = {
    name: function (v) {
      if (!v) return 'Please tell us your name.';
      if (v.replace(/[^A-Za-zÀ-ɏऀ-ॿ]/g, '').length < 2) return 'Please enter your full name.';
      return '';
    },
    phone: function (v) {
      if (!v) return 'We need a number to send your quote.';
      var digits = v.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
      if (digits.length < 10 || digits.length > 13) return 'Enter a 10-digit mobile number, e.g. 98765 43210.';
      return '';
    },
    email: function (v) {
      if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'That email looks incomplete, e.g. name@company.com.';
      return '';
    }
  };

  function initForm(form) {
    var alertBox = form.querySelector('[data-form-alert]');
    var divisionInput = form.querySelector('input[name="division"]');
    var pills = Array.prototype.slice.call(form.querySelectorAll('.jk-div-pill'));
    var chips = Array.prototype.slice.call(form.querySelectorAll('.jk-chip-btn'));
    var details = form.querySelector('textarea[name="requirements"]');
    var submitBtn = form.querySelector('[type="submit"]');
    var submitLabel = submitBtn.innerHTML;
    var successPanel = null;

    function field(name) {
      return form.querySelector('[name="' + name + '"]');
    }

    /* --- Inline errors --- */
    function showError(input, message) {
      var errorEl = form.querySelector('[data-error-for="' + input.name + '"]');
      var wrap = input.closest('.jk-form-field');
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (wrap) {
        wrap.classList.toggle('has-error', !!message);
        wrap.classList.toggle('is-valid', !message && !!input.value.trim());
      }
      if (errorEl) errorEl.textContent = message;
    }

    function validate(input) {
      var rule = RULES[input.name];
      if (!rule) return true;
      var message = rule(input.value.trim());
      showError(input, message);
      return !message;
    }

    Object.keys(RULES).forEach(function (name) {
      var input = field(name);
      if (!input) return;
      // Judge a field once the visitor leaves it, then re-check live while they fix it
      input.addEventListener('blur', function () {
        if (input.value.trim() || input.dataset.touched) validate(input);
        input.dataset.touched = '1';
      });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true') validate(input);
      });
    });

    /* --- Division buttons (radio group with arrow-key support) --- */
    function selectDivision(pill, focus) {
      pills.forEach(function (p) {
        var on = p === pill;
        p.classList.toggle('active', on);
        p.setAttribute('aria-checked', on ? 'true' : 'false');
        p.tabIndex = on ? 0 : -1;
      });
      divisionInput.value = pill.getAttribute('data-val');
      if (focus) pill.focus();
      saveDraft();
    }

    pills.forEach(function (pill, i) {
      pill.addEventListener('click', function () { selectDivision(pill); });
      pill.addEventListener('keydown', function (e) {
        var step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        selectDivision(pills[(i + step + pills.length) % pills.length], true);
      });
    });

    /* --- Quick-add chips toggle a tag in the project details --- */
    function detailTags() {
      return details.value.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    }

    function syncChips() {
      var tags = detailTags();
      chips.forEach(function (chip) {
        var on = tags.indexOf(chip.getAttribute('data-tag')) !== -1;
        chip.classList.toggle('added', on);
        chip.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var tag = chip.getAttribute('data-tag');
        var tags = detailTags();
        var at = tags.indexOf(tag);
        if (at === -1) tags.push(tag); else tags.splice(at, 1);
        details.value = tags.join(', ');
        syncChips();
        saveDraft();
      });
    });
    details.addEventListener('input', syncChips);

    /* --- Keep a draft so a stray click away doesn't lose what was typed --- */
    function saveDraft() {
      writeDraft({
        division: divisionInput.value,
        name: field('name').value,
        phone: field('phone').value,
        email: field('email').value,
        requirements: details.value
      });
    }

    var draft = readDraft();
    ['name', 'phone', 'email', 'requirements'].forEach(function (name) {
      if (draft[name]) field(name).value = draft[name];
    });
    form.addEventListener('input', saveDraft);

    /* --- Initial division: ?division= link beats a saved draft --- */
    var urlDivision = (new URLSearchParams(window.location.search).get('division') || '').toLowerCase();
    var initialPill = pills.filter(function (p) { return urlDivision && p.getAttribute('data-key') === urlDivision; })[0] ||
      pills.filter(function (p) { return p.getAttribute('data-val') === draft.division; })[0] ||
      pills[0];
    selectDivision(initialPill);
    syncChips();

    /* --- "Enquire" buttons on product cards pre-fill the product name --- */
    document.addEventListener('click', function (e) {
      var link = e.target.closest && e.target.closest('.cat-btn-enquire');
      var targetId = link ? (link.getAttribute('href') || '').split('#')[1] : '';
      if (!targetId || !form.closest('#' + CSS.escape(targetId))) return;
      var card = link.closest('.cat-product-card');
      var product = card && card.querySelector('.cat-product-name');
      if (!product) return;
      var tag = product.textContent.trim();
      if (detailTags().indexOf(tag) === -1) {
        details.value = [tag].concat(detailTags()).join(', ');
        syncChips();
        saveDraft();
      }
    });

    /* --- Alerts and success state --- */
    function showAlert(html) {
      alertBox.className = 'jk-form-alert error';
      alertBox.innerHTML = ICON_ERROR + '<span>' + html + '</span>';
    }

    function hideAlert() {
      alertBox.className = 'jk-form-alert';
      alertBox.innerHTML = '';
    }

    function setBusy(busy) {
      submitBtn.disabled = busy;
      submitBtn.classList.toggle('is-loading', busy);
      submitBtn.innerHTML = busy ? '<span class="jk-spinner" aria-hidden="true"></span><span>Sending your inquiry&hellip;</span>' : submitLabel;
    }

    function showSuccess(lead) {
      var firstName = lead.firstName || 'there';
      successPanel = document.createElement('div');
      successPanel.className = 'jk-form-success';
      successPanel.setAttribute('role', 'status');
      successPanel.tabIndex = -1;
      successPanel.innerHTML =
        '<div class="jk-success-icon">' + ICON_CHECK + '</div>' +
        '<h4>Thank you, ' + escapeHtml(firstName) + '!</h4>' +
        '<p>Your inquiry for <strong>' + escapeHtml(lead.division) + '</strong> has reached our factory team. ' +
        'We\'ll call you on <strong>' + escapeHtml(lead.phone) + '</strong> within 2&ndash;4 business hours.</p>' +
        '<div class="jk-success-actions">' +
          '<a class="jk-success-wa" target="_blank" rel="noopener" href="' + whatsAppLink(
            'Hello JK International, I just sent a quotation inquiry for ' + lead.division + '. My name is ' + lead.fullName + '.'
          ) + '">' + ICON_WHATSAPP + 'Need it faster? Chat on WhatsApp</a>' +
          '<button type="button" class="jk-success-again">Send another inquiry</button>' +
        '</div>';
      form.hidden = true;
      form.parentNode.insertBefore(successPanel, form.nextSibling);
      successPanel.focus({ preventScroll: true });
      successPanel.scrollIntoView({ behavior: 'smooth', block: 'center' });

      successPanel.querySelector('.jk-success-again').addEventListener('click', function () {
        successPanel.remove();
        successPanel = null;
        form.hidden = false;
        field('name').focus();
      });
    }

    function resetForm() {
      form.reset();
      selectDivision(pills[0]);
      form.querySelectorAll('.jk-form-field').forEach(function (wrap) {
        wrap.classList.remove('has-error', 'is-valid');
      });
      form.querySelectorAll('[aria-invalid]').forEach(function (el) { el.removeAttribute('aria-invalid'); });
      form.querySelectorAll('[data-touched]').forEach(function (el) { delete el.dataset.touched; });
      syncChips();
      clearDraft();
    }

    /* --- Submit --- */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      hideAlert();

      var firstInvalid = null;
      Object.keys(RULES).forEach(function (name) {
        var input = field(name);
        if (input && !validate(input) && !firstInvalid) firstInvalid = input;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      var fullName = field('name').value.trim().replace(/\s+/g, ' ');
      var nameParts = fullName.split(' ');
      var lead = {
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(' '),
        fullName: fullName,
        email: field('email').value.trim(),
        phone: field('phone').value.trim(),
        division: divisionInput.value,
        requirements: details.value.trim(),
        sourcePage: form.getAttribute('data-source') || document.title
      };

      // Bots fill the hidden "website" field; quietly pretend it worked
      if (field('website') && field('website').value) {
        resetForm();
        showSuccess(lead);
        return;
      }

      setBusy(true);
      Promise.resolve(window.dispatchQuotationLead ? window.dispatchQuotationLead(lead) : { success: false })
        .catch(function () { return { success: false }; })
        .then(function (result) {
          setBusy(false);
          if (result && result.success) {
            resetForm();
            showSuccess(lead);
          } else {
            showAlert(
              '<strong>We couldn\'t send that just now.</strong> Your details are still here &mdash; try again, ' +
              'or reach us directly on <a href="' + whatsAppLink('Hello JK International, I would like a quotation for ' + lead.division + '.') +
              '" target="_blank" rel="noopener">WhatsApp</a> or <a href="' + PHONE_HREF + '">' + PHONE_DISPLAY + '</a>.'
            );
            alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        });
    });
  }

  document.querySelectorAll('form[data-lead-form]').forEach(initForm);
})();
