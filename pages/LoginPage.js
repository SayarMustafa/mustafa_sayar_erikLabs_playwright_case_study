const BasePage = require('./BasePage');

/**
 * Giriş (login) sayfası / formu.
 * e-bebek: Giriş Yap modal veya sayfası.
 */
class LoginPage extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  get loginLink() {
    return this.page.getByRole('link', { name: /giriş yap|üye girişi/i }).first();
  }

  get emailInput() {
    return this.page.getByRole('textbox', { name: /e-?posta|e-?mail|e-posta/i }).or(this.page.locator('input[type="email"]')).first();
  }

  get passwordInput() {
    return this.page.locator('input[type="password"]').first();
  }

  get submitButton() {
    return this.page.getByRole('button', { name: /giriş yap|giriş/i }).first();
  }

  async openLogin() {
    await this.loginLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async isLoggedIn() {
    return this.page.getByRole('link', { name: /hesabım|çıkış|sepete git/i }).first().isVisible();
  }
}

module.exports = LoginPage;
