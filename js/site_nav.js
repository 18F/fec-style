'use strict';

/* global require, module, document */

function SiteNav(selector) {
  this.$body = $(selector);
  this.$dropdowns = this.$body.find('ul ul');
  this.$toggles = this.$body.find('.js-toggle');
  this.assignAria();
  this.$toggles.change(this.onChange);
}

SiteNav.prototype.assignAria = function() {
  var $subLists = this.$body.find('ul ul'),
      $links = this.$body.find('.js-nav-drop-link');

  this.$body.attr('aria-label', 'Site wide navigation');

  $subLists.each(function() {
    $(this).attr('aria-label', 'submenu');
    $(this).attr('aria-hidden', true);
  });

  $links.attr('aria-haspopup', true);
}

SiteNav.prototype.onChange = function(ev) {
  var $toggle = $(ev.currentTarget),
      checked = $toggle.is(":checked"),
      $list = $(ev.currentTarget).siblings('ul');

  $list.attr('aria-hidden', !checked);
}

module.exports = {SiteNav: SiteNav};
