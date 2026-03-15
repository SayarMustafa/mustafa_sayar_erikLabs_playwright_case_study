Feature: ebebek.com Test Akışı
  Anasayfa → Giriş → Ürün arama ve doğrulama → Sepete 1 ürün ekleme → Sepet doğrulama →Çıkış.

  Scenario: Kullanıcı Hesabına Giriş Yaparak Sepetine Ürün Ekler
    Given kullanıcı e-bebek.com anasayfa sayfasındadır
    When kullanıcı giriş yapar
    Then giriş yapıldığı doğrulanır
    When kullanıcı anasayfaya döner
    When "bebek arabası" aranır
    Then arama sonuçları listelenir
    When ilk ürün sepete eklenir
    Then sepette ürün olduğu doğrulanır
    When sepetteki ürüne tıklanır
    Then ürün detay sayfasında olduğu ve doğru ürün olduğu doğrulanır
    When kullanıcı çıkış yapar
    Then Kullanıcının çıkış yaptığı doğrulanır
