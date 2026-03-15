# Locator Strategy Pattern

Proje dokümanına uygun locator yönetimi; 3 temel stratejiye dayanır.

## 1. Locator Abstraction
- Sayfa ve step kodunda **ham selector (string) kullanılmaz**.
- Tüm erişim `definitions.js` içindeki anahtarlar ve `LocatorStrategy` üzerinden yapılır.
- Locator tipi (id, css, xpath, container) tanımdan okunur; kod tek yerde güncellenir.

## 2. Priority Strategy
- Her öğe (popup kapat, çerez kapat vb.) için **öncelik sıralı strateji listesi** tanımlanır.
- İlk strateji (primary) denenir; başarısız olursa sırayla sonrakiler (fallback) denenir.
- İlk başarılı strateji kullanılır; log’da hangi stratejinin kullanıldığı yazılır.

## 3. Centralized Locator Management
- Tüm locator tanımları **tek kaynak**: `locators/definitions.js`.
- Yeni locator veya yedek strateji eklemek/değiştirmek sadece bu dosyadan yapılır.
- `LocatorStrategy.js` bu tanımları okuyup Priority Strategy uygular.

## Dosyalar
- **definitions.js** – Merkezi locator tanımları (öncelik sırasıyla).
- **LocatorStrategy.js** – Abstraction + Priority Strategy mantığı; `BasePage` bu sınıfı kullanır.
