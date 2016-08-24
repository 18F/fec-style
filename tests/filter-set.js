'use strict';

var chai = require('chai');
var expect = chai.expect;

var $ = require('jquery');

require('./setup')();

var FilterSet = require('../js/filter-set').FilterSet;

describe('filter set', function() {
  before(function() {
    this.$fixture = $('<div id="fixtures"></div>');
    $('body').append(this.$fixture);
  });

  beforeEach(function() {
    this.$fixture.empty().append(
      '<form>' +
        '<div class="js-filter" data-filter="text">' +
          '<input name="name">' +
          '<button></button>' +
        '</div>' +
        '<div class="js-filter" data-filter="checkbox">' +
          '<input name="cycle" type="checkbox" value="2012" />' +
          '<input name="cycle" type="checkbox" value="2014" />' +
          '<input name="cycle" type="checkbox" value="2016" />' +
        '</div>' +
      '</form>'
    );
    this.filterSet = new FilterSet(this.$fixture.find('form'));
  });

  it('locates dom elements', function() {
    expect(this.filterSet.$body.is('#fixtures form')).to.be.true;
    expect(this.filterSet.filters).to.deep.equal({});
    expect(this.filterSet.fields).to.deep.equal([]);
  });

  it('activates nested fields', function() {
    this.filterSet.activate();
    expect(this.filterSet.filters).to.include.keys('name', 'cycle');
    expect(this.filterSet.fields).to.deep.equal(['name', 'cycle']);
  });

  it('sets initial values on nested fields', function() {
    window.history.replaceState({}, null, '?cycle=2012&cycle=2014');
    this.filterSet.activate();
    expect(
      this.filterSet.filters.cycle.$input.filter(function(idx, elm) {
        return $(elm).is(':checked');
      }).map(function(idx, elm) {
        return $(elm).val();
      }).get()
    ).to.deep.equal(['2012', '2014']);
  });

  it('serializes form values', function() {
    this.filterSet.activate();
    this.filterSet.filters.cycle.setValue(['2012', '2014']);
    expect(this.filterSet.serialize()).to.deep.equal({
      cycle: ['2012', '2014']
    });
  });

  it('clears form values', function() {
    this.filterSet.activate();
    this.filterSet.filters.name.setValue('jed');
    this.filterSet.filters.cycle.setValue(['2012', '2014']);
    this.filterSet.clear();
    expect(this.filterSet.serialize()).to.deep.equal({});
  });
});
