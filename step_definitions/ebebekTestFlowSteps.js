const path = require('path');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const testData = require(path.join(__dirname, '..', 'config', 'test-data.cjs'));

/**
 * ebebekTestFlow senaryosuna özel step'ler.
 * Page object'ler World üzerinden (this.homePage, this.loginPage, ...) kullanılır.
 */

Given('kullanıcı e-bebek.com anasayfa sayfasındadır', { timeout: 35000 }, async function () {
  console.log('Kullanıcı ebebek.com anasayfasındadır.');
  await this.homePage.open();
  const title = await this.page.title();
  if (!/ebebek|e-bebek|ana\s*sayfa/i.test((title || '').toLowerCase())) {
    throw new Error(`Kullanıcı anasayfada değil. Sayfa başlığı: ${title || '(boş)'}`);
  }
});

When('kullanıcı giriş yapar', async function () {
  console.log('Kullanıcı hesabına giriş yapar.');
  await this.basePage.dismissPopupIfPresent();
  await this.basePage.dismissCookieBannerIfPresent();
  await this.loginPage.openLogin();
  await this.page.waitForLoadState('domcontentloaded');
  await expect(this.loginPage.membershipHeading).toBeVisible();
  const email = testData.user.email;
  const password = testData.user.password;
  await this.loginPage.emailInputField.click();
  await this.loginPage.emailInputField.fill(email);
  await this.loginPage.submitButton.click();
  await this.loginPage.passwordInputField.click();
  await this.loginPage.passwordInputField.fill(password);
  await Promise.all([
    this.page.waitForURL((u) => !u.pathname.includes('/login')),
    this.loginPage.loginButton.click(),
  ]);
  const loggedInIndicator = this.page.getByRole('link', { name: /çıkış|hesabım|siparişlerim/i }).first();
  await expect(loggedInIndicator).toBeVisible({ timeout: 10000 });
});

Then('giriş yapıldığı doğrulanır', async function () {
  console.log('Giriş yapıldığı doğrulanır (Hesabım → Kişisel bilgiler).');
  await this.header.goToProfile();
  await this.page.waitForLoadState('load');
  await this.updateProfilePage.waitForProfilePage();
});

When('kullanıcı anasayfaya döner', async function () {
  console.log('Kullanıcı anasayfaya döner.');
  await this.updateProfilePage.goToHomePage();
  await this.page.waitForLoadState('domcontentloaded');
});

When('{string} aranır', async function (searchTerm) {
  console.log(`Kullanıcı "${searchTerm}" arar.`);
  await this.homePage.open();
  await this.homePage.search(searchTerm);
});

Then('arama sonuçları listelenir', async function () {
  console.log('Arama sonuçları listelenir.');
  await this.page.waitForLoadState('networkidle').catch(() => {});
  const hasResults = await this.searchResultsPage.hasResults();
  if (!hasResults) throw new Error('Arama sonucu listelenmedi.');
});

When('ilk ürün sepete eklenir', async function () {
  console.log('İlk ürün sepete eklenir (ürün sayfasına gidip Sepete Ekle).');
  await this.searchResultsPage.productList.nth(0).waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  const productInfo = await this.searchResultsPage.getFirstProductInfo();
  this.addedProductName = productInfo.name;
  this.addedProductHref = productInfo.href;
  await this.searchResultsPage.openFirstProduct();
  await this.page.waitForURL((u) => u.pathname.includes('-p-'), { timeout: 20000 });
  await this.page.waitForLoadState('domcontentloaded');
  await this.productPage.addToCartButton.waitFor({ state: 'visible', timeout: 10000 });
  await this.productPage.addToCart();
});

Then('sepette ürün olduğu doğrulanır', async function () {
  console.log('Sepette ürün olduğu doğrulanır.');
  await this.cartPage.openCart();
  await this.page.waitForLoadState('networkidle').catch(() => {});
  await this.cartPage.assertOnCartPage();
  const count = await this.cartPage.getCartItemCount();
  const empty = await this.cartPage.isEmpty();
  const hasItemText = await this.page.getByText(/ürün|sepette|adet|quantity/i).first().isVisible().catch(() => false);
  if ((empty || count < 1) && !hasItemText) throw new Error('Sepette ürün bulunamadı.');
});

When('sepetteki ürüne tıklanır', async function () {
  console.log('Sepetteki ürüne tıklanır.');
  await this.cartPage.clickFirstProductInCart();
  await this.page.waitForURL((u) => u.pathname.includes('-p-'), { timeout: 20000 });
  await this.page.waitForLoadState('domcontentloaded');
});

Then('ürün detay sayfasında olduğu ve doğru ürün olduğu doğrulanır', async function () {
  console.log('Ürün detay sayfasında ve doğru ürün olduğu doğrulanır.');
  await this.productPage.assertOnProductPage();
  const matches = await this.productPage.isProductMatching(this.addedProductName, this.addedProductHref);
  if (!matches) throw new Error(`Sepetteki ürün ile açılan sayfa eşleşmiyor. Beklenen: ${this.addedProductName || this.addedProductHref}`);
});

When('kullanıcı çıkış yapar', async function () {
  console.log('Kullanıcı çıkış yapar.');
  await this.header.logout();
});

Then('Kullanıcının çıkış yaptığı doğrulanır', async function () {
  console.log('Kullanıcının çıkış yaptığı doğrulanır (Hesabım hover → Giriş Yap görünür).');
  await this.header.userMenu.waitFor({ state: 'visible', timeout: 10000 });
  await this.header.userMenu.hover();
  await this.header.loginLink.waitFor({ state: 'visible', timeout: 15000 });
  const visible = await this.header.loginLink.isVisible();
  if (!visible) throw new Error('Çıkış sonrası "Giriş Yap" görünür değil.');
});

Then('{string} butonunun görünür olduğu kontrol edilir', async function (elementNameOrText) {
  console.log(`"${elementNameOrText}" görünür olduğu kontrol edilir.`);
  const re = new RegExp((elementNameOrText || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const locator = this.page
    .getByRole('button', { name: re })
    .or(this.page.getByRole('link', { name: re }))
    .or(this.page.getByText(elementNameOrText, { exact: false }));
  await locator.first().waitFor({ state: 'visible', timeout: 15000 });
  const visible = await locator.first().isVisible();
  if (!visible) throw new Error(`"${elementNameOrText}" görünür değil.`);
});
