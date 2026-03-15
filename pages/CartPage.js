const BasePage = require('./BasePage');

/**
 * Sepet sayfası; sepetteki ürünler ve doğrulama.
 */
class CartPage extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  get cartLink() {
    return this.page.getByRole('link', { name: /sepet|cart/i }).first();
  }

  get cartItems() {
    return this.page.locator('[class*="cart-item"], [class*="basket-item"], [class*="cart-line"], [data-testid*="cart-item"], table[class*="cart"] tbody tr, [class*="sepet"] [class*="item"]');
  }

  get emptyCartMessage() {
    return this.page.getByText(/sepetiniz boş|sepette ürün yok/i).first();
  }

  async openCart() {
    await this.cartLink.click();
    await this.waitForLoad();
  }

  async gotoCartPage() {
    await this.goto('/sepet');
    await this.waitForLoad();
  }

  async getCartItemCount() {
    return this.cartItems.count();
  }

  async isEmpty() {
    return this.emptyCartMessage.isVisible();
  }
}

module.exports = CartPage;
