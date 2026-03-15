const path = require('path');
const { LocatorStrategy } = require(path.join(__dirname, '..', 'locators', 'LocatorStrategy'));

/**
 * Tüm sayfa nesnelerinin türediği temel sınıf.
 * Ortak metodlar burada; kod tekrarı yok (DRY).
 * Locator Strategy Pattern: Locator Abstraction + Priority Strategy + Centralized management.
 */
class BasePage {
  constructor(page, baseURL) {
    this.page = page;
    this.baseURL = baseURL || '';
    this.locatorStrategy = new LocatorStrategy(page);
  }

  async goto(path = '') {
    const url = path.startsWith('http') ? path : `${this.baseURL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
    await this.page.goto(url);
  }

  async waitForLoad(state = 'domcontentloaded') {
    await this.page.waitForLoadState(state);
  }

  /**
   * Popup görünürse kapatır (Locator Strategy: priority order). Görünmüyorsa sessizce devam eder.
   * @returns {{ success: boolean, strategyLabel?: string }}
   */
  async dismissPopupIfPresent() {
    return this.locatorStrategy.dismissPopupIfPresent();
  }

  /**
   * Çerez bildirimi görünürse kapatır (Locator Strategy: priority order). Görünmüyorsa sessizce devam eder.
   * @returns {{ success: boolean, strategyLabel?: string }}
   */
  async dismissCookieBannerIfPresent() {
    return this.locatorStrategy.dismissCookieBannerIfPresent();
  }

  /**
   * Bildirim izni (İzin ver / Engelle) görünürse "Engelle" ile kapatır. Görünmüyorsa sessizce devam eder.
   * @returns {{ success: boolean, strategyLabel?: string }}
   */
  async dismissNotificationPromptIfPresent() {
    return this.locatorStrategy.dismissNotificationPromptIfPresent();
  }

}

module.exports = BasePage;
