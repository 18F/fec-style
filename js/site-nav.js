'use strict';

/* global require, module, document */

var $ = require('jquery');

function SiteNav(selector) {
  this.$body = $(selector);
  this.$toggle = this.$body.find('.js-nav-toggle');

  this.assignAria();

  this.$toggle.on('click', this.toggle.bind(this));
  this.$body.on('click', '.js-sublist-toggle', this.toggleSublist.bind(this));
  this.$body.on('mouseenter', '.js-sublist', this.toggleSublist.bind(this));
  this.$body.on('mouseleave', '.js-sublist', this.toggleSublist.bind(this));
  this.$body.on('focusin', this.handleFocus.bind(this));
  $(document.body).on('focusin', this.handleFocusAway.bind(this));
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
  var method = this.$openList ? this.hideSublist : this.showSublist;
  var $target = $(e.target);
  var $sublistParent = $target.hasClass('js-sublist') ? $target : $target.closest('.js-sublist');
  method.call(this, $sublistParent);
};

SiteNav.prototype.showSublist = function($sublistParent) {
  $sublistParent.addClass('is-open');
  $sublistParent.find('ul').attr('aria-hidden', false);
  this.$openList = $sublistParent;
};

SiteNav.prototype.hideSublist = function($sublistParent) {
  $sublistParent.removeClass('is-open');
  $sublistParent.find('ul').attr('aria-hidden', true);
  this.$openList = null;
};

SiteNav.prototype.handleFocus = function(e) {
  var $target = $(e.target);
  var $sublistParent = $target.closest('.js-sublist') || false;
  if ( this.$openList && !this.$openList.has($target).length ) {
    this.hideSublist(this.$openList);
  } else if ( $sublistParent ) {
    this.showSublist($sublistParent);
  }
};

SiteNav.prototype.handleFocusAway = function(e) {
  var $target = $(e.target);
  if ( this.$openList && !this.$body.has($target).length ) {
    this.hideSublist(this.$openList);
  }
};

module.exports = {SiteNav: SiteNav};
