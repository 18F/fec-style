'use strict';

/* global require */

var $ = require('jquery');
var accordion = require('../../js/accordion.js');
var glossary = require('../../js/glossary.js');
var dropdown = require('../../js/dropdowns.js');

var SLT_ACCORDION = '.js-accordion';

$(SLT_ACCORDION).each(function() {
  Object.create(accordion).init($(this));
});

$('.js-dropdown').each(function() {
  new dropdown.Dropdown(this);
})