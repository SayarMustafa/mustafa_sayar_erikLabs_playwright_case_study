const BasePage = require('./BasePage');

/**
 * Ürün detay sayfası.
 */
class ProductPage extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  /** Ürün sayfasındaki Sepete Ekle butonu */
  get addToCartButton() {
    return this.page.getByRole('button', { name: 'Sepete Ekle' });
  }

  get productTitle() {
    return this.page.locator('h1').first();
  }

  /** Ürün Özellikleri sekmesi/butonu – ürün sayfasında olduğumuzu doğrulamak için */
  get productDetailsTab() {
    return this.page.locator('#btnProductDetailsTab').locator('div').nth(0);
  }

  /** Ürün detay sayfasında olduğumuzu doğrular; Ürün Özellikleri alanına kaydırır, sonra yukarı döner. */
  async assertOnProductPage() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.productDetailsTab.waitFor({ state: 'visible', timeout: 15000 });
    await this.productDetailsTab.scrollIntoViewIfNeeded();
    await new Promise((r) => setTimeout(r, 500));
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 300));
  }

  /** Sayfa içeriği veya URL, beklenen ürün adı/href ile eşleşiyor mu? */
  async isProductMatching(expectedName, expectedHref) {
    if (expectedName) {
      const visible = await this.page.getByText(expectedName, { exact: false }).first().isVisible().catch(() => false);
      if (visible) return true;
    }
    if (expectedHref) {
      const slug = expectedHref.replace(/^.*?-p-/, '').split(/[?#]/)[0];
      const url = this.page.url();
      if (slug && url.includes(slug)) return true;
      if (url.includes('-p-') && expectedHref.includes('-p-')) {
        const pageSlug = url.split('-p-')[1]?.split(/[/?#]/)[0] || '';
        const expectedSlug = expectedHref.split('-p-')[1]?.split(/[/?#]/)[0] || '';
        if (pageSlug && expectedSlug && pageSlug === expectedSlug) return true;
      }
    }
    return false;
  }

  /** Sepete Ekle sonrası açılan ekrandaki "Sepete Git" butonu */
  get showCartButton() {
    return this.page.locator('#btnShowCart');
  }

  /** Sepete Ekle'ye tıkla; açılan ekranda "Sepete Git" (#btnShowCart) varsa tıkla. */
  async addToCart() {
    await this.addToCartButton.click();
    const btn = this.showCartButton;
    await btn.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    if (await btn.isVisible().catch(() => false)) await btn.click();
  }
}

module.exports = ProductPage;
