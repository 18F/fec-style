
'use strict';

/* global require, document, describe, before, beforeEach, after, afterEach, it */

var chai = require('chai');
var expect = chai.expect;

var $ = require('jquery');

var SiteNav = require('../js/site-nav').SiteNav;

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
          '<span class="site-nav__link site-nav__toggle js-sublist-toggle">Campaign finance data</span>' +
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

    it('should assign aria-haspopup to all links to the sub lists', function() {
      var $link = this.$fixture.find('#site-menu .js-nav-drop-link');
      expect($link.length).to.be.ok;
      expect($link.first().attr('aria-haspopup')).to.equal('true');
    });

    it('should assign an aria label to the whole nav', function() {
      var $nav = this.$fixture.find('.js-site-nav');
      expect($nav.length).to.be.ok;
      expect($nav.attr('aria-label')).to.be.ok;
    });
  });

  describe('toggle()', function() {
    it('should show and hide the menu', function() {
      var $nav = this.$fixture.find('.js-site-nav');
      this.siteNav.toggle();
      expect($nav.attr('class')).to.include('is-open');
      this.siteNav.toggle();
      expect($nav.attr('class')).to.not.include('is-open');
    });
  });

  describe('toggleSublist()', function() {
    it('should show and hide the sublist', function() {
      var $sublistParent = this.$fixture.find('.js-sublist-parent');
      var $sublistToggle = this.$fixture.find('.js-sublist-toggle');
      var testEv = {target: $sublistToggle};
      this.siteNav.toggleSublist(testEv);
      expect($sublistParent.find('ul').attr('aria-hidden')).to.equal('false');
      this.siteNav.toggleSublist(testEv);
      expect($sublistParent.find('ul').attr('aria-hidden')).to.equal('true');
    });
  });

  describe('handleFocus()', function() {
    it('should show the sublist when focused', function() {
      var $sublistParent = this.$fixture.find('.js-sublist-parent');
      var $link = $sublistParent.find('a')[0];
      var testEv = {target: $link};
      this.siteNav.handleFocus(testEv);
      expect($sublistParent.find('ul').attr('aria-hidden')).to.equal('false');
    });

    it('should hide the sublist when focus leaves the parent', function() {
      var $sublistParent = this.$fixture.find('.js-sublist-parent');
      var $otherLink = this.$fixture.find('.site-nav__item .is-disabled')[0];
      var testEv = {target: $otherLink};
      this.siteNav.showSublist($sublistParent);
      this.siteNav.handleFocus(testEv);
      expect($sublistParent.find('ul').attr('aria-hidden')).to.equal('true');
    });
  });
});
