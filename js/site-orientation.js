'use strict';

var $ = require('jquery');
var introJs = require('intro.js');
var URI = require('urijs');

var helpers = require('./helpers');

var uri = window.location.toString();
var uriQuery = helpers.sanitizeQueryParams(URI.parseQuery(window.location.search));

function SiteOrientation(selector) {
  this.$selector = $(selector);

  this.isMobile = $('.js-nav-toggle').is(':visible');

  this.$banner = this.$selector.find('.banner');
  this.$bannerToggleSection = this.$banner.find('.toggle');
  this.$bannerToggleLink = this.$banner.find('.toggle-text');
  this.$bannerMoreText = this.$bannerToggleLink.find('.more');
  this.$bannerLessText = this.$bannerToggleLink.find('.less');

  this.$tourHeader = this.$selector.find('.tour__header');

  this.$startTourLink = this.$selector.find('.start-tour');
  this.$startTourLink.on('click', this.startTour.bind(this));

  if (uriQuery.tour) {
    this.startTour();
  }
  else {
    this.initBanner();
  }
}

SiteOrientation.prototype.initBanner = function () {
  this.$banner.show();

  // anonymous feedback tool click
  this.$selector.on('click', '.js-feedback', function () {
    $(document.body).trigger('feedback:open');
  });

  if (localStorage.getItem('FEC_BANNER_COLLAPSED') === 'true') {
    this.collapseBanner();
  }

  // unbind to prevent multiple click actions
  this.$bannerToggleLink.unbind().on('click', this.handleToggle.bind(this));
};

SiteOrientation.prototype.handleToggle = function () {
  this.$bannerToggleSection.toggle();
  this.$bannerLessText.toggle();
  this.$bannerMoreText.toggle();

  this.setBannerState();
};

SiteOrientation.prototype.collapseBanner = function () {
  this.$bannerToggleSection.hide();
  this.$bannerLessText.hide();
  this.$bannerMoreText.show();
};

SiteOrientation.prototype.setBannerState = function () {
  if (this.$selector.find('.more').is(':visible')) {
    localStorage.setItem('FEC_BANNER_COLLAPSED', 'true');
  }
  else {
    localStorage.setItem('FEC_BANNER_COLLAPSED', 'false');
  }
};

SiteOrientation.prototype.tourPageCheck = function () {
  // make sure tour window starts on top
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  // if the user clicks "start a tour" on a page without tooltips
  // then it will take them to the homepage and start the tour
  if (typeof TOUR_PAGE == 'undefined') {
    window.location.href = CMS_URL + '/?tour=true';
    return;
  }
};

SiteOrientation.prototype.setupTourHeader = function () {
  var currentPage = this.$tourHeader.find('.tour-' + TOUR_PAGE);
  this.lastTourPage = 'legal-resources';

  this.$banner.hide();

  // set top padding for fixed tour header
  $('body').css('padding-top', this.$tourHeader.outerHeight());

  this.$tourHeader.show();

  // highlight current tour page on header and turn off link
  currentPage.addClass('is-active').find('a').click(function (e) {
    e.preventDefault();
  });

  this.nextSectionLink = currentPage.next().find('a').attr('href');

  this.$exitTourButton = this.$selector.find('.exit-tour');
  this.$exitTourButton.on('click', this.exitTour.bind(this));
};

SiteOrientation.prototype.setupTourPoints = function () {
  if (this.isMobile) {
    // remove desktop only tour points
    $('.masthead .tour__point, .js-sticky-side .tour__point').remove();
  }

  // display tour dots relative to their nearest element
  $('.tour__point').css('display', 'inline-block').parent().css('position', 'relative');
  $('.tour__point--middle').css('display', 'block');
};

SiteOrientation.prototype.startTour = function () {
  var self = this;
  var tour = introJs.introJs();
  var tourLastLabel = 'Next section <i class="icon icon--small i-arrow-right"></i>';

  this.tourPageCheck();
  this.setupTourHeader();
  this.setupTourPoints();

  if (TOUR_PAGE === this.lastTourPage) {
    // Last tooltip (tour.onexit) opens modal
    tourLastLabel = 'Next <i class="icon icon--small i-arrow-right"></i>';
  }

  tour.setOptions({
    showStepNumbers: false,
    tooltipClass: 'tour__tooltip',
    tooltipPosition: 'bottom-middle-aligned',
    prevLabel: '<i class="icon icon--small i-arrow-left"></i> Back',
    nextLabel: 'Next <i class="icon icon--small i-arrow-right"></i>',
    doneLabel: tourLastLabel,
    overlayOpacity: 0,
    exitOnEsc: false
  });

  // native intro.js behavior scrolls longer tooltips offscreen
  // so this scrolls to tooltip with some padding
  tour.onchange(function (target) {
    $(window).scrollTop($(target).offset().top - 200);
  });

  tour.onexit(function () {
    if (TOUR_PAGE === this.lastTourPage) {
      self.exitTour();

      var tourEndCurtain = $('<div />', {'class': 'tour__end__curtain'});
      var tourEndModal = $('<div />', {
        'class': 'tour__end__modal',
        'html': '<h5><i class="icon icon-star"></i> Congratulations!</h5>' +
        'You\'ve completed our tour of new features!' +
        '<a role="button" class="tour__end__button tour__end__button--home" href="' +
        CMS_URL + '/">Return home</a>' +
        '<p>Send us your questions and feedback anonymously from any page using our ' +
        '<a class="js-feedback">feedback tool</a>.</p>' +
        '<button class="tour__end__button tour__end__button--close">Close tour</button>'
      });

      self.$selector.prepend(tourEndCurtain, tourEndModal);

      $('.tour__end__button--home').focus();

      self.$selector.find('.tour-end__button--close').on('click', function () {
        tourEndCurtain.remove();
        tourEndModal.remove();
      });
    }
    else {
      window.location.href = self.nextSectionLink;
    }
  });

  // begin intro.js functionality
  tour.start();

  // click ESC to end tour
  $(document).keyup(function (e) {
    if (e.keyCode == 27) {
      self.exitTour();
    }
  });

  // removes native intro.js curtain to not close tooltip
  $('.introjs-overlay').remove();
};

SiteOrientation.prototype.exitTour = function () {
  this.$tourHeader.hide();
  this.initBanner();

  // removes top padding for fixed tour header
  $('body').removeAttr('style');

  this.collapseBanner();
  this.setBannerState();

  $('.tour__point').hide();
  $('.introjs-helperLayer , .introjs-tooltipReferenceLayer').remove();

  // remove ?tour=true querystring
  if (uri.indexOf('?') > 0) {
    var clean_uri = uri.substring(0, uri.indexOf('?'));
    window.history.replaceState({}, document.title, clean_uri);
  }
};

module.exports = {
  SiteOrientation: SiteOrientation
};
