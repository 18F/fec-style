'use strict'

/* global require, window, describe, before, beforeEach, after, afterEach, it */

var chai = require('chai');
var expect = chai.expect;

var $ = require('jquery');
var _ = require('underscore');

var Glossary = require('../js/glossary').Glossary;

function isOpen(glossary) {
  return glossary.isOpen &&
    glossary.$body.hasClass('is-open') &&
    glossary.$body.attr('aria-hidden') === 'false' &&
    glossary.$toggle.hasClass('active');
}

function isClosed(glossary) {
  return !glossary.isOpen &&
    !glossary.$body.hasClass('is-open') &&
    glossary.$body.attr('aria-hidden') === 'true' &&
    !glossary.$toggle.hasClass('active');
}

describe('glossary', function() {
  before(function() {
    this.$fixture = $('<div id="fixtures"></div>');
    $('body').append(this.$fixture);
  });

  beforeEach(function() {
    this.$fixture.empty().append(
      '<button id="glossary-toggle"></button>' +
      '<span class="term" data-term="party"></span>' +
      '<div id="glossary">' +
        '<button class="toggle"></button>' +
        '<input class="glossary__search" />' +
        '<ul class="glossary__list js-accordion"></ul>' +
      '</div>'
    );
    this.glossary = new Glossary('#glossary', '#glossary-toggle');
  });

  it('initializes', function() {
    expect(this.glossary.isOpen).to.be.false;
  });

  it('shows', function() {
    this.glossary.show();
    expect(isOpen(this.glossary)).to.be.true;
  });

  it('hides', function() {
    this.glossary.hide();
    expect(isClosed(this.glossary)).to.be.true;
  });

  it('toggles', function() {
    this.glossary.toggle();
    expect(isOpen(this.glossary)).to.be.true;
    this.glossary.toggle();
    expect(isClosed(this.glossary)).to.be.true;
  });

  it('linkifies terms in the document', function() {
    var $term = this.$fixture.find('.term');
    expect($term.attr('title')).to.equal('Click to define');
    $term.click();
    var items = this.glossary.list.visibleItems;
    expect(items.length).to.equal(1);
    expect(items[0].elm.innerText.indexOf('Party')).to.be.greaterThan(-1);
  });

  it('finds a term', function() {
    this.glossary.findTerm('party');
    var items = this.glossary.list.visibleItems;
    expect(items.length).to.equal(1);
    expect(items[0].elm.innerText.indexOf('Party')).to.be.greaterThan(-1);
  });

});
