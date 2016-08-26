'use strict';

/* global require, window, document */

var $ = require('jquery');

// Hack: Append jQuery to `window` for use by legacy libraries
window.$ = window.jQuery = $;

var dropdown = require('../../js/dropdowns');
var siteNav = require('../../js/site-nav');
var typeahead = require('../../js/typeahead');
var typeaheadFilter = require('../../js/typeahead-filter');
var feedback = require('../../js/feedback');
var accordion = require('../../node_modules/aria-accordion');

$('.js-dropdown').each(function() {
  new dropdown.Dropdown(this);
});

$('.js-site-nav').each(function() {
  new siteNav.SiteNav(this);
});

new feedback.Feedback();

new typeahead.Typeahead('.js-search-input', $('.js-search-type').val());

new typeaheadFilter.TypeaheadFilter('[data-filter="typeahead"]', typeahead.datasets.committees);

$('.js-accordion').each(function(){
  var contentPrefix = $(this).data('content-prefix') || 'accordion';
  var openFirst = $(this).data('open-first') || false;
  var opts = {
    contentPrefix: contentPrefix,
    openFirst: openFirst
  };
  new accordion.Accordion({}, opts);
});

// Styleguide specific stuff

function MarkupPanel($wrapper) {
  this.$wrapper = $wrapper;
  this.$button = $wrapper.find('.js-toggle-markup');
  this.$markup = this.$wrapper.next('.kss-markup');
  this.markupVisible = false;
  this.$button.on('click', this.toggleMarkup.bind(this));
}

MarkupPanel.prototype.toggleMarkup = function() {
  if (this.markupVisible) {
    this.$markup.hide().attr('aria-hidden', 'true');
    this.markupVisible = false;
    this.$button.text('Show markup');
  } else {
    this.$markup.show().attr('aria-hidden', 'false');
    this.markupVisible = true;
    this.$button.text('Hide markup');
  }
};

$('.kss-modifier__wrapper').each(function(){
  new MarkupPanel($(this));
});
