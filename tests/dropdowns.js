'use strict'

/* global require, window, describe, before, beforeEach, after, afterEach, it */

var chai = require('chai');
var expect = chai.expect;

var $ = require('jquery');
var _ = require('underscore');

var Dropdown = require('../js/dropdowns').Dropdown;

function isOpen(dropdown) {
  return dropdown.isOpen &&
    dropdown.$panel.attr('aria-hidden') == 'false';
}

function isClosed(dropdown) {
  return !dropdown.isOpen &&
    dropdown.$panel.attr('aria-hidden') == 'true';
}

describe('dropdown', function() {
  before(function() {
    this.$fixture = $('<div id="fixtures"></div>');
    $('body').append(this.$fixture);
  });

  beforeEach(function() {
    this.$fixture.empty().append(
      '<fieldset class="js-dropdown">' +
        '<legend class="label">Election Years</legend>' +
        '<ul class="dropdown__selected"></ul>' +
        '<div class="dropdown">' +
          '<button class="dropdown__button button--neutral">More</button>' +
          '<div id="cycle-dropdown" class="dropdown__panel" aria-hidden="true">' +
            '<ul class="dropdown__list">' +
              '<li class="dropdown__item">' +
                '<input id="A" name="cycle" type="checkbox" value="A">' +
                '<label id="label-A" class="dropdown__value" for="A">A</label>' +
              '</li>' +
              '<li class="dropdown__item">' +
                '<input id="B" name="cycle" type="checkbox" value="B">' +
                '<label id="label-B" class="dropdown__value" for="B">B</label>' +
              '</li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
      '</fieldset>'
    );
    this.dropdown = new Dropdown('.js-dropdown');
  });

  it('initializes', function() {
    expect(this.dropdown.isOpen).to.be.false;
  });

  it('shows', function() {
    this.dropdown.show();
    expect(isOpen(this.dropdown)).to.be.true;
  });

  it('hides', function() {
    this.dropdown.hide();
    expect(isClosed(this.dropdown)).to.be.true;
  });

  it('toggles', function() {
    this.dropdown.$button.click();
    expect(isOpen(this.dropdown)).to.be.true;
    this.dropdown.$button.click();
    expect(isClosed(this.dropdown)).to.be.true;
  });

  it('handles a check', function() {
    var checkbox = this.dropdown.$panel.find('#A');
    checkbox.click();   
    expect(checkbox.is(':checked')).to.be.true;
  });

  it('selects inputs', function() {
    this.dropdown.selectItem($('#A'));
    var selectedItems = this.dropdown.$selected.find('.dropdown__item');
    var panelItems = this.dropdown.$panel.find('.dropdown__item');
    expect(selectedItems.length).to.equal(1);
    expect(panelItems.length).to.equal(1);
  });

  it('removes the panel', function(){
    this.dropdown.removePanel();
    expect(this.dropdown.$body.find('.dropdown__panel').length).to.equal(0);
    expect(this.dropdown.$body.find('.dropdown__button').length).to.equal(0);
  });

  it('hides when clicking somewhere else', function(){
    this.dropdown.show();
    this.dropdown.handleClick({target: 'other'});
    expect(isClosed(this.dropdown)).to.be.true;
  });

  it('hides on ESC', function(){
    this.dropdown.show();
    this.dropdown.handleKeyup({keyCode: 27});
    expect(isClosed(this.dropdown)).to.be.true;
  });
});
