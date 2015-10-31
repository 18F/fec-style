var istanbul = require('browserify-istanbul');

module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha', 'chai-sinon'],

    files: [
      'tests/**/*.js'
    ],

    preprocessors: {
      'js/**/*.js': ['browserify'],
      'tests/**/*.js': ['browserify']
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
