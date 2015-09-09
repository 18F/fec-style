'use strict';

/* global require, module, document */

function SiteNav(selector) {
  this.$body = $(selector);
}

SiteNav.prototype.assignAria = function() {

}

module.exports = {SiteNav: SiteNav};
