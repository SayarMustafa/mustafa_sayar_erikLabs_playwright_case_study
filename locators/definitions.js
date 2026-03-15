/**
 * Centralized Locator Management
 * Tüm locator tanımları tek yerde; öncelik sırasına göre (ilk = en yüksek öncelik) tanımlanır.
 * Sayfa/step kodunda ham selector kullanılmaz (Locator Abstraction).
 */
module.exports = {
  popup: {
    close: [
      { type: 'id', value: 'ins-close-popup', label: 'primary' },
      {
        type: 'container',
        container: { type: 'id', value: 'ins-custom-4-layout-solid-light-popup' },
        closeSelector: 'button, [class*="close"], [aria-label*="kapat"], [aria-label*="close"], a[href="#"]',
        label: 'fallback',
      },
    ],
    containerId: 'ins-custom-4-layout-solid-light-popup',
  },

  cookie: {
    close: [
      { type: 'xpath', value: "//i[@class='icon icon-close-modal cookies__img-close']", label: 'primary' },
      { type: 'css', value: 'div.cookies__img-wrapper', label: 'primary' },
      { type: 'css', value: '[class*="cookies__img-wrapper"]', label: 'primary' },
      {
        type: 'container',
        containerSelectors: [
          '[id*="cookie"]',
          '[id*="consent"]',
          '[class*="cookie"]',
          '[class*="consent"]',
          '[class*="gdpr"]',
          '[data-testid*="cookie"]',
          '[data-testid*="consent"]',
        ],
        closeSelector: 'button, [class*="close"], [aria-label*="kapat"], [aria-label*="close"], [title*="kapat"], [title*="close"], a[href="#"], [class*="dismiss"]',
        acceptRegex: /kabul\s*et|accept|çerezleri\s*kabul|tümünü\s*kabul|tamam|allow\s*all|izin\s*ver/i,
        label: 'fallback',
      },
      {
        type: 'page',
        closeSelector: 'button, [class*="close"], [aria-label*="kapat"], [aria-label*="close"], [title*="kapat"], [title*="close"], a[href="#"], [class*="dismiss"]',
        acceptRegex: /kabul\s*et|accept|çerezleri\s*kabul|tümünü\s*kabul|tamam|allow\s*all|izin\s*ver/i,
        label: 'fallback-page',
      },
    ],
  },

  notification: {
    block: [
      { type: 'role', role: 'button', name: /engelle|block/i, label: 'primary' },
      { type: 'text', value: /engelle|block/i, label: 'primary' },
    ],
  },

};
