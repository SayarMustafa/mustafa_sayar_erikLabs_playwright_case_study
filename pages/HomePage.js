const BasePage = require('./BasePage');

/**
 * Ana sayfa; arama kutusu burada.
 */
class HomePage extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  get searchInput() {
    return this.page.getByPlaceholder(/ara|ürün ara|search/i).or(this.page.locator('input[type="search"]')).first();
  }

  get searchButton() {
    return this.page.getByRole('button', { name: /ara|search/i }).first();
  }

  async open() {
    await this.goto('/');
    await this.waitForLoad();
  }

  async search(term) {
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }
}

module.exports = HomePage;
