const BasePage = require('./BasePage');

/**
 * Arama sonuçları sayfası; sonuç listesi ve sepete ekleme.
 */
class SearchResultsPage extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  get resultsContainer() {
    return this.page.locator('[class*="product"], [class*="result"], [data-testid*="product"]').first();
  }

  get productCards() {
    return this.page.locator('a[href*="/product"], [class*="product-card"], [data-testid*="product-item"]');
  }

  get firstProductAddToCartButton() {
    return this.page.getByRole('button', { name: /sepete ekle|add to cart/i }).first();
  }

  get firstProductLink() {
    return this.productCards.first();
  }

  async hasResults() {
    const count = await this.productCards.count();
    return count > 0;
  }

  async getResultsCount() {
    return this.productCards.count();
  }

  async addFirstProductToCart() {
    await this.firstProductAddToCartButton.click();
  }

  async openFirstProduct() {
    await this.firstProductLink.click();
  }
}

module.exports = SearchResultsPage;
