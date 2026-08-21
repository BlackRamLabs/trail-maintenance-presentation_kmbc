/**
 * KMBC Client Branding — runtime chrome injection
 * =============================================================================
 * Populates the client logo slot in the footer with the KMBC logo.
 * Loaded after branding.js. The build sets window.KMBC_LOGO_SRC.
 */
(function () {
  'use strict';

  function setClientLogo() {
    var slot = document.querySelector('.mtbwa-footer-client-logo');
    if (slot) {
      slot.src = window.KMBC_LOGO_SRC || 'assets/client-logo.jpeg';
      slot.alt = 'KMBC logo';
      slot.style.display = 'block';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setClientLogo);
  } else {
    setClientLogo();
  }
})();
