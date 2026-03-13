const BasePage = require('./BasePage');

/**
 * Site genelinde ortak header; giriş linki, sepet, çıkış.
 * Modüler kullanım: her sayfada header aynı.
 */
class Header extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  get loginLink() {
    return this.page.getByRole('link', { name: /giriş yap|üye girişi/i }).first();
  }

  get userMenu() {
    return this.page.getByRole('button', { name: /hesabım|hesap|account/i }).or(this.page.locator('[class*="user-menu"], [class*="account-menu"]')).first();
  }

  get logoutLink() {
    return this.page.getByRole('link', { name: /çıkış|logout/i }).first();
  }

  get cartIcon() {
    return this.page.getByRole('link', { name: /sepet|cart/i }).first();
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutLink.waitFor({ state: 'visible', timeout: 5000 });
    await this.logoutLink.click();
  }

  async isLogoutVisible() {
    return this.logoutLink.isVisible();
  }
}

module.exports = Header;
