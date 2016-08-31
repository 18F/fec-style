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

  this.$input.on('change', this.handleInputChange.bind(this));
  this.$elm.on('change', this.handleRadioChange.bind(this));
  this.fields = ['min_' + this.name, 'max_' + this.name];

  this.$minDate.on('click', this.handlePickMinDate.bind(this));
  this.$maxDate.on('click', this.handlePickMaxDate.bind(this));

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

  this.setDateGrid();

  $input.trigger(eventName, [
    {
      key: $input.attr('id'),
      value: this.formatValue($input, value),
      loadedOnce: loadedOnce,
      range: range,
      rangeName: rangename,
      name: this.name
    }
  ]);

  $input.data('loaded-once', true);
};

DateFilter.prototype.setDateGrid = function() {
  var dateBeginning = this.$minDate.val().split('/');
  var dateBeginningMonth = this.$grid.find('ul[data-year="' + dateBeginning[2] + '"] ' +
    'li[data-month="' + dateBeginning[0] + '"]');
  var dateEnd = this.$maxDate.val().split('/');
  var dateEndMonth = this.$grid.find('ul[data-year="' + dateEnd[2] + '"] ' +
    'li[data-month="' + dateEnd[0] + '"]');

  this.$grid.find('li').removeClass('beginning end active').addClass('inactive');

  dateBeginningMonth.removeClass('inactive').addClass('active beginning');
  dateEndMonth.removeClass('inactive').addClass('active end');

  if (!dateBeginningMonth.is(dateEndMonth)) {
    dateBeginningMonth.nextUntil('.end').removeClass('inactive').addClass('active');
    dateEndMonth.prevUntil('.beginning').removeClass('inactive').addClass('active');
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

DateFilter.prototype.handlePickMinDate = function() {
  var self = this;

  this.$grid.show().removeClass('js-pick-max').addClass('js-pick-min');

  this.$grid.find('li').hover(
    function() {
      $(this).prevAll().removeClass('active').addClass('inactive');
      $(this).nextAll().removeClass('inactive').addClass('active');
    },
    function() {
      self.setDateGrid();
    }
  );
};

DateFilter.prototype.handlePickMaxDate = function() {
  var self = this;

  this.$grid.show().removeClass('js-pick-min').addClass('js-pick-max');

  this.$grid.find('li').hover(
    function() {
      $(this).prevAll().removeClass('inactive').addClass('active');
      $(this).nextAll().removeClass('active').addClass('inactive');
    },
    function() {
      self.setDateGrid();
    }
  );
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
  }
};

DateFilter.prototype.hideWarning = function() {
  if (this.showingWarning) {
    this.$elm.find('.message').remove();
    this.showingWarning = false;
  }
};

module.exports = {DateFilter: DateFilter};
