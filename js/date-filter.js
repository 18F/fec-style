'use strict';

var $ = require('jquery');
var moment = require('moment');

var Filter = require('./filter-base.js');

require('jquery.inputmask');
require('jquery.inputmask/dist/inputmask/inputmask.date.extensions.js');
require('jquery.inputmask/dist/inputmask/inputmask.numeric.extensions.js');

function DateFilter(elm) {
  Filter.Filter.call(this, elm);
  this.validateInput = this.$elm.data('validate') || false;
  this.$range = this.$elm.find('.range');
  this.$grid = this.$elm.find('.date-range-grid');
  this.$minDate = this.$elm.find('.js-min-date');
  this.$maxDate = this.$elm.find('.js-max-date');
  this.$minDate.inputmask('mm-dd-yyyy', {
    oncomplete: this.validate.bind(this)
  });
  this.$maxDate.inputmask('mm-dd-yyyy', {
    oncomplete: this.validate.bind(this)
  });
  this.$submit = this.$elm.find('button');

  this.$input.on('change', this.handleInputChange.bind(this));
  this.$elm.on('change', this.handleRadioChange.bind(this));
  this.fields = ['min_' + this.name, 'max_' + this.name];

  this.$minDate.on('click', this.handleMinDateSelect.bind(this));
  this.$maxDate.on('click', this.handleMaxDateSelect.bind(this));

  this.$grid.find('li').on('click', this.dateGridSelect.bind(this));

  $(document.body).on('filter:modify', this.handleModifyEvent.bind(this));
}

DateFilter.prototype = Object.create(Filter.Filter.prototype);
DateFilter.constructor = DateFilter;

DateFilter.prototype.handleRadioChange = function(e) {
  var $input = $(e.target);
  if (!$input.is(':checked')) { return; }
  if ($input.attr('data-min-date')) {
    this.$minDate.val($input.data('min-date')).change();
    this.$maxDate.val($input.data('max-date')).change();
  }
};

DateFilter.prototype.handleInputChange = function(e) {
  var $input = $(e.target);
  var value = $input.val();
  var loadedOnce = $input.data('loaded-once') || false;
  var range = $input.data('range') || 'false';
  var rangename = 'date';
  var eventName;

  if ($input.data('had-value') && value.length > 0) {
    eventName = 'filter:renamed';
  } else if (value.length > 0) {
    eventName = 'filter:added';
    $input.data('had-value', true);
  } else {
    eventName = 'filter:removed';
    $input.data('had-value', false);
  }

  this.setupDateGrid();

  if (loadedOnce) {
    this.$submit.addClass('is-loading');
  }

  $input.trigger(eventName, [
    {
      key: $input.attr('id'),
      value: this.formatValue($input, value),
      loadedOnce: loadedOnce,
      range: range,
      rangeName: rangename,
      name: this.name,
      nonremovable: true
    }
  ]);

  if (eventName === 'filter:renamed') {
    $input.data('loaded-once', true);
  }
};

DateFilter.prototype.validate = function() {
  if (!this.validateInput) { return; }
  var years = [this.minYear, this.maxYear];
  var minDateYear = this.$minDate.val() ?
    parseInt(this.$minDate.val().split('/')[2]) : this.minYear;
  var maxDateYear = this.$maxDate.val() ?
    parseInt(this.$maxDate.val().split('/')[2]) : this.maxYear;
  if ( years.indexOf(minDateYear) > -1 && years.indexOf(maxDateYear) > -1 ) {
    this.hideWarning();
    this.$elm.trigger('filters:validation', [
      {
        isValid: true,
      }
    ]);
  } else {
    this.showWarning();
    this.$elm.trigger('filters:validation', [
      {
        isValid: false,
      }
    ]);
  }
};

DateFilter.prototype.fromQuery = function(query) {
  if (query['min_' + this.name] || query['max_' + this.name]) {
    this.setValue([
      query['min_' + this.name],
      query['max_' + this.name]
    ]);
  }
  return this;
};

DateFilter.prototype.setValue = function(value) {
  value = Filter.ensureArray(value);
  this.$minDate.val(value[0]).change();
  this.$maxDate.val(value[1]).change();
};

DateFilter.prototype.handleModifyEvent = function(e, opts) {
  var today = new Date();
  // Sets min and max years based on the transactionPeriod filter
  if (opts.filterName === this.name) {
    this.maxYear = parseInt(opts.filterValue);
    this.minYear = this.maxYear - 1;
    this.$minDate.val('01-01-' + this.minYear.toString()).change();
    if (this.maxYear === today.getFullYear()) {
      today = moment(today).format('MM-DD-YYYY');
      this.$maxDate.val(today).change();
    } else {
      this.$maxDate.val('12-31-' + this.maxYear.toString()).change();
    }
    this.validate();
  }
};

DateFilter.prototype.setupDateGrid = function() {
  var dateBegin = this.$minDate.val().split('/');
  var dateEnd = this.$maxDate.val().split('/');
  var dateRangeFirst = this.$grid.find('.date-range-first');
  var dateRangeSecond = this.$grid.find('.date-range-second');
  var minDateMonth = dateBegin[0];
  var minDateYear = dateBegin[2];
  var maxDateMonth = dateEnd[0];
  var maxDateYear = dateEnd[2];
  var $dateBegin;
  var $dateEnd;

  // based on the beginning and end transaction dates,
  // set the template of the date grid to the correct year
  dateRangeFirst.find('.date-range-year').html(minDateYear);
  dateRangeFirst.find('ul').attr('data-year', minDateYear);

  // because transactions are done in two year periods
  // second year in grid is always the year after the beginning year
  dateRangeSecond.find('.date-range-year').html(parseInt(minDateYear) + 1);
  dateRangeSecond.find('ul').attr('data-year', parseInt(minDateYear) + 1);

  // get the elements of the beginning and ending dates
  $dateBegin = this.$grid.find('ul[data-year="' + minDateYear + '"] ' +
    'li[data-month="' + minDateMonth + '"]').addClass('begin');
  $dateEnd = this.$grid.find('ul[data-year="' + maxDateYear + '"] ' +
    'li[data-month="' + maxDateMonth + '"]').addClass('end');

  // set the selected date range in the grid
  this.handleDateGridRange($dateBegin, $dateEnd);
};

DateFilter.prototype.handleDateGridRange = function($dateBegin, $dateEnd) {
  // reset all grid elements (months)
  this.$grid.find('li').removeClass();

  // set the beginning and end dates
  $dateBegin.addClass('selected begin');
  $dateEnd.addClass('selected end');

  if (!$dateBegin.is($dateEnd)) {
    $dateBegin.nextUntil('.end').addClass('selected');
    $dateEnd.prevUntil('.begin').addClass('selected');
  }
};

DateFilter.prototype.handleMinDateSelect = function() {
  var self = this;
  var $dateBegin = this.$grid.find('.begin');
  var $dateEnd = this.$grid.find('.end');

  this.$grid.show().removeClass('pick-max').addClass('pick-min');

  $dateBegin.addClass('active');

  this.$grid.find('li').hover(
    function() {
      self.handleDateGridRange($(this), $dateEnd);
    },
    function() {
      self.handleDateGridRange($dateBegin, $dateEnd);
      $dateBegin.addClass('active');
    }
  );
};

DateFilter.prototype.handleMaxDateSelect = function() {
  var self = this;
  var $dateBegin = this.$grid.find('.begin');
  var $dateEnd = this.$grid.find('.end');

  this.$grid.show().removeClass('pick-min').addClass('pick-max');

  $dateEnd.addClass('active');

  this.$grid.find('li').hover(
    function() {
      self.handleDateGridRange($dateBegin, $(this));
    },
    function() {
      self.handleDateGridRange($dateBegin, $dateEnd);
      $dateEnd.addClass('active');
    }
  );
};

DateFilter.prototype.dateGridSelect = function (e) {
  var value = [];

  if (this.$grid.hasClass('pick-min')) {
    value[0] = $(e.target).data('month') + '/01/' + $(e.target).parent().data('year');
    value[1] = this.$maxDate.val();
  }
  else {
    value[0] = this.$minDate.val();
    value[1] = $(e.target).data('month') + '/01/' + $(e.target).parent().data('year');
  }

  this.$grid.removeClass('pick-min pick-max');
  this.$grid.find('li').unbind('mouseenter mouseleave');

  this.setValue(value);
};

DateFilter.prototype.showWarning = function() {
  if (!this.showingWarning) {
    var warning =
    '<div class="message message--error message--small">' +
      'You entered a date that\'s outside the selected transaction period. ' +
      'Please enter a receipt date from ' +
      '<strong>' + this.minYear + '-' + this.maxYear + '</strong>' +
    '</div>';
    this.$range.after(warning);
    this.showingWarning = true;
    this.$grid.hide();
  }
};

DateFilter.prototype.hideWarning = function() {
  if (this.showingWarning) {
    this.$elm.find('.message').remove();
    this.showingWarning = false;
  }
};

module.exports = {DateFilter: DateFilter};
