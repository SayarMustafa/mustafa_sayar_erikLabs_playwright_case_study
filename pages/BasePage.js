/**
 * Tüm sayfa nesnelerinin türediği temel sınıf.
 * Ortak metodlar burada; kod tekrarı yok (DRY).
 */
class BasePage {
  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL || '';
  }

  async goto(path = '') {
    const url = path.startsWith('http') ? path : `${this.baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    await this.page.goto(url);
  }

  async waitForLoad(state = 'domcontentloaded') {
    await this.page.waitForLoadState(state);
  }

  getTitle() {
    return this.page.title();
  }

  async waitForSelector(selector, options = {}) {
    await this.page.waitForSelector(selector, { timeout: 30000, ...options });
  }

  async isVisible(selector) {
    const el = this.page.locator(selector).first();
    return el.isVisible();
  }
}

module.exports = BasePage;
