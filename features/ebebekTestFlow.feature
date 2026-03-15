Feature: ebebek.com Test Akışı
  Anasayfa → Giriş → Ürün arama ve doğrulama → Sepete 1 ürün ekleme → Çıkış.

  Scenario: Kullanıcı Hesabına Giriş Yaparak Sepetine Ürün Ekler
    Given kullanıcı e-bebek.com anasayfa sayfasındadır
    When kullanıcı giriş yapar
    When "bebek arabası" aranır
    Then arama sonuçları listelenir
    When ilk ürün sepete eklenir
    Then sepette ürün olduğu doğrulanır
    When kullanıcı çıkış yapar
    Then "Giriş" butonunun görünür olduğu kontrol edilir
