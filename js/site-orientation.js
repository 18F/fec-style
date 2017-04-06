'use strict';

var $ = require('jquery');
var countdown = require('countdown');
var introJs = require('intro.js');

function SiteOrientation(selector) {
  this.$selector = $(selector);

  this.$banner = this.$selector.find('.banner');
  this.$tourHeader = this.$selector.find('.tour-header');

  this.$startTourLink = this.$selector.find('.start-tour');
  this.$startTourLink.on('click', this.startTour.bind(this));

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
  this.$toggleLink = this.$selector.find('.toggle-text');
  this.$toggleLink.on('click', this.handleToggle.bind(this));
};

SiteOrientation.prototype.handleToggle = function () {
  this.$selector.find('.toggle, .less, .more').toggle();
};

SiteOrientation.prototype.startTour = function () {
  this.$banner.hide();
  this.$tourHeader.show();

  $('body').css('padding-top', '6rem');

  this.$exitTourButton = this.$selector.find('.exit-tour');
  this.$exitTourButton.on('click', this.exitTour.bind(this));

  var tour = introJs.introJs();

  tour.setOptions({
    tooltipClass: 'tour-tooltip',
    tooltipPosition: 'bottom-middle-aligned',
    nextLabel: 'Next <i class="icon icon--small i-arrow-right"></i>',
    showStepNumbers: false,
    overlayOpacity: 0
  });

  tour.start();

  $('.tour-dot').css('display', 'inline-block');
  $('.tour-dot--middle').show();
  $('.introjs-overlay').remove();
};

SiteOrientation.prototype.exitTour = function () {
  this.$tourHeader.hide();
  this.$banner.show();

  $('body').removeAttr('style');

  this.$selector.find('.toggle, .less').hide();
  this.$selector.find('.more').show();

  $('.tour-dot').hide();
  $('.introjs-helperLayer , .introjs-tooltipReferenceLayer').remove();
};

module.exports = {
  SiteOrientation: SiteOrientation
};
