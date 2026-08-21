/**
 * Contact Details Loader — runtime replacement of personal contact info
 * =============================================================================
 *
 * When the presentation is built for online review, personal details
 * (name, email, phone) are baked in as placeholder text like
 * "[WG Lead Name]". This script attempts to fetch real contact details
 * from a local service (scripts/contact-service.mjs). If the service is
 * reachable, it replaces all placeholder text in the DOM with real values.
 * If unreachable, the placeholders remain — the presentation is in
 * "review mode" and no personal information is exposed.
 *
 * Uses TreeWalker to replace text nodes only — does NOT touch innerHTML
 * so Reveal.js DOM state (controls, slide positions, event listeners)
 * is preserved.
 */
(function () {
  'use strict';

  var CONTACT_SERVICE_URL = 'http://localhost:8091/contact';

  var REPLACEMENTS = {
    '[WG Lead Name]': 'WORKING_GROUP_LEAD_NAME',
    '[contact email]': 'WORKING_GROUP_LEAD_EMAIL',
    '[contact phone]': 'WORKING_GROUP_LEAD_PHONE',
    '{{WORKING_GROUP_LEAD_NAME}}': 'WORKING_GROUP_LEAD_NAME',
    '{{WORKING_GROUP_LEAD_EMAIL}}': 'WORKING_GROUP_LEAD_EMAIL',
    '{{WORKING_GROUP_LEAD_PHONE}}': 'WORKING_GROUP_LEAD_PHONE'
  };

  function hasPlaceholders() {
    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    var node;
    while ((node = walker.nextNode())) {
      for (var key in REPLACEMENTS) {
        if (node.nodeValue.indexOf(key) !== -1) return true;
      }
    }
    return false;
  }

  function applyContactDetails(details) {
    if (!details) return;

    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null
    );
    var node;
    while ((node = walker.nextNode())) {
      var val = node.nodeValue;
      var changed = false;
      for (var key in REPLACEMENTS) {
        var detailKey = REPLACEMENTS[key];
        if (details[detailKey] && val.indexOf(key) !== -1) {
          val = val.split(key).join(details[detailKey]);
          changed = true;
        }
      }
      if (changed) {
        node.nodeValue = val;
      }
    }
  }

  function load() {
    if (!hasPlaceholders()) return;

    fetch(CONTACT_SERVICE_URL)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        applyContactDetails(data);
        console.log('[contact] Loaded contact details from local service.');
      })
      .catch(function (err) {
        console.log('[contact] Local service unavailable — running in review mode.');
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load);
  } else {
    load();
  }
})();
