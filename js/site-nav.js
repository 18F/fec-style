'use strict';

/* global */

var $ = require('jquery');
var _ = require('underscore');
var helpers = require('./helpers');
var moment = require('moment');
var typeahead = require('./typeahead');

window.$ = window.jQuery = $;

require('accessible-mega-menu');

var TEMPLATES = {
  data: require('./templates/nav-data.hbs'),
  mobile: require('./templates/mobile-nav.hbs')
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
  today: moment(today).format('MM-DD-YYYY'),
  tomorrow: moment(today).add(1, 'day').format('MM-DD-YYYY')
};

function SiteNav(selector, opts) {
  this.opts = _.extend({}, defaultOpts, opts);
  this.$body = $('body');
  this.$element = $(selector);
  this.$menu = this.$element.find('#site-menu');
  this.$toggle = this.$element.find('.js-nav-toggle');

  this.assignAria();

  this.initMenu();

  $(window).on('resize', this.switchMenu.bind(this));
  // Open and close the menu on mobile
  this.$element.on('click', '.js-panel-trigger', this.showPanel.bind(this));
  this.$element.on('click', '.js-panel-close', this.hidePanel.bind(this));
  this.$toggle.on('click', this.toggleMenu.bind(this));
}

SiteNav.prototype.initMenu = function() {
  if (helpers.getWindowWidth() >= helpers.BREAKPOINTS.LARGE) {
    this.initMegaMenu();
  } else {
    this.initMobileMenu();
  }

  new typeahead.Typeahead('.js-menu-search', 'candidates', '/data/');
};

SiteNav.prototype.initMegaMenu = function() {
  var self = this;
  this.$element.find('[data-submenu]').each(function(){
    var id = $(this).data('submenu');
    var submenu = TEMPLATES[id](self.opts);
    $(this).append(submenu);
  });

  this.$menu.accessibleMegaMenu({
    uuidPrefix: 'mega-menu',
    menuClass: 'site-nav__panel--main',
    topNavItemClass: 'site-nav__item',
    panelClass: 'mega',
    panelGroupClass: 'mega__group',
    hoverClass: 'is-hover',
    focusClass: 'is-focus',
    openClass: 'is-open',
    openDelay: 500,
    selectors: {
      topNavItems: '[data-submenu]'
    }
  });
};

SiteNav.prototype.initMobileMenu = function() {
  if (!this.isMobile) {
    this.$menu.append(TEMPLATES.mobile(this.opts));
    this.isMobile = true;
  }
};

SiteNav.prototype.switchMenu = function() {
  if (helpers.getWindowWidth() < helpers.BREAKPOINTS.LARGE ) {
    this.$element.find('.mega__inner').remove();
    this.initMobileMenu();
  } else if (this.isMobile) {
    // Note: we don't re-init the mega menu because there's no way to actually destroy it currently
    this.$element.find('.js-mobile-nav').remove();
    this.isMobile = false;
  }
};

SiteNav.prototype.assignAria = function() {
  this.$menu.attr('aria-label', 'Site-wide navigation');
  if (helpers.getWindowWidth() < helpers.BREAKPOINTS.LARGE) {
    this.$toggle.attr('aria-haspopup', true);
    this.$menu.attr('aria-hidden', true);
  }
};

SiteNav.prototype.toggleMenu = function() {
  var method = this.isOpen ? this.hideMenu : this.showMenu;
  method.apply(this);
};

SiteNav.prototype.showMenu = function() {
  this.$body.css({'overflow': 'hidden'});
  this.$element.addClass('is-open');
  this.$toggle.addClass('active');
  this.$menu.attr('aria-hidden', false);
  this.isOpen = true;
};

SiteNav.prototype.hideMenu = function() {
  this.$body.css({'overflow': 'auto'});
  this.$element.removeClass('is-open');
  this.$toggle.removeClass('active');
  this.$menu.attr('aria-hidden', true);
  this.isOpen = false;
  if (this.isMobile) {
    this.$element.find('[aria-hidden=false]').attr('aria-hidden', true);
  }
};

SiteNav.prototype.showPanel = function(e) {
  var $target = $(e.target);
  var $panel = $('#' + $target.attr('aria-controls'));
  $panel.addClass('is-open').attr('aria-hidden', false);
};

SiteNav.prototype.hidePanel = function(e) {
  var $target = $(e.target);
  var $panel = $('#' + $target.attr('aria-controls'));
  $panel.removeClass('is-open').attr('aria-hidden', true);
};

module.exports = {SiteNav: SiteNav};
