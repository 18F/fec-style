'use strict';

var $ = require('jquery');

function SiteOrientation(selector) {
  this.$selector = $(selector);

  this.$toggle = this.$selector.find('.toggle-text');

  this.$toggle.on('click', this.handleToggle.bind(this));
}

SiteOrientation.prototype.handleToggle = function() {
  this.$selector.find('.toggle, .less, .more').toggle();
};

module.exports = {
  SiteOrientation: SiteOrientation
};
