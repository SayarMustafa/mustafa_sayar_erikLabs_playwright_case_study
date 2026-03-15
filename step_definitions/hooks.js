const path = require('path');
const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
const BasePage = require(path.join(__dirname, '..', 'pages', 'BasePage'));
const config = require(path.join(__dirname, '..', 'runners', 'playwright.config.cjs'));

setDefaultTimeout(60000);

const engines = { chromium, firefox, webkit };
const browser = (process.env.BROWSER || 'chromium').toLowerCase();
Before(async function () {
  const launch = { ...config.launchOptions };
  if (process.env.HEADED === '1' || process.env.HEADED === 'true') {
    launch.headless = false;
    launch.slowMo = 400;
  }
  this.browser = await (engines[browser] || chromium).launch(launch);
  const ctxOpts = { ...config.contextOptions, ...(launch.headless === false && { viewport: null }) };
  this.context = await this.browser.newContext(ctxOpts);
  this.page = await this.context.newPage();
  this.page.setDefaultNavigationTimeout(config.defaultNavigationTimeout);
  this.page.setDefaultTimeout(config.defaultTimeout);
  this.baseURL = config.baseURL;
  if (launch.headless === false) {
    await this.page.goto(this.baseURL);
    await new Promise((r) => setTimeout(r, 800));
    const base = new BasePage(this.page, this.baseURL);
    const popup = await base.dismissPopupIfPresent();
    if (popup.success) console.log(`[Popup] Kapatıldı: strateji "${popup.strategyLabel}".`);
    await new Promise((r) => setTimeout(r, 150));
    const cookie = await base.dismissCookieBannerIfPresent();
    if (cookie.success) console.log(`[Çerez] Kapatıldı: strateji "${cookie.strategyLabel}".`);
    const notification = await base.dismissNotificationPromptIfPresent();
    if (notification.success) console.log(`[Bildirim] Engelle: strateji "${notification.strategyLabel}".`);
  }
});

After({ timeout: 320000 }, async function () {
  if (process.env.HEADED === '1' || process.env.HEADED === 'true') {
    console.log('\n*** Tarayıcı açık — Ctrl+C ile kapat ***\n');
    await new Promise((r) => setTimeout(r, 300000));
  }
  const t = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('t')), ms));
  try { if (this.context) await Promise.race([this.context.close(), t(3000)]); } catch (_) {}
  try { if (this.browser) await Promise.race([this.browser.close(), t(3000)]); } catch (_) {}
});
