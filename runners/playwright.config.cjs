/**
 * Cucumber + Playwright koşuları için Playwright ayarları.
 * step_definitions/hooks.js bu config'i kullanarak tarayıcı ve sayfa oluşturur.
 */
module.exports = {
  baseURL: 'https://www.e-bebek.com',

  launchOptions: {
    headless: true,
    timeout: 30000,
    slowMo: 0,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },

  contextOptions: {
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: false,
    userAgent: undefined,
  },

  defaultNavigationTimeout: 30000,
  defaultTimeout: 10000,
};
