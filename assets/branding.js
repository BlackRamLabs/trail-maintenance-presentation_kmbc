/**
 * MTBWA Base Branding — runtime chrome injection
 * =============================================================================
 *
 * Injects the shared MTBWA presentation chrome (footer bar with logos) into
 * every built presentation. The build copies this script into dist/ and loads
 * it after Reveal.js initialises.
 *
 * The footer contains: brand text (left, vertically centred), client logo
 * slot (right, oversized — extends above the bar). The client branding
 * script populates the client logo.
 */
(function () {
  'use strict';

  function el(tag, className, html) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  }

  function inject() {
    // Footer bar with logos
    if (!document.querySelector('.mtbwa-footer')) {
      const footer = el('div', 'mtbwa-footer');

      // Brand text (left, vertically centred by flex)
      const brand = el('span', 'mtbwa-footer-brand',
        'MTB<span class="gold">WA</span> Trail Maintenance');

      footer.appendChild(brand);

      // Version badge — inline in footer, right of brand text
      if (window.MTBWA_VERSION) {
        const ver = el('span', 'mtbwa-version', window.MTBWA_VERSION);
        footer.appendChild(ver);
      }

      // Client logo slot (right) — populated by the client branding script
      const clientLogo = el('img', 'mtbwa-footer-client-logo');
      footer.appendChild(clientLogo);
      document.body.appendChild(footer);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
