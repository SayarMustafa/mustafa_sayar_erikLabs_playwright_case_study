const { Given } = require('@cucumber/cucumber');

Given('tarayıcı açıktır', async function () {
  // Playwright sayfası hooks'ta açıldı; iskelet doğrulaması
  if (!this.page) throw new Error('Sayfa (page) tanımlı değil.');
});
