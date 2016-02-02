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
  toggle: '#filter-toggle'
};

function FilterPanel(options) {
  this.isOpen = false;
  this.options = _.extend({}, defaultOptions, options);

  this.$body = $(this.options.body);
  this.$dataContainer = $(this.options.dataContainer);
  this.$form = $(this.options.form);
  this.$focus = $(this.options.focus);
  this.$toggle = $(this.options.toggle);

  this.$toggle.on('click', this.toggle.bind(this));

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
    this.$body.height(this.$dataContainer.height());
  }
};

FilterPanel.prototype.show = function() {
  this.$body.addClass('is-open');
  this.$toggle.addClass('is-active');
  this.$toggle.find('.js-filter-toggle-text').html('Hide filters');
  accessibility.restoreTabindex(this.$form);
  $('body').addClass('is-showing-filters');
  this.isOpen = true;
};

FilterPanel.prototype.hide = function() {
  this.$body.removeClass('is-open');
  this.$toggle.removeClass('is-active');
  this.$toggle.find('.js-filter-toggle-text').html('Show filters');
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
