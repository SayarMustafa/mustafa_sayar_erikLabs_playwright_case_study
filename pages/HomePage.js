const BasePage = require('./BasePage');

/**
 * Ana sayfa
 */
class HomePage extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  get searchInput() {
    return this.page
      .locator('#txtSearchBox')
      .or(this.page.getByPlaceholder(/ara|ürün|search|kategori|marka/i))
      .or(this.page.locator('input[type="search"]'))
      .or(this.page.locator('input[name*="search"], input[name*="q"], input[aria-label*="ara"]'))
      .first();
  }

  async open() {
    await this.goto('/');
    await this.waitForLoad();
    await this.dismissPopupIfPresent();
    await this.dismissCookieBannerIfPresent();
  }

  /** Arama kutusuna tıklar (açık menü kapanır), yazar, Enter ile arama yapar. HEADED modda yazıyı görebilmen için tuş tuş yazar. */
  async search(term) {
    await this.dismissPopupIfPresent();
    await this.dismissCookieBannerIfPresent();
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.click();
    const headed = /^1|true$/i.test(String(process.env.HEADED || ''));
    if (headed) {
      await this.searchInput.fill('');
      await new Promise((r) => setTimeout(r, 300));
      await this.page.keyboard.type(term, { delay: 100 });
      await new Promise((r) => setTimeout(r, 500));
    } else {
      await this.searchInput.fill(term);
      await new Promise((r) => setTimeout(r, 400));
    }
    await this.searchInput.press('Enter');
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = HomePage;
