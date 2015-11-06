'use strict';

/* global document */

var $ = require('jquery');

/** SiteNav module
 * On mobile: Controls the visibility of the the hamburger menu and sublists
 * On desktop: Controls the visibility of dropdown sublists on hover and focus
 * @constructor
 * @param {object} selector - CSS selector for the nav component
 */

function SiteNav(selector) {
  this.$body = $(selector);
  this.$toggle = this.$body.find('.js-nav-toggle');
  this.$openSublist = null;

  this.assignAria();

  // Open and close the menu on mobile
  this.$toggle.on('click', this.toggle.bind(this));

  // Mobile: open sublists with the toggle buttons
  this.$body.on('click', '.js-sublist-toggle', this.toggleSublist.bind(this));

  // Desktop: open and close sublists on hover and focus
  this.$body.on('mouseenter', '.js-sublist-parent', this.showSublist.bind(this));
  this.$body.on('mouseleave', '.js-sublist-parent', this.hideSublist.bind(this));
  $(document.body).on('focusin', this.handleFocusBody.bind(this));
}

SiteNav.prototype.assignAria = function() {
  this.$body.find('.js-sublist-toggle').attr('aria-haspopup', true);
  this.$body.attr('aria-label', 'Site wide navigation');
  this.$body.find('ul ul').attr({
    'aria-label': 'submenu',
    'aria-hidden': 'true'
  });
};

SiteNav.prototype.toggle = function() {
  var method = this.isOpen ? this.hide : this.show;
  method.apply(this);
};

SiteNav.prototype.show = function() {
  this.$body.addClass('is-open');
  this.$toggle.addClass('active');
  this.isOpen = true;
};

SiteNav.prototype.hide = function() {
  this.$body.removeClass('is-open');
  this.$toggle.removeClass('active');
  this.isOpen = false;
};

SiteNav.prototype.toggleSublist = function(e) {
  var method = this.$openSublist ? this.hideSublist : this.showSublist;
  method.call(this, e);
};

SiteNav.prototype.showSublist = function(e, $selector) {
  var $sublistParent = $selector || $(e.target).closest('.js-sublist-parent');
  $sublistParent.addClass('is-open');
  $sublistParent.find('ul').attr('aria-hidden', false);
  this.$openSublist = $sublistParent;
};

SiteNav.prototype.hideSublist = function(e, $selector) {
  var $sublistParent = $selector || $(e.target).closest('.js-sublist-parent');
  $sublistParent.removeClass('is-open');
  $sublistParent.find('ul').attr('aria-hidden', true);
  this.$openSublist = null;
};

SiteNav.prototype.handleFocusBody = function(e) {
  var $target = $(e.target);
  var $sublistParent = $target.closest('.js-sublist-parent');
  if (this.$openSublist && !this.$openSublist.has($target).length) {
    this.hideSublist(e, this.$openSublist);
  } else if ($sublistParent) {
    this.showSublist(e);
  }
};

module.exports = {SiteNav: SiteNav};
