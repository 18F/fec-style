/* global process */

var istanbul = require('browserify-istanbul');

module.exports = function(config) {
  var browserify = {
    debug: true,
    transform: [
      ['hbsfy', {extensions: 'hbs'}],
    ]
  };

  var reporters = ['progress'];

  if (process.argv.indexOf('--debug') === -1) {
    browserify.transform.push(
      istanbul({
        ignore: [
          'tests/unit/**/*',
          '**/templates/**'
        ]
      })
    );
    reporters.push('coverage');
  }

  config.set({
    frameworks: ['browserify', 'phantomjs-shim', 'mocha', 'chai-sinon'],

    files: [
      'tests/**/*.js',
      'js/**/*.js'
    ],

    preprocessors: {
      'tests/**/*.js': ['browserify'],
      'js/**/*.js': ['browserify']
    },

    browserify: browserify,

    coverageReporter: {
      subdir: '.',
      reporters: [
        {type: 'html'},
        {type: 'text'},
        {type: 'json', file: 'coverage.json'}
      ]
    },

    reporters: reporters,
    browsers: ['Chrome'],
    port: 9876
  });
};
