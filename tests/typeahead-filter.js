'use strict';

/* global require, window, document, describe, before, beforeEach, after, afterEach, it */

var $ = require('jquery');
var _ = require('underscore');

window.$ = window.jQuery = $;
_.extend(window, {
  API_LOCATION: '',
  API_VERSION: '/v1',
});

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var typeahead = require('../js/typeahead');

var TypeaheadFilter = require('../js/typeahead-filter').TypeaheadFilter;

describe('typeaheadFilter', function() {
  before(function() {
    this.$fixture = $('<div id="fixtures"></div>');
    $('body').append(this.$fixture);
  });

  beforeEach(function() {
    this.$fixture.empty().append(
      '<div class="filter js-typeahead-filter"  data-dataset="committees">' +
        '<ul class="dropdown__selected"></ul>' +
        '<input type="text" class="search-input--mini" name="commite_id">' +
      '</div>'
    );

    this.typeaheadFilter = new TypeaheadFilter('.js-typeahead-filter', typeahead.datasets.committees);
  });

  it('should initialize', function() {
    var typeahead = this.typeaheadFilter.$body.find('.twitter-typeahead');
    expect(typeahead.length).to.equal(1);
  });

});
