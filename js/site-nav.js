'use strict';

/* global document */

var $ = require('jquery');
var _ = require('underscore');
var helpers = require('./helpers');
var moment = require('moment');

window.$ = window.jQuery = $;

require('./vendor/jquery-accessibleMegaMenu');

var TEMPLATES = {
  data: require('./templates/nav-data.hbs')
};

/** SiteNav module
 * On mobile: Controls the visibility of the the hamburger menu and sublists
 * On desktop: Controls the visibility of dropdown sublists on hover and focus
 * @constructor
 * @param {object} selector - CSS selector for the nav component
 * @param {object} opts - Options, including base URLs
 */

var today = new Date();

var defaultOpts = {
  cmsUrl: 'http://localhost:8000',
  webAppUrl: 'http://localhost:3000',
  cycle: 2016,
  today: moment(today).format('MM-DD-YYYY')
};

function SiteNav(selector, opts) {
  this.opts = _.extend({}, defaultOpts, opts);
  this.$body = $(selector);
  this.$list = this.$body.find('#site-menu');
  this.$toggle = this.$body.find('.js-nav-toggle');

  this.assignAria();

  this.initMegaMenu();

  // Open and close the menu on mobile
  this.$toggle.on('click', this.toggle.bind(this));
}

SiteNav.prototype.initMegaMenu = function() {
  var self = this;
  if ( $('body').width() > helpers.BREAKPOINTS.LARGE) {
    this.$body.find('[data-submenu]').each(function(){
      var id = $(this).data('submenu');
      var submenu = TEMPLATES[id](self.opts);
      $(this).append(submenu);
    });

    this.$body.accessibleMegaMenu({
      uuidPrefix: 'mega-menu',
      menuClass: 'site-nav__list',
      topNavItemClass: 'site-nav__item',
      panelClass: 'mega',
      panelGroupClass: 'mega__group',
      hoverClass: 'is-hover',
      focusClass: 'is-focus',
      openClass: 'is-open'
    });
  }
};

SiteNav.prototype.assignAria = function() {
  this.$list.attr('aria-label', 'Site-wide navigation');
  if ( $('body').width() < helpers.BREAKPOINTS.LARGE) {
    this.$toggle.attr('aria-haspopup', true);
    this.$list.attr('aria-hidden', true);
  }
};

SiteNav.prototype.toggle = function() {
  var method = this.isOpen ? this.hide : this.show;
  method.apply(this);
};

SiteNav.prototype.show = function() {
  this.$body.addClass('is-open');
  this.$toggle.addClass('active');
  this.$list.attr('aria-hidden', false);
  this.isOpen = true;
};

SiteNav.prototype.hide = function() {
  this.$body.removeClass('is-open');
  this.$toggle.removeClass('active');
  this.$list.attr('aria-hidden', true);
  this.isOpen = false;
};

module.exports = {SiteNav: SiteNav};
