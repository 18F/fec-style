'use strict';

/* global require, module, document */

function SiteNav(selector) {
  this.$body = $(selector);
  this.assignAria();
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

module.exports = {SiteNav: SiteNav};
