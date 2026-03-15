/**
 * Locator Strategy Pattern (generic)
 * Tek executor: definitions'daki strateji listesini sırayla dener, ilk başarılı olanı uygular.
 */
const definitions = require('./definitions');

const OVERLAY_CONFIG = {
  popup: { strategies: () => definitions.popup?.close || [], meta: () => ({ containerId: definitions.popup?.containerId }) },
  cookie: { strategies: () => definitions.cookie?.close || [], meta: () => ({}) },
  notification: { strategies: () => definitions.notification?.block || [], meta: () => ({}) },
};

const DEFAULTS = { waitVisible: 3000, click: 5000, hide: 4000 };

class LocatorStrategy {
  constructor(page) {
    this.page = page;
  }

  /**
   * Tek bir strateji dene; başarılıysa { success, strategyLabel } döner.
   */
  async _tryStrategy(strategy, overlayKey, meta, options) {
    const { waitVisible, click: clickTimeout, hide: hideTimeout } = { ...DEFAULTS, ...options };
    const label = strategy.label || 'strategy';

    const clickAndMaybeWaitHide = async (containerId) => {
      if (overlayKey === 'popup' && containerId) {
        await this.page.locator(`#${containerId}`).waitFor({ state: 'hidden', timeout: hideTimeout }).catch(() => {});
      }
    };

    // id
    if (strategy.type === 'id' && strategy.value) {
      const loc = this.page.locator(`#${strategy.value.replace(/^#/, '')}`);
      try { await loc.waitFor({ state: 'visible', timeout: waitVisible }); } catch { return null; }
      if (await loc.isVisible().catch(() => false)) {
        await loc.click({ timeout: clickTimeout }).catch(() => {});
        await clickAndMaybeWaitHide(meta.containerId);
        return { success: true, strategyLabel: label };
      }
      return null;
    }

    // xpath
    if (strategy.type === 'xpath' && strategy.value) {
      const xpath = strategy.value.startsWith('xpath=') ? strategy.value : `xpath=${strategy.value}`;
      const loc = this.page.locator(xpath);
      try { await loc.waitFor({ state: 'visible', timeout: waitVisible }); } catch { return null; }
      if (await loc.isVisible().catch(() => false)) {
        await loc.click({ timeout: clickTimeout }).catch(() => {});
        return { success: true, strategyLabel: label };
      }
      return null;
    }

    // css (tek tıklanacak element)
    if (strategy.type === 'css' && strategy.value && !strategy.containerSelectors) {
      const loc = this.page.locator(strategy.value);
      try { await loc.waitFor({ state: 'visible', timeout: waitVisible }); } catch { return null; }
      if (await loc.isVisible().catch(() => false)) {
        await loc.click({ timeout: clickTimeout }).catch(() => {});
        return { success: true, strategyLabel: label };
      }
      return null;
    }

    // role (button/link + name)
    if (strategy.type === 'role' && strategy.role && strategy.name) {
      const loc = this.page.getByRole(strategy.role, { name: strategy.name }).first();
      try { await loc.waitFor({ state: 'visible', timeout: waitVisible }); } catch { return null; }
      if (await loc.isVisible().catch(() => false)) {
        await loc.click({ timeout: clickTimeout }).catch(() => {});
        return { success: true, strategyLabel: label };
      }
      return null;
    }

    // text
    if (strategy.type === 'text' && strategy.value) {
      const loc = this.page.getByText(strategy.value).first();
      try { await loc.waitFor({ state: 'visible', timeout: waitVisible }); } catch { return null; }
      if (await loc.isVisible().catch(() => false)) {
        await loc.click({ timeout: clickTimeout }).catch(() => {});
        return { success: true, strategyLabel: label };
      }
      return null;
    }

    // container (tek container id)
    if (strategy.type === 'container' && strategy.container?.value && strategy.closeSelector) {
      const container = this.page.locator(`#${strategy.container.value.replace(/^#/, '')}`);
      try { await container.waitFor({ state: 'visible', timeout: waitVisible }); } catch { return null; }
      const closeBtn = container.locator(strategy.closeSelector).first();
      if (!(await closeBtn.isVisible().catch(() => false))) return null;
      await closeBtn.click({ timeout: clickTimeout }).catch(() => {});
      await container.waitFor({ state: 'hidden', timeout: hideTimeout }).catch(() => {});
      return { success: true, strategyLabel: label };
    }

    // container (birden fazla selector, consent vb.)
    if (strategy.type === 'container' && strategy.containerSelectors) {
      for (const sel of strategy.containerSelectors) {
        const container = this.page.locator(sel).first();
        try { await container.waitFor({ state: 'visible', timeout: 1000 }); } catch { continue; }
        const closeBtn = container.locator(strategy.closeSelector).first();
        if (await closeBtn.isVisible().catch(() => false)) {
          await closeBtn.click({ timeout: clickTimeout }).catch(() => {});
          await container.waitFor({ state: 'hidden', timeout: hideTimeout }).catch(() => {});
          return { success: true, strategyLabel: label };
        }
        if (strategy.acceptRegex) {
          const acceptBtn = container.locator('button, a').filter({ hasText: strategy.acceptRegex }).first();
          if (await acceptBtn.isVisible().catch(() => false)) {
            await acceptBtn.click({ timeout: clickTimeout }).catch(() => {});
            await container.waitFor({ state: 'hidden', timeout: hideTimeout }).catch(() => {});
            return { success: true, strategyLabel: label };
          }
        }
      }
      return null;
    }

    // container (hasText ile panel bul, içinde kapat) — önce class/id ile dene
    if (strategy.type === 'container' && strategy.hasText && strategy.closeSelector) {
      let container = this.page.locator('[class*="translate"], [id*="translate"], [class*="language"]').filter({ hasText: strategy.hasText }).first();
      try { await container.waitFor({ state: 'visible', timeout: waitVisible }); } catch {
        container = this.page.getByText(strategy.hasText).first().locator('..').locator('..');
        try { await container.waitFor({ state: 'visible', timeout: waitVisible }); } catch { return null; }
      }
      const closeBtn = container.locator(strategy.closeSelector).first();
      if (await closeBtn.isVisible().catch(() => false)) {
        await closeBtn.click({ timeout: clickTimeout }).catch(() => {});
        return { success: true, strategyLabel: label };
      }
      return null;
    }

    // page (sayfa genelinde kapat/kabul)
    if (strategy.type === 'page') {
      const closeLoc = this.page.locator(strategy.closeSelector).first();
      if (await closeLoc.isVisible().catch(() => false)) {
        await closeLoc.click({ timeout: clickTimeout }).catch(() => {});
        return { success: true, strategyLabel: label };
      }
      if (strategy.acceptRegex) {
        const acceptLoc = this.page.getByRole('button', { name: strategy.acceptRegex }).first();
        if (await acceptLoc.isVisible().catch(() => false)) {
          await acceptLoc.click({ timeout: clickTimeout }).catch(() => {});
          return { success: true, strategyLabel: label };
        }
      }
    }

    return null;
  }

  /**
   * Overlay key'e göre (popup, cookie, notification) strateji listesini sırayla dener.
   */
  async dismissOverlay(overlayKey, options = {}) {
    const config = OVERLAY_CONFIG[overlayKey];
    if (!config) return { success: false };

    const strategies = config.strategies();
    const meta = config.meta();
    const opts = overlayKey === 'popup' ? { ...options, waitVisible: 2500, hide: 5000 } : overlayKey === 'cookie' ? { ...options, waitVisible: 3000, hide: 2000 } : overlayKey === 'notification' ? { ...options, waitVisible: 1000 } : options;

    for (const strategy of strategies) {
      const result = await this._tryStrategy(strategy, overlayKey, meta, opts);
      if (result) return result;
    }
    return { success: false };
  }

  async dismissPopupIfPresent(options = {}) { return this.dismissOverlay('popup', options); }
  async dismissCookieBannerIfPresent(options = {}) { return this.dismissOverlay('cookie', options); }
  async dismissNotificationPromptIfPresent(options = {}) { return this.dismissOverlay('notification', options); }
}

module.exports = { LocatorStrategy, definitions };
