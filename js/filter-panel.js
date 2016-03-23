'use strict';

var $ = require('jquery');
var _ = require('underscore');

var FilterSet = require('./filter-set').FilterSet;
var accessibility = require('./accessibility');
var helpers = require('./helpers');

var defaultOptions = {
  body: '.filters',
  dataContainer: '.data-container',
  form: '#category-filters',
  focus: '#results tr:first-child',
  toggle: '.js-filter-toggle',
  close: '.js-filter-close'
};

function FilterPanel(options) {
  this.isOpen = false;
  this.options = _.extend({}, defaultOptions, options);

  this.$body = $(this.options.body);
  this.$dataContainer = $(this.options.dataContainer);
  this.$form = $(this.options.form);
  this.$focus = $(this.options.focus);
  this.$toggle = $(this.options.toggle);
  this.$close = $(this.options.close);

  this.$toggle.on('click', this.toggle.bind(this));
  this.$close.on('click', this.hide.bind(this));

  this.filterSet = new FilterSet(this.$form).activate();

  this.setInitialDisplay();
}

FilterPanel.prototype.setInitialDisplay = function() {
  if ($(document).width() > helpers.BREAKPOINTS.LARGE) {
    this.show();
  } else if (!this.isOpen) {
    this.hide();
  }
};

FilterPanel.prototype.setHeight = function() {
  if ($(document).width() > helpers.BREAKPOINTS.LARGE &&
      this.$dataContainer.height() > this.$body.height()) {
    this.$body.css('min-height', this.$dataContainer.height());
  }
};

FilterPanel.prototype.show = function() {
  this.$body.addClass('is-open');
  this.$toggle.attr('aria-hidden', true);
  accessibility.restoreTabindex(this.$form);
  $('body').addClass('is-showing-filters');
  this.isOpen = true;
};

FilterPanel.prototype.hide = function() {
  this.$body.removeClass('is-open');
  this.$toggle.attr('aria-hidden', false);
  this.$focus.focus();
  accessibility.removeTabindex(this.$form);
  $('body').removeClass('is-showing-filters');
  this.isOpen = false;
};

FilterPanel.prototype.toggle = function() {
  if (this.isOpen) {
    this.hide();
  } else {
    this.show();
  }
};

module.exports = {FilterPanel: FilterPanel};
