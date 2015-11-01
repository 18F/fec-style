var istanbul = require('browserify-istanbul');

module.exports = function(config) {
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

    browserify: {
      debug: true,
      transform: [
        'stringify',
        istanbul({
          ignore: [
            'tests/unit/**',
            '**/templates/**'
          ]
        })
      ]
    },

    coverageReporter: {
      subdir: '.',
      reporters: [
        {type: 'html'},
        {type: 'text'},
        {type: 'json', file: 'coverage.json'}
      ]
    },

    reporters: ['progress', 'coverage'],
    browsers: ['Chrome'],
    port: 9876
  });
};
