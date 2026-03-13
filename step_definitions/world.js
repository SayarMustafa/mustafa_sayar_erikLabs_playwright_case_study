const { setWorldConstructor } = require('@cucumber/cucumber');

class CustomWorld {
  constructor() {
    this.page = null;
    this.context = null;
    this.browser = null;
    this.baseURL = null;
  }
}

setWorldConstructor(CustomWorld);
