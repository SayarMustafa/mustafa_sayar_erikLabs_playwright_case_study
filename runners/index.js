/**
 * Runners – Cucumber + Playwright test çalıştırıcı (tek başına)
 * Kullanım: node runners/index.js  veya  npm test  (cwd = proje kökü)
 */
const path = require('path');
const { loadConfiguration, runCucumber } = require('@cucumber/cucumber/api');

const projectRoot = path.resolve(__dirname, '..');

class Runner {
  constructor(options = {}) {
    this.cwd = options.cwd ?? projectRoot;
    this.configFile = options.configFile ?? 'runners/cucumber.config.cjs';
    this.env = options.env ?? process.env;
    this.stdout = options.stdout ?? process.stdout;
    this.stderr = options.stderr ?? process.stderr;
  }

  getEnvironment() {
    return {
      cwd: this.cwd,
      env: this.env,
      stdout: this.stdout,
      stderr: this.stderr,
    };
  }

  async run() {
    const environment = this.getEnvironment();
    const { runConfiguration } = await loadConfiguration(
      { file: this.configFile },
      environment
    );
    const { success } = await runCucumber(runConfiguration, environment);
    return { success };
  }
}

async function main() {
  const runner = new Runner();
  const { success } = await runner.run();
  process.exit(success ? 0 : 1);
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { Runner, main };
