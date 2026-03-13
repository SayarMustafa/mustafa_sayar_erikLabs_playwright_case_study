const path = require('path');
const { Before, After } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');

const playwrightConfig = require(path.join(__dirname, '..', 'runners', 'playwright.config.cjs'));

Before(async function () {
  this.browser = await chromium.launch(playwrightConfig.launchOptions);
  this.context = await this.browser.newContext(playwrightConfig.contextOptions);
  this.page = await this.context.newPage();
  this.page.setDefaultNavigationTimeout(playwrightConfig.defaultNavigationTimeout);
  this.page.setDefaultTimeout(playwrightConfig.defaultTimeout);
  this.baseURL = playwrightConfig.baseURL;
});

After(async function () {
  try {
    if (this.context) await Promise.race([this.context.close(), timeout(3000)]);
  } catch (_) {}
  try {
    if (this.browser) await Promise.race([this.browser.close(), timeout(3000)]);
  } catch (_) {}
});

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms));
}
