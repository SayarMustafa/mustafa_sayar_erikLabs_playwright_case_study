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
    return this.page.locator(
      '[class*="product"] a[href^="/"], a[href*="-c20"], a[href*="-c10"], a[href*="/urun"], [data-product-id], [class*="product-card"], [class*="product-item"], main a[href*="product"], main [class*="product"] a'
    );
  }

  get mainProductLinks() {
    return this.page.locator(
      'main a[href*="-c20"], main a[href*="-c10"], main a[href*="/urun"], main [class*="product-list"] a[href^="/"], main [class*="search-result"] a[href^="/"], main [class*="product"] a[href^="/"]'
    );
  }

  get firstProductAddToCartButton() {
    return this.page
      .getByRole('button', { name: /sepete ekle|add to cart|sepete ekle/i })
      .or(this.page.getByText('Sepete Ekle', { exact: false }).first())
      .first();
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
    const mainCount = await this.mainProductLinks.count();
    const link = mainCount > 0 ? this.mainProductLinks.first() : this.firstProductLink;
    await link.scrollIntoViewIfNeeded();
    await link.click();
  }
}

module.exports = SearchResultsPage;
