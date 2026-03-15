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
      .getByPlaceholder(/ara|ürün|search|kategori|marka/i)
      .or(this.page.locator('input[type="search"]'))
      .or(this.page.locator('input[name*="search"], input[name*="q"], input[aria-label*="ara"]'))
      .first();
  }

  get searchButton() {
    return this.page
      .getByRole('button', { name: /ara|search/i })
      .or(this.page.getByRole('link', { name: /ara|search/i }))
      .first();
  }

  async open() {
    await this.goto('/');
    await this.waitForLoad();
    await this.dismissPopupIfPresent();
    await this.dismissCookieBannerIfPresent();
  }

  /** Anasayfaya gider, overlay'leri kapatır ve sayfa başlığı ile anasayfada olduğunu doğrular. */
  async openAndAssertIsHomePage() {
    await this.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    await new Promise((r) => setTimeout(r, 800));
    await this.dismissPopupIfPresent();
    await this.dismissCookieBannerIfPresent();
    const title = await this.page.title();
    if (!/ebebek/i.test(title)) {
      throw new Error(`Anasayfa başlığı beklenmiyor (ebebek içermeli): ${title}`);
    }
  }

  async search(term) {
    await this.dismissPopupIfPresent();
    await this.dismissCookieBannerIfPresent();
    await this.searchInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchInput.fill(term);
    await new Promise((r) => setTimeout(r, 400));
    const btnVisible = await this.searchButton.isVisible().catch(() => false);
    if (btnVisible) {
      await this.searchButton.click();
    } else {
      await this.searchInput.press('Enter');
    }
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = HomePage;
