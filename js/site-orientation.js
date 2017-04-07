'use strict';

var $ = require('jquery');
var countdown = require('countdown');
var introJs = require('intro.js');
var URI = require('urijs');

var helpers = require('./helpers');

function SiteOrientation(selector) {
  var query = helpers.sanitizeQueryParams(URI.parseQuery(window.location.search));

  this.$selector = $(selector);

  this.$banner = this.$selector.find('.banner');
  this.$tourHeader = this.$selector.find('.tour-header');

  this.$startTourLink = this.$selector.find('.start-tour');
  this.$startTourLink.on('click', this.startTour.bind(this));

  if (query.tour) {
    this.startTour();
  }
  else {
    this.initBanner();
  }
}

SiteOrientation.prototype.initBanner = function () {
  this.$banner.show();

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
  // if the user clicks "start a tour" on a page without tooltips
  // then it will take them to the homepage and start the tour
  if (typeof TOUR_PAGE == 'undefined') {
    window.location.href = CMS_URL + '/?tour=true';
    return;
  }

  // make sure tour window starts on top
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  this.$banner.hide();
  this.$tourHeader.show();

  // highlight current tour page on header and turn off link
  this.$tourHeader.find('.tour-' + TOUR_PAGE).addClass('is-active').find('a').click(function (e) {
    e.preventDefault();
  });

  // set top padding for fixed tour header
  $('body').css('padding-top', this.$tourHeader.outerHeight());

  this.$exitTourButton = this.$selector.find('.exit-tour');
  this.$exitTourButton.on('click', this.exitTour.bind(this));

  // display tour dots relative to their nearest element
  $('.tour-dot').css('display', 'inline-block').parent().css('position', 'relative');
  $('.tour-dot--middle').css('display', 'block');

  var tour = introJs.introJs();

  tour.setOptions({
    showStepNumbers: false,
    tooltipClass: 'tour-tooltip',
    tooltipPosition: 'bottom-middle-aligned',
    prevLabel: '<i class="icon icon--small i-arrow-left"></i> Back',
    nextLabel: 'Next <i class="icon icon--small i-arrow-right"></i>',
    doneLabel: 'Next section <i class="icon icon--small i-arrow-right"></i>',
    overlayOpacity: 0
  });

  // native intro.js behavior scrolls longer tooltips offscreen
  // so this scrolls to tooltip with some padding
  tour.onchange(function (target) {
    $(window).scrollTop($(target).offset().top - 200);
  });

  // grab the link to the next tour page
  var nextLink = this.$selector.find('.is-active').next().find('a').attr('href');
  // clicking "next section" on last tooltip will send them to next tour page
  tour.onexit(function () {
    window.location.href = nextLink;
  });

  // begin intro.js functionality
  tour.start();

  // removes native intro.js curtain to not close tooltip
  $('.introjs-overlay').remove();
};

SiteOrientation.prototype.exitTour = function () {
  this.$tourHeader.hide();
  this.initBanner();

  // removes top padding for fixed tour header
  $('body').removeAttr('style');

  this.$selector.find('.toggle, .less').hide();
  this.$selector.find('.more').show();

  $('.tour-dot').hide();
  $('.introjs-helperLayer , .introjs-tooltipReferenceLayer').remove();
};

module.exports = {
  SiteOrientation: SiteOrientation
};
