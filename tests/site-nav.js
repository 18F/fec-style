
'use strict';

/* global require, document, describe, before, beforeEach, after, afterEach, it */

var chai = require('chai');
var expect = chai.expect;

var $ = require('jquery');

var SiteNav = require('../js/site-nav').SiteNav;

function isOpen(siteNav) {
  return siteNav.isOpen &&
    siteNav.$body.hasClass('is-open') &&
    siteNav.$toggle.hasClass('active');
}

function isClosed(siteNav) {
  return !siteNav.isOpen &&
    !siteNav.$body.hasClass('is-open') &&
    !siteNav.$toggle.hasClass('active');
}

describe('SiteNav', function() {
  before(function() {
    this.$fixture = $('<div id="fixtures"></div>');
    $('body').append(this.$fixture);
  });

  beforeEach(function() {
    this.$fixture.empty().append(
    '<nav class="site-nav js-site-nav">' +
      '<button for="nav-toggle" class="js-nav-toggle site-nav__button site-nav__button--left" aria-controls="site-menu">Menu</button>' +
      '<ul id="site-menu" class="site-nav__list">' +
        '<li class="site-nav__item site-nav__item--with-dropdown js-sublist-parent">' +
          '<a href="/" class="site-nav__link is-current">' +
            'Campaign Finance Data</a>' +
          '<button class="site-nav__link site-nav__toggle js-sublist-toggle">Campaign finance data</button>' +
          '<ul class="site-nav__dropdown">' +
            '<li class="site-nav__item">' +
              '<a class="site-nav__link" href="/">Search for candidates »</a>' +
            '</li>' +
            '<li class="site-nav__item">' +
              '<a class="site-nav__link" href="/elections">' +
                  'Search by ZIP code »</a>' +
            '</li>' +
            '<li class="site-nav__item">' +
              '<a class="site-nav__link" ' +
                'href="/candidates?cycle=2012&amp;cycle=2014&amp;cycle=2016">' +
                  'Browse candidates »</a>' +
            '</li>' +
          '</ul>' +
        '</li>' +
        '<li class="site-nav__item">' +
          '<a href="#" class="site-nav__link is-disabled">Calendar</a>' +
        '</li>' +
        '<li class="site-nav__item">' +
          '<a href="#" class="site-nav__link is-disabled">TBD</a>' +
        '</li>' +
      '</ul>' +
    '</nav>'
    );
    this.siteNav = new SiteNav('.js-site-nav');
  });

  describe('constructor()', function() {
    it('should set body to jqueryized selector', function() {
      expect(this.siteNav.$body).to.be.ok;
      expect(this.siteNav.$body.length).to.be.ok;
      expect(this.siteNav.$body.is(this.$fixture.find('nav'))).to.be.true;
    });
  });

  describe('assignAria()', function() {
    beforeEach(function() {
      this.$subLists = this.$fixture.find('#site-menu ul');
    });

    it('should assign an aria label of submenu to sub lists', function() {
      expect(this.$subLists.length).to.be.ok;
      expect(this.$subLists.first().attr('aria-label')).to.equal('submenu');
    });

    it('should assign aria hidden to sub lists', function() {
      expect(this.$subLists.first().attr('aria-hidden')).to.equal('true');
      expect(this.$subLists.last().attr('aria-hidden')).to.equal('true');
    });

    it('should assign aria-haspopup to all toggle buttons for the sub lists', function() {
      var $toggles = this.$fixture.find('.js-sublist-toggle');
      var $popupToggles = this.$fixture.find('.js-sublist-toggle[aria-haspopup="true"]');
      expect($toggles.length).to.be.ok;
      expect($toggles.length).to.equal($popupToggles.length);
    });

    it('should assign an aria label to the whole nav', function() {
      var $nav = this.$fixture.find('.js-site-nav');
      expect($nav.length).to.be.ok;
      expect($nav.attr('aria-label')).to.be.ok;
    });
  });

  describe('toggle()', function() {
    it('should show and hide the menu', function() {
      this.siteNav.toggle();
      expect(isOpen(this.siteNav)).to.be.true;
      this.siteNav.toggle();
      expect(isClosed(this.siteNav)).to.be.true;
    });
  });
});
