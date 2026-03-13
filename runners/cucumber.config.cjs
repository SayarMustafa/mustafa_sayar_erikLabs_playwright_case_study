const path = require('path');

const root = path.join(__dirname, '..');

module.exports = {
  default: {
    paths: [path.join(root, 'features', '**', '*.feature')],
    require: [
      'step_definitions/world.js',
      'step_definitions/hooks.js',
      'step_definitions/placeholder.steps.js',
    ],
  },
};
