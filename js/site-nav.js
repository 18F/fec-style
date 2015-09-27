'use strict';

/* global require, module, document */

var $ = require('jquery');

function SiteNav(selector) {
  this.$body = $(selector);
  this.$toggle = this.$body.find('.js-nav-toggle');

  this.assignAria();

  this.$toggle.on('click', this.toggle.bind(this));
  this.$body.on('change', '.js-toggle', this.handleChange.bind(this));
  this.$body.on('mouseenter', 'li:has(.js-toggle)', this.handleMouseEnter.bind(this));
  this.$body.on('mouseleave', 'li:has(.js-toggle)', this.handleMouseExit.bind(this));
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

SiteNav.prototype.handleChange = function(e) {
  var $subToggle = $(e.currentTarget);
  var checked = $subToggle.is(':checked');
  var $list = $(e.currentTarget).siblings('ul');

  $list.attr('aria-hidden', !checked);
  $list.find('li a').first().focus();
};

SiteNav.prototype.handleMouseEnter = function(e) {
  $(e.currentTarget).find('.js-toggle').prop('checked', true).change();
};

SiteNav.prototype.handleMouseExit = function(e) {
  $(e.currentTarget).find('.js-toggle').prop('checked', false).change();
};

module.exports = {SiteNav: SiteNav};
