const BasePage = require('./BasePage');

/**
 * Site genelinde ortak header; Login, Sepet, Logout.
 * Modüler kullanım: her sayfada header aynı.
 */
class Header extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  get loginLink() {
    return this.page.getByRole('link', { name: /giriş yap|üye girişi/i }).first();
  }

  /** Login ile aynı: Hesabım (#lnkMyAccount) – hover/tıklayınca menü açılır */
  get userMenu() {
    return this.page.locator('#lnkMyAccount').first();
  }

  get logoutLink() {
    return this.page.getByRole('link', { name: 'Çıkış Yap' }).or(this.page.getByRole('link', { name: /çıkış|logout/i })).first();
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutLink.waitFor({ state: 'visible', timeout: 5000 });
    await this.logoutLink.click();
  }

  /** Hesabım'a tıklar → Kişisel bilgiler sayfasına gider (menü açık kalabilir, step'te kapatılır). */
  async goToProfile() {
    await this.userMenu.click();
  }
}

module.exports = Header;
