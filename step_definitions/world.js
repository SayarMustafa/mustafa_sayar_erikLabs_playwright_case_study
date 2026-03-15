const path = require('path');
const { setWorldConstructor } = require('@cucumber/cucumber');

const BasePage = require(path.join(__dirname, '..', 'pages', 'BasePage'));
const LoginPage = require(path.join(__dirname, '..', 'pages', 'LoginPage'));
const HomePage = require(path.join(__dirname, '..', 'pages', 'HomePage'));
const SearchResultsPage = require(path.join(__dirname, '..', 'pages', 'SearchResultsPage'));
const ProductPage = require(path.join(__dirname, '..', 'pages', 'ProductPage'));
const CartPage = require(path.join(__dirname, '..', 'pages', 'CartPage'));
const Header = require(path.join(__dirname, '..', 'pages', 'Header'));

class CustomWorld {
  constructor() {
    this.page = null;
    this.context = null;
    this.browser = null;
    this.baseURL = null;
  }

  get basePage() {
    return new BasePage(this.page, this.baseURL);
  }

  get homePage() {
    return new HomePage(this.page, this.baseURL);
  }

  get loginPage() {
    return new LoginPage(this.page, this.baseURL);
  }

  get searchResultsPage() {
    return new SearchResultsPage(this.page, this.baseURL);
  }

  get productPage() {
    return new ProductPage(this.page, this.baseURL);
  }

  get cartPage() {
    return new CartPage(this.page, this.baseURL);
  }

  get header() {
    return new Header(this.page, this.baseURL);
  }
}

setWorldConstructor(CustomWorld);
