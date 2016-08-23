'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var $ = require('jquery');

require('./setup')();

var DateFilter = require('../js/date-filter').DateFilter;
var ElectionFilter = require('../js/election-filter').ElectionFilter;
var TextFilter = require('../js/text-filter').TextFilter;
var CheckboxFilter = require('../js/checkbox-filter').CheckboxFilter;

function getChecked($input) {
  return $input.filter(function(idx, elm) {
    return $(elm).is(':checked');
  }).map(function(idx, elm) {
    return $(elm).val();
  }).get();
}

describe('filter set', function() {
  before(function() {
    this.$fixture = $('<div id="fixtures"></div>');
    $('body').append(this.$fixture);
  });

  describe('text filters', function() {
    beforeEach(function() {
      this.$fixture.empty().append(
        '<button class="accordion__trigger">Filter category</button>' +
        '<div class="accordion__content">' +
        '<div class="js-filter">' +
          '<div class="input--removable">' +
            '<input name="name" />' +
          '</div>' +
        '</div></div>'
      );
      this.filter = new TextFilter(this.$fixture.find('.js-filter'));
    });

    it('locates dom elements', function() {
      expect(this.filter.$elm.is('#fixtures .js-filter')).to.be.true;
      expect(this.filter.$input.is('#fixtures input')).to.be.true;
      expect(this.filter.$filterLabel.is('#fixtures .accordion__trigger')).to.be.true;
    });

    it('pulls name from $elm if present', function() {
      this.$fixture.empty().append(
        '<div class="js-filter" data-name="name-override">' +
          '<div class="input--removable">' +
            '<input name="name" />' +
          '</div>' +
        '</div>'
      );
      var filter = new TextFilter(this.$fixture.find('.js-filter'));
      expect(filter.name).to.equal('name-override');
    });

    it('sets its initial state', function() {
      expect(this.filter.name).to.equal('name');
      expect(this.filter.fields).to.deep.equal(['name']);
    });
  });

  describe('checkbox filters', function() {
    beforeEach(function() {
      this.$fixture.empty().append(
        '<button class="accordion__trigger">Filter category</button>' +
        '<div class="accordion__content">' +
        '<div class="js-filter">' +
          '<div class="input--removable">' +
            '<input name="cycle" type="checkbox" value="2012" />' +
            '<input name="cycle" type="checkbox" value="2014" />' +
            '<input name="cycle" type="checkbox" value="2016" />' +
          '</div>' +
        '</div></div>'
      );
      this.filter = new CheckboxFilter(this.$fixture.find('.js-filter'));
    });

    it('sets scalar values', function() {
      this.filter.setValue('2012');
      expect(getChecked(this.filter.$input)).to.deep.equal(['2012']);
    });

    it('sets list values', function() {
      this.filter.setValue(['2012', '2016']);
      expect(getChecked(this.filter.$input)).to.deep.equal(['2012', '2016']);
    });

    it('sets empty values', function() {
      this.filter.setValue();
      expect(getChecked(this.filter.$input)).to.deep.equal([]);
    });

    it('increments the filter count when checked', function() {
      this.filter.setValue(['2012', '2016']);
      expect(this.filter.$filterLabel.find('.filter-count').html()).to.equal('2');
    });

    it('decrements the filter count when unchecked', function() {
      this.filter.setValue(['2012', '2016']);
      this.filter.setValue('2012');
      expect(this.filter.$filterLabel.find('.filter-count').html()).to.equal('1');
    });
  });

  describe('date range filters', function() {
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

  describe('Election filters', function() {
    beforeEach(function() {
      this.$fixture.empty().append(
        '<div class="js-filter"' +
          'data-filter="election"' +
          'data-name="election_year"' +
          'data-cycle-name="cycle"' +
          'data-full-name="election_full"' +
          'data-duration="4">' +
          '<label class="label" for="election_year">Election cycle</label>' +
          '<select name="election_year" class="js-election">' +
              '<option value="2016">2016</option>' +
              '<option value="2012">2012</option>' +
          '</select>' +
          '<fieldset>' +
            '<legend class="label">Time period</legend>' +
            '<div class="js-cycles"></div>' +
          '</fieldset>' +
          '<input type="hidden" name="cycle">' +
          '<input type="hidden" name="election_full"">' +
        '</div>'
      );
      this.filter = new ElectionFilter(this.$fixture.find('.js-filter'));
      this.filter.fromQuery({
        election_year: '2016',
        cycle: '2014',
        election_full: false
      });
      this.trigger = sinon.spy($.prototype, 'trigger');
    });

    it('sets its initial state', function() {
      expect(this.filter.name).to.equal('election_year');
      expect(this.filter.duration).to.equal(4);
      expect(this.filter.fields).to.deep.equal(['election_year', 'cycle', 'election_full']);
    });

    it('pulls values from query', function() {
      this.filter.fromQuery({
        election_year: '2016',
        cycle: '2014',
        election_full: false
      });
      expect(this.filter.$election.val()).to.equal('2016');
      expect(this.filter.$cycles.find(':checked').val()).to.equal('2014:false');
    });

    it('builds cycle toggles on election change', function() {
      this.filter.handleElectionChange({target: this.filter.$election});
      expect(this.filter.$cycles.find('label').length).to.equal(3);
      expect(this.filter.$cycles.find('label:first-of-type input').is(':checked')).to.be.true;
    });

    it('handles cycle change', function() {
      var target = '<input type="radio" value="2014:false">';
      this.filter.handleCycleChange({target: target});
      expect(this.filter.$cycle.val()).to.equal('2014');
      expect(this.filter.$full.val()).to.equal('false');
    });

    it('sets a tag', function() {
      this.filter.loadedOnce = false;
      this.filter.$election.val('2016');
      this.filter.setTag();
      expect(this.trigger).to.have.been.calledWith('filter:added', [
        {
          key: 'election',
          value: '2016 election: 2013-2014',
          nonremovable: true
        }
      ]);
    });

    it('renames a tag if it already exitss', function() {
      this.filter.loadedOnce = true;
      this.filter.$election.val('2012');
      this.filter.setTag();
      expect(this.trigger).to.have.been.calledWith('filter:renamed', [
        {
          key: 'election',
          value: '2012 election: 2013-2014',
          nonremovable: true
        }
      ]);
    });

    afterEach(function() {
      $.prototype.trigger.restore();
    });
  });

});
