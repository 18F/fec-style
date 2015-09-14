'use strict';

/* global require, module, document */

function SiteNav(selector) {
  this.$body = $(selector);
  this.assignAria();

  this.$body.on('change', '.js-toggle', this.handleChange.bind(this));
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
}

SiteNav.prototype.handleChange = function(ev) {
  var $toggle = $(ev.currentTarget);
  var checked = $toggle.is(":checked");
  var $list = $(ev.currentTarget).siblings('ul');

  $list.attr('aria-hidden', !checked);
  $list.find('li a').first().focus();
}

module.exports = {SiteNav: SiteNav};
