const BasePage = require('./BasePage');

/**
 * Arama sonuçları sayfası; sonuç listesi ve sepete ekleme.
 */
class SearchResultsPage extends BasePage {
  constructor(page, baseURL) {
    super(page, baseURL);
  }

  /** Arama sonuçları sayfası başlığı */
  get searchResultsHeading() {
    return this.page.locator('.ng-star-inserted h1').filter({ hasText: /bebek\s*araba/i });
  }

  /**
   * Sonuçlar ekranda görünene kadar bekle. Üç alternatiften biri yeterli.
   */
  async waitForResultsToLoad() {
    const anyResult = this.page
      .getByText(/adet\s*ürün\s*bulundu|ürün\s*bulundu/i)
      .or(this.page.locator('a[href*="-p-"]').first())
      .or(this.page.getByRole('heading', { name: /bebek\s*araba/i }));
    await anyResult.first().waitFor({ state: 'visible', timeout: 25000 });
  }

  /**
   * Arama sonuçları sayfasında olduğumuzu doğrular.
   */
  async assertOnSearchResultsPage() {
    await this.page.waitForLoadState('load');
    const headed = /^1|true$/i.test(String(process.env.HEADED || ''));
    if (headed) await new Promise((r) => setTimeout(r, 600));
    await this.searchResultsHeading.first().waitFor({ state: 'visible', timeout: headed ? 30000 : 20000 });
    const title = (await this.page.title()) || '';
    if (!/bebek/i.test(title) || !/araba/i.test(title)) {
      throw new Error(`Arama sonuçları sayfası bekleniyor. Page title: "${title}"`);
    }
    const adetText = this.page.getByText(/ürün\s*bulundu|adet\s*ürün/i);
    await adetText.first().waitFor({ state: 'visible', timeout: headed ? 22000 : 15000 });
  }

  /**
   * e-bebek arama sonuç sayfası
   */
  get productGridContainer() {
    return this.page.getByText(/Adet\s+ürün\s+bulundu/i).locator('xpath=ancestor::*[.//a[contains(@href,"-p-")]][1]');
  }

  /** Ürün listesi (ArrayList) */
  get productList() {
    return this.productGridContainer.locator('a[href*="-p-"]');
  }

  get mainProductLinks() {
    return this.page.locator('main a[href*="-p-"], main a[href*="-c20"], main a[href*="-c10"], main a[href*="/urun"]');
  }

  /**
   * Sepete ekleyeceğimiz ilk ürünün tanımı.
   * Sepette/ürün sayfasında doğru ürünü ekleyip eklemediğimizi kontrol etmek için kullanılır.
   * @returns {{ name: string, href: string }}
   */
  async getFirstProductInfo() {
    const grid = this.productGridContainer;
    const nameEl = grid.locator('h2').first();
    const linkEl = this.productList.nth(0);
    const name = (await nameEl.textContent().catch(() => '')).trim();
    const href = (await linkEl.getAttribute('href').catch(() => '')) || '';
    return { name, href };
  }

  async hasResults() {
    const count = await this.productList.count();
    if (count > 0) return true;
    return (await this.page.locator('main a[href*="-p-"]').count()) > 0;
  }

  /**
   * ArrayList mantığı: productList'ten ilk elemanı (nth(0)) al, tıkla.
   */
  async openFirstProduct() {
    const list = this.productList;
    const count = await list.count();
    if (count === 0) {
      const mainList = this.mainProductLinks;
      const mainCount = await mainList.count();
      if (mainCount > 0) {
        await mainList.nth(0).scrollIntoViewIfNeeded();
        await mainList.nth(0).click();
        return;
      }
      throw new Error('Arama sonuçlarında ürün bulunamadı.');
    }
    const firstProduct = list.nth(0);
    await firstProduct.scrollIntoViewIfNeeded();
    await firstProduct.click();
  }
}

module.exports = SearchResultsPage;
