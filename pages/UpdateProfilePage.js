const BasePage = require('./BasePage');

/**
 * Kişisel Bilgilerim / Update Profile sayfası.
 * Giriş doğrulama ve profil ile ilgili işlemler buradan yürütülür.
 */
class UpdateProfilePage extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  /** Kişisel bilgilerim butonu */
  get myProfileButton() {
    return this.page.locator('#btnMyProfile');
  }

  /** ebebek logosu – tıklanınca anasayfaya yönlendirir */
  get ebebekLogo() {
    return this.page.getByRole('img', { name: 'Ebebek Logo Banner' });
  }

  /** Kişisel bilgiler sayfasında olduğumuzu doğrular: buton görünür ve tıklanabilir. */
  async waitForProfilePage() {
    await this.page.waitForLoadState('domcontentloaded');
    await this.myProfileButton.waitFor({ state: 'visible', timeout: 15000 });
    const isEnabled = await this.myProfileButton.isEnabled();
    if (!isEnabled) throw new Error('"Kişisel bilgilerim" butonu tıklanabilir değil.');
  }

  /** Logoya tıklayıp anasayfaya döner */
  async goToHomePage() {
    await this.ebebekLogo.waitFor({ state: 'visible', timeout: 10000 });
    await this.ebebekLogo.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = UpdateProfilePage;
