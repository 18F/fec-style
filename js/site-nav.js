'use strict';

/* global require, module, document */

var $ = require('jquery');

function SiteNav(selector) {
  this.$body = $(selector);
  this.$toggle = this.$body.find('.js-nav-toggle');
  this.$openSublist = null;

  this.assignAria();

  this.$toggle.on('click', this.toggle.bind(this));
  this.$body.on('click', '.js-sublist-toggle', this.toggleSublist.bind(this));
  this.$body.on('mouseenter', '.js-sublist-parent', this.toggleSublist.bind(this));
  this.$body.on('mouseleave', '.js-sublist-parent', this.toggleSublist.bind(this));
  $(document.body).on('focusin', this.handleFocus.bind(this));
}

SiteNav.prototype.assignAria = function() {
  var $subLists = this.$body.find('ul ul');
  var $links = this.$body.find('.js-nav-drop-link');

  this.$body.attr('aria-label', 'Site wide navigation');

  $subLists.attr({
    'aria-label': 'submenu',
    'aria-hidden': 'true'
  });

  $links.attr('aria-haspopup', true);
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
  var $target = $(e.target);
  var $sublistParent = $target.hasClass('js-sublist-parent') ? $target : $target.closest('.js-sublist-parent');
  method.call(this, $sublistParent);
};

SiteNav.prototype.showSublist = function($sublistParent) {
  $sublistParent.addClass('is-open');
  $sublistParent.find('ul').attr('aria-hidden', false);
  this.$openSublist = $sublistParent;
};

SiteNav.prototype.hideSublist = function($sublistParent) {
  $sublistParent.removeClass('is-open');
  $sublistParent.find('ul').attr('aria-hidden', true);
  this.$openSublist = null;
};

SiteNav.prototype.handleFocus = function(e) {
  var $target = $(e.target);
  var $sublistParent = $target.closest('.js-sublist-parent') || false;
  if ( this.$openSublist && !this.$openSublist.has($target).length ) {
    this.hideSublist(this.$openSublist);
  } else if ( $sublistParent ) {
    this.showSublist($sublistParent);
  }
};

module.exports = {SiteNav: SiteNav};
