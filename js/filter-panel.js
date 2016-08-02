'use strict';

var $ = require('jquery');
var _ = require('underscore');

var FilterSet = require('./filter-set').FilterSet;
var accessibility = require('./accessibility');
var helpers = require('./helpers');

var defaultOptions = {
  body: '.filters',
  content: '.filters__content',
  dataContainer: '.data-container',
  form: '#category-filters',
  focus: '.js-filter-toggle',
  toggle: '.js-filter-toggle',
};

function FilterPanel(options) {
  this.isOpen = false;
  this.options = _.extend({}, defaultOptions, options);

  this.$body = $(this.options.body);
  this.$content = this.$body.find(this.options.content);
  this.$dataContainer = $(this.options.dataContainer);
  this.$form = $(this.options.form);
  this.$focus = $(this.options.focus);
  this.$toggle = $(this.options.toggle);

  this.$toggle.on('click', this.toggle.bind(this));

  this.filterSet = new FilterSet(this.$form).activate();

  this.setInitialDisplay();
}

FilterPanel.prototype.setInitialDisplay = function() {
  if (helpers.getWindowWidth() >= helpers.BREAKPOINTS.LARGE) {
    this.show();
  } else if (!this.isOpen) {
    this.hide();
  }
};

FilterPanel.prototype.show = function(focus) {
  this.$body.addClass('is-open');
  this.$content.attr('aria-hidden', false);
  accessibility.restoreTabindex(this.$form);
  $('body').addClass('is-showing-filters');
  this.isOpen = true;
  // Don't focus on the first filter unless explicitly intended to
  // Prevents the first filter from being focused on initial page load
  if (focus) {
    this.$body.find('input, select, button:not(.js-filter-close)').first().focus();
  }
};

FilterPanel.prototype.hide = function() {
  this.$body.removeClass('is-open');
  this.$content.attr('aria-hidden', true);
  this.$focus.focus();
  accessibility.removeTabindex(this.$form);
  $('body').removeClass('is-showing-filters');
  this.isOpen = false;
};

FilterPanel.prototype.toggle = function() {
  if (this.isOpen) {
    this.hide();
  } else {
    this.show(true);
  }
};

module.exports = {FilterPanel: FilterPanel};
