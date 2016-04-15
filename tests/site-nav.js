
'use strict';

/* global require, describe, before, beforeEach, it */

var chai = require('chai');
var expect = chai.expect;

var $ = require('jquery');

var SiteNav = require('../js/site-nav').SiteNav;

function isOpen(siteNav) {
  return siteNav.isOpen &&
    siteNav.$body.hasClass('is-open') &&
    siteNav.$list.attr('aria-hidden') === 'false' &&
    siteNav.$toggle.hasClass('active');
}

function isClosed(siteNav) {
  return !siteNav.isOpen &&
    !siteNav.$body.hasClass('is-open') &&
    siteNav.$list.attr('aria-hidden') !== 'false'  &&
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
      '<ul id="site-menu" class="site-nav__list">' +
        '<li class="site-nav__item" data-submenu="data">' +
          '<a href="/" class="site-nav__link is-current">' +
            'Campaign Finance Data</a>' +
        '</li>' +
        '<li class="site-nav__item">' +
          '<a href="#" class="site-nav__link">Calendar</a>' +
        '</li>' +
        '<li class="site-nav__item">' +
          '<a href="#" class="site-nav__link is-disabled">TBD</a>' +
        '</li>' +
      '</ul>' +
      '<button class="js-nav-toggle" aria-controls="site-menu">Menu</button>' +
    '</nav>'
    );
    this.siteNav = new SiteNav('.js-site-nav');
  });

  describe('constructor()', function() {
    it('should set body to jqueryized selector', function() {
      expect(this.siteNav.$body).to.be.ok;
      expect(this.siteNav.$body.length).to.be.ok;
      expect(this.siteNav.$list.length).to.be.ok;
      expect(this.siteNav.$toggle.length).to.be.ok;
      expect(this.siteNav.$body.is(this.$fixture.find('nav'))).to.be.true;
    });
  });

  describe('Desktop configuration', function() {
    describe('assignAria()', function() {
      it('should assign arria attributes to the list', function() {
        expect(this.siteNav.$list.attr('aria-label')).to.equal('Site-wide navigation');
      });
    });

    describe('initMegaMenu()', function() {
      it('should append a mega menu to items with [data-submenu]', function() {
        expect(this.siteNav.$list.find('[data-submenu]').find('.mega')).to.be.ok;
      });
    });
  });

  describe('Mobile configuration', function() {
    beforeEach(function() {
      $('body').width(400);
      this.siteNav = new SiteNav('.js-site-nav');
    });

    describe('assignAria()', function() {
      it('should assign arria attributes to the list and toggle', function() {
        expect(this.siteNav.$toggle.length).to.be.ok;
        expect(this.siteNav.$toggle.attr('aria-haspopup')).to.equal('true');
        expect(this.siteNav.$list.attr('aria-hidden')).to.equal('true');
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
});
