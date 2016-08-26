'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var $ = require('jquery');

require('./setup')();

var DateFilter = require('../js/date-filter').DateFilter;

describe('date filter', function() {
  before(function() {
    this.$fixture = $('<div id="fixtures"></div>');
    $('body').append(this.$fixture);
  });

  beforeEach(function() {
    this.$fixture.empty().append(
      '<div class="js-filter" data-filter="date">' +
        '<div class="input--removable">' +
          '<input name="date" type="radio" data-min-date="2015-01-01" data-max-date="2015-12-31">' +
          '<input name="date" type="radio" data-min-date="2016-01-01" data-max-date="2016-12-31">' +
          '<input name="min_date" class="js-min-date" />' +
          '<input name="max_date" class="js-max-date" />' +
        '</div>' +
      '</div>'
    );
    this.filter = new DateFilter(this.$fixture.find('.js-filter'));
  });

  it('sets its initial state', function() {
    expect(this.filter.name).to.equal('date');
    expect(this.filter.fields).to.deep.equal(['min_date', 'max_date']);
  });

  it('pulls values from query', function() {
    this.filter.fromQuery({
      min_date: '01-01-2015',
      max_date: '01-01-2015'
    });
    expect(this.filter.$elm.find('[name="min_date"]').val()).to.equal('01-01-2015');
    expect(this.filter.$elm.find('[name="max_date"]').val()).to.equal('01-01-2015');
  });
});
