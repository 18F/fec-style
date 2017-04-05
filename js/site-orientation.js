'use strict';

var $ = require('jquery');
var countdown = require('countdown');

function SiteOrientation(selector) {
  this.$selector = $(selector);

  this.initBanner();
}

SiteOrientation.prototype.initBanner = function () {
  // fill in _ DAYS until this site...
  this.$days = this.$selector.find('.days');
  var countdownDate = new Date(this.$days.data('date'));
  this.$days.html(countdown(countdownDate, null, countdown.DAYS).days);

  // anonymous feedback tool click
  this.$selector.on('click', '.js-feedback', function () {
    $(document.body).trigger('feedback:open');
  });

  // show more/less banner text
  this.$toggle = this.$selector.find('.toggle-text');
  this.$toggle.on('click', this.handleToggle.bind(this));
};

SiteOrientation.prototype.handleToggle = function () {
  this.$selector.find('.toggle, .less, .more').toggle();
};

module.exports = {
  SiteOrientation: SiteOrientation
};
