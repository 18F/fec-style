'use strict';

/* global require, window, document */

var $ = require('jquery');

// Hack: Append jQuery to `window` for use by legacy libraries
window.$ = window.jQuery = $;

var accordion = require('../../js/accordion');
var glossary = require('../../js/glossary');
var dropdown = require('../../js/dropdowns');
var typeahead = require('../../js/typeahead');

var SLT_ACCORDION = '.js-accordion';

$(SLT_ACCORDION).each(function() {
  Object.create(accordion).init($(this));
});

$('.js-dropdown').each(function() {
  new dropdown.Dropdown(this);
});

new typeahead.Typeahead('.js-search-input', $('.js-search-type').val());