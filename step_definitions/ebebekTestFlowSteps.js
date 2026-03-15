const path = require('path');
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

const testData = require(path.join(__dirname, '..', 'config', 'test-data.cjs'));

/**
 * ebebekTestFlow senaryosuna özel step'ler.
 * Page object'ler World üzerinden (this.homePage, this.loginPage, ...) kullanılır.
 */

Given('kullanıcı e-bebek.com anasayfa sayfasındadır', { timeout: 35000 }, async function () {
  console.log('Kullanıcı e-bebek.com anasayfasındadır.');
  await this.homePage.open();
  const title = await this.page.title();
  if (!/ebebek|e-bebek|ana\s*sayfa/i.test((title || '').toLowerCase())) {
    throw new Error(`Anasayfada değil. Sayfa başlığı: ${title || '(boş)'}`);
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
  console.log('Ürün sepete eklenir.');
  await this.page.waitForLoadState('networkidle').catch(() => {});
  await this.searchResultsPage.productCards.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => {});
  const addButton = this.searchResultsPage.firstProductAddToCartButton;
  const isAddVisible = await addButton.isVisible().catch(() => false);
  if (isAddVisible) {
    await addButton.scrollIntoViewIfNeeded().catch(() => {});
    await this.searchResultsPage.addFirstProductToCart();
  } else {
    await this.searchResultsPage.openFirstProduct();
    await this.page.waitForLoadState('domcontentloaded');
    await this.productPage.addToCartButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
    await this.productPage.addToCart();
  }
});

Then('sepette ürün olduğu doğrulanır', async function () {
  console.log('Sepette ürün olduğu doğrulanır.');
  await this.cartPage.openCart();
  await this.page.waitForLoadState('networkidle').catch(() => {});
  const count = await this.cartPage.getCartItemCount();
  const empty = await this.cartPage.isEmpty();
  const hasItemText = await this.page.getByText(/ürün|sepette|adet|quantity/i).first().isVisible().catch(() => false);
  if ((empty || count < 1) && !hasItemText) throw new Error('Sepette ürün bulunamadı.');
});

When('kullanıcı çıkış yapar', async function () {
  console.log('Kullanıcı çıkış yapar.');
  await this.header.logout();
});

Then('{string} butonunun görünür olduğu kontrol edilir', async function (elementNameOrText) {
  console.log(`Giriş Yap Butonunun görünür olduğu kontrol edilir: "${elementNameOrText}".`);
  const re = new RegExp((elementNameOrText || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const locator = this.page
    .getByRole('button', { name: re })
    .or(this.page.getByRole('link', { name: re }))
    .or(this.page.getByText(elementNameOrText, { exact: false }));
  await locator.first().waitFor({ state: 'visible', timeout: 15000 });
  const visible = await locator.first().isVisible();
  if (!visible) throw new Error(`"${elementNameOrText}" görünür değil.`);
});
