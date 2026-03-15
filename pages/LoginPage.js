const BasePage = require('./BasePage');

/**
 * Giriş (login) sayfası / formu.
 */
class LoginPage extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  /** DOM: Hesabım – hover ile alt menü açılır */
  get myAccount() {
    return this.page.locator('#lnkMyAccount').first();
  }

  /** DOM: Giriş Yap / Hesap Oluştur – Alt Menü butonu */
  get loginCreateAccountButton() {
    return this.page.locator('a#lnkLoginNavNode[href="/login"]').first();
  }

  /** Login/Kayıt sayfası ortasındaki "Üyelik" başlığı – sayfa doğrulaması için */
  get membershipHeading() {
    return this.page.getByRole('heading', { name: 'Üyelik' });
  }

  /** Login sayfasında "E-posta ile" sekmesi */
  get withEmailButton() {
    return this.page.locator('#btnLoginWithEmail');
  }

  /** Login sayfasında e-posta alanı */
  get emailInputField() {
    return this.page.locator('#txtEmail');
  }

  /** Login formunda şifre alanı */
  get passwordInputField() {
    return this.page.getByRole('textbox', { name: 'Şifre' });
  }

  /** Login formunda "Giriş Yap / Hesap Oluştur" butonu (e-posta doldurulunca aktif) */
  get submitButton() {
    return this.page.getByRole('button', { name: 'Giriş Yap / Hesap Oluştur' });
  }

  /** Şifre girildikten sonra tıklanacak "Giriş Yap" butonu */
  get loginButton() {
    return this.page.getByRole('button', { name: 'Giriş Yap' });
  }

  /** Önce Hesabım hover → nav.orangeBackground görünür → Giriş Yap/Hesap Oluştur tıkla → E-posta ile tıkla. */
  async openLogin() {
    await this.myAccount.waitFor({ state: 'visible', timeout: 8000 });
    await this.myAccount.hover();
    await this.page.locator('nav.orangeBackground').waitFor({ state: 'visible', timeout: 5000 });
    await this.loginCreateAccountButton.waitFor({ state: 'visible', timeout: 3000 });
    await this.loginCreateAccountButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.withEmailButton.waitFor({ state: 'visible', timeout: 8000 });
    await this.withEmailButton.click();
    await new Promise((r) => setTimeout(r, 5000));
  }

  async login(email, password) {
    await this.emailInputField.waitFor({ state: 'visible', timeout: 8000 });
    await this.emailInputField.click();
    await this.emailInputField.fill(email);
    await this.passwordInputField.fill(password);
    await this.submitButton.click();
  }

  async isLoggedIn() {
    return this.page.getByRole('link', { name: /hesabım|çıkış|sepete git/i }).first().isVisible();
  }
}

module.exports = LoginPage;
