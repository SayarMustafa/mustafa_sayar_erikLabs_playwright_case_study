const { When, Then } = require('@cucumber/cucumber');

/**
 * Hazır (reusable) step'ler 
 * Mümkün olduğunca yeniden kullanılacak
 */

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// elemente tıklar
When('{string} elementine tıklanır', async function (elementName) {
  console.log(`[When] Elementine tıklanır: "${elementName}".`);
  const re = new RegExp(escapeRegex(elementName), 'i');
  const locator = this.page
    .getByRole('button', { name: re })
    .or(this.page.getByRole('link', { name: re }))
    .or(this.page.getByRole('menuitem', { name: re }))
    .or(this.page.getByText(elementName, { exact: false }));
  await locator.first().waitFor({ state: 'visible', timeout: 15000 });
  await locator.first().click();
});

// text'e tıklar 
When('{string} text\'ine tıklanır', async function (text) {
  console.log(`[When] Text'ine tıklanır: "${text}".`);
  const locator = this.page.getByText(text, { exact: false });
  await locator.first().waitFor({ state: 'visible', timeout: 15000 });
  await locator.first().click();
});

// elementin görünür olduğunu kontrol eder
Then('{string} elementinin görünür olduğu kontrol edilir', async function (elementNameOrText) {
  console.log(`[Then] Element görünür kontrolü: "${elementNameOrText}".`);
  const re = new RegExp(escapeRegex(elementNameOrText), 'i');
  const locator = this.page
    .getByRole('button', { name: re })
    .or(this.page.getByRole('link', { name: re }))
    .or(this.page.getByText(elementNameOrText, { exact: false }));
  await locator.first().waitFor({ state: 'visible', timeout: 15000 });
  const visible = await locator.first().isVisible();
  if (!visible) throw new Error(`"${elementNameOrText}" görünür değil.`);
});

//  alanların doldurulmasını sağlar
When('{string} alanına {string} yazılır', async function (fieldLabelOrPlaceholder, value) {
  console.log(`[When] Alanına yazılır: "${fieldLabelOrPlaceholder}" -> "${value}".`);
  const re = new RegExp(escapeRegex(fieldLabelOrPlaceholder), 'i');
  const locator = this.page
    .getByLabel(re)
    .or(this.page.getByPlaceholder(re))
    .or(this.page.getByRole('textbox', { name: re }));
  await locator.first().waitFor({ state: 'visible', timeout: 15000 });
  await locator.first().fill(value);
});

// sayfalar arasında geçiş yapar
When('{string} sayfasına gidilir', async function (pathOrUrl) {
  console.log(`[When] Sayfasına gidilir: "${pathOrUrl}".`);
  const url = pathOrUrl.startsWith('http') ? pathOrUrl : `${(this.baseURL || '').replace(/\/$/, '')}/${pathOrUrl.replace(/^\//, '')}`;
  await this.page.goto(url);
  await this.page.waitForLoadState('domcontentloaded');
});
