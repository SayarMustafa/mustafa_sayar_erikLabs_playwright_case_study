const BasePage = require('./BasePage');

/**
 * Ürün detay sayfası; sepete ekle butonu.
 */
class ProductPage extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  get addToCartButton() {
    return this.page
      .getByRole('button', { name: /sepete ekle|add to cart/i })
      .or(this.page.locator('button, a').filter({ hasText: /sepete ekle/i }).first())
      .first();
  }

  get productTitle() {
    return this.page.locator('h1').first();
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async isAddToCartVisible() {
    return this.addToCartButton.isVisible();
  }
}

module.exports = ProductPage;
