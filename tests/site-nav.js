'use strict';

/* global require, describe, before, beforeEach, it */

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var $ = require('jquery');

var SiteNav = require('../js/site-nav').SiteNav;
var helpers = require('../js/helpers');

var dom = '<nav class="site-nav js-site-nav">' +
  '<div id="site-menu" class="site-nav__container">' +
  '<ul>' +
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
  '</div>' +
  '<button class="js-nav-toggle" aria-controls="site-menu">Menu</button>' +
'</nav>';

describe('SiteNav', function() {
  before(function() {
    this.$fixture = $('<div id="fixtures"></div>');
    $('body').append(this.$fixture);
  });

  beforeEach(function() {
    this.$fixture.empty().append(dom);
    this.siteNav = new SiteNav('.js-site-nav');
  });

  after(function() {
    this.$fixture.remove();
  });

  describe('constructor()', function() {
    it('should set body to jqueryized selector', function() {
      expect(this.siteNav.$element).to.be.ok;
      expect(this.siteNav.$element.length).to.be.ok;
      expect(this.siteNav.$menu.length).to.be.ok;
      expect(this.siteNav.$toggle.length).to.be.ok;
      expect(this.siteNav.$element.is(this.$fixture.find('nav'))).to.be.true;
    });
  });

  describe('Desktop configuration', function() {
    beforeEach(function() {
      this.originalWidth = $('body').width();
      var width = 1000;
      $('body').width(width);
      sinon.stub(helpers, 'getWindowWidth').returns(width);

      this.$fixture.empty().append(dom);
      this.siteNav = new SiteNav('.js-site-nav');
    });

    afterEach(function() {
      $('body').width(this.originalWidth);
      helpers.getWindowWidth.restore();
    });

    describe('assignAria()', function() {
      it('should assign aria attributes to the list', function() {
        expect(this.siteNav.$menu.attr('aria-label')).to.equal('Site-wide navigation');
      });
    });

    describe('initMegaMenu()', function() {
      it('should append a mega menu to items with [data-submenu]', function() {
        expect(this.siteNav.$menu.find('[data-submenu]').find('.mega').length).to.equal(1);
      });
    });
  });

  describe('Mobile configuration', function() {
    beforeEach(function() {
      var width = 400;
      sinon.stub(helpers, 'getWindowWidth').returns(width);
      $('body').width(width);
      this.$fixture.empty().append(dom);
      this.siteNav = new SiteNav('.js-site-nav');
    });

    afterEach(function() {
      $('body').width(1000);
      helpers.getWindowWidth.restore();
    });

    describe('initMobileMenu()', function() {
      it('should append the mobile menu', function() {
        expect(this.siteNav.$menu.find('.js-mobile-nav').length).to.equal(1);
        expect(this.siteNav.isMobile).to.be.true;
      });
    });

    describe('assignAria()', function() {
      it('should assign aria attributes to the list and toggle', function() {
        expect(this.siteNav.$toggle.length).to.be.ok;
        expect(this.siteNav.$toggle.attr('aria-haspopup')).to.equal('true');
        expect(this.siteNav.$menu.attr('aria-hidden')).to.equal('true');
      });
    });

    describe('toggle()', function() {
      function isOpen(siteNav) {
        return siteNav.isOpen &&
          siteNav.$element.hasClass('is-open') &&
          siteNav.$menu.attr('aria-hidden') === 'false' &&
          siteNav.$toggle.hasClass('active');
      }
      function isClosed(siteNav) {
        return !siteNav.isOpen &&
          !siteNav.$element.hasClass('is-open') &&
          siteNav.$menu.attr('aria-hidden') !== 'false'  &&
          !siteNav.$toggle.hasClass('active');
      }

      it('should show and hide the menu', function() {
        this.siteNav.toggleMenu();
        expect(isOpen(this.siteNav)).to.be.true;
        this.siteNav.toggleMenu();
        expect(isClosed(this.siteNav)).to.be.true;
      });
    });

    describe('mobile panels', function() {
      it('should show a panel when clicking a target', function() {
        this.siteNav.$element.find('.js-panel-trigger[aria-controls="nav-advanced"]').click();
        expect(this.siteNav.$element.find('#nav-advanced').attr('aria-hidden')).to.equal('false');
      });

      it('should hide a panel when clicking the back button', function() {
        this.siteNav.$element.find('.js-panel-close[aria-controls="nav-advanced"]').click();
        expect(this.siteNav.$element.find('#nav-advanced').attr('aria-hidden')).to.equal('true');
      });
    });
  });

  describe('switchMenu()', function() {
    describe('when switching to a small screen', function() {
      before(function() {
        this.originalWidth = $('body').width();
        var width = 400;
        sinon.stub(helpers, 'getWindowWidth').returns(width);
        $('body').width(width);
        this.siteNav.switchMenu();
      });

      after(function() {
        $('body').width(this.originalWidth);
        helpers.getWindowWidth.restore();
      });

      it('should remove the mega menu', function() {
        expect(this.siteNav.$element.find('.mega').length).to.equal(0);
      });

      it('should instantiate the small menu', function() {
        expect(this.siteNav.$element.find('.js-mobile-nav').length).to.equal(1);
      });
    });

    describe('when switching to a large screen', function() {
      before(function() {
        this.originalWidth = $('body').width();
        var width = 1000;
        sinon.stub(helpers, 'getWindowWidth').returns(width);
        $('body').width(width);
        this.siteNav.switchMenu();
      });

      after(function() {
        $('body').width(this.originalWidth);
        helpers.getWindowWidth.restore();
      });

      it('should remove the mobile menu if the screen gets big', function() {
        this.siteNav.switchMenu();
        expect(this.siteNav.$element.find('.js-mobile-nav').length).to.equal(0);
      });
    });
  });
});
