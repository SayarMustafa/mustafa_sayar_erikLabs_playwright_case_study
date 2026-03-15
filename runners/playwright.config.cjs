/** Cucumber + Playwright. BROWSER=chromium|firefox|webkit */
module.exports = {
  baseURL: 'https://www.e-bebek.com',
  launchOptions: { headless: true, timeout: 30000, slowMo: 0, args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'] },
  contextOptions: {
    viewport: { width: 1920, height: 1080 },
    locale: 'tr-TR',
    ignoreHTTPSErrors: false,
    userAgent: undefined,
  },

  defaultNavigationTimeout: 30000,
  defaultTimeout: 10000,
};
