const BasePage = require('./BasePage');

/**
 * Sepet sayfası; sepetteki ürünler ve doğrulama.
 */
class CartPage extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }
  /** Sepet linkini döner */
  get cartLink() {
    return this.page.getByRole('link', { name: /sepet|cart/i }).first();
  }

  /** Sepetim sayfası başlığı – sayfada olduğumuzu doğrulamak için */
  get cartPageHeading() {
    return this.page.getByRole('heading', { name: 'Sepetim' });
  }

  /** Sepet sayfasında olduğumuzu doğrular (Sepetim heading görünür). */
  async assertOnCartPage() {
    await this.cartPageHeading.waitFor({ state: 'visible', timeout: 15000 });
  }
  /** Sepetteki ürünleri listeler */
  get cartItems() {
    return this.page.locator('[class*="cart-item"], [class*="basket-item"], [class*="cart-line"], [data-testid*="cart-item"], table[class*="cart"] tbody tr, [class*="sepet"] [class*="item"]');
  }
  /** Sepetin boş olduğunu doğrular */
  get emptyCartMessage() {
    return this.page.getByText(/Alışveriş Sepetiniz Boş/i).first();
  }

  /** Sepete gider */
  async openCart() {
    await this.cartLink.click();
    await this.waitForLoad();
  }

  /** Sepetteki ürün sayısını döner */
  async getCartItemCount() {
    return this.cartItems.count();
  }

  /** Sepetin boş olduğunu doğrular */
  async isEmpty() {
    return this.emptyCartMessage.isVisible();
  }

  /** Sepetteki ilk ürün linkine tıklar (ürün detay sayfasına gider). */
  async clickFirstProductInCart() {
    const productLink = this.page.locator('main a[href*="-p-"], [class*="cart"] a[href*="-p-"], [class*="sepet"] a[href*="-p-"]').first();
    await productLink.waitFor({ state: 'visible', timeout: 10000 });
    await productLink.click();
  }
}

module.exports = CartPage;
