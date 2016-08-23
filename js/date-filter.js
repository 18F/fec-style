'use strict';

var $ = require('jquery');
var moment = require('moment');

var Filter = require('./filter-base.js');

require('jquery.inputmask');
require('jquery.inputmask/dist/inputmask/inputmask.date.extensions.js');
require('jquery.inputmask/dist/inputmask/inputmask.numeric.extensions.js');

function DateFilter(elm) {
  Filter.Filter.call(this, elm);
  this.validateInput = this.$body.data('validate') || false;
  this.$minDate = this.$body.find('.js-min-date');
  this.$maxDate = this.$body.find('.js-max-date');
  this.$minDate.inputmask('mm-dd-yyyy', {
    oncomplete: this.validate.bind(this)
  });
  this.$maxDate.inputmask('mm-dd-yyyy', {
    oncomplete: this.validate.bind(this)
  });

  this.$body.on('change', this.handleRadioChange.bind(this));
  this.fields = ['min_' + this.name, 'max_' + this.name];

  this.$minDate.on('click', this.handlePickMinDate.bind(this));
  this.$maxDate.on('click', this.handlePickMaxDate.bind(this));
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

DateFilter.prototype.validate = function() {
  if (!this.validateInput) { return; }
  var years = [this.minYear, this.maxYear];
  var minDateYear = this.$minDate.val() ?
    parseInt(this.$minDate.val().split('-')[2]) : this.minYear;
  var maxDateYear = this.$maxDate.val() ?
    parseInt(this.$maxDate.val().split('-')[2]) : this.maxYear;
  if ( years.indexOf(minDateYear) > -1 && years.indexOf(maxDateYear) > -1 ) {
    this.hideWarning();
    this.$body.trigger('filters:validation', [
      {
        isValid: true,
      }
    ]);
  } else {
    this.showWarning();
    this.$body.trigger('filters:validation', [
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
  var calendar = this.$body.find('.date-range-calendar');
  calendar.show().removeClass('js-pick-max').addClass('js-pick-min');

  calendar.find('li').hover(function() {
    $(this).prevAll().removeClass('active').addClass('deactive');
    $(this).nextAll().removeClass('deactive').addClass('active');
  });

};

DateFilter.prototype.handlePickMaxDate = function() {
  var calendar = this.$body.find('.date-range-calendar');
  calendar.show().removeClass('js-pick-min').addClass('js-pick-max');

  calendar.find('li').hover(function() {
    $(this).prevAll().removeClass('deactive').addClass('active');
    $(this).nextAll().removeClass('active').addClass('deactive');
  });

};


DateFilter.prototype.showWarning = function() {
  if (!this.showingWarning) {
    var warning =
    '<div class="message message--error message--small">' +
      'You entered a date that\'s outside the selected transaction period. ' +
      'Please enter a receipt date from ' +
      '<strong>' + this.minYear + '-' + this.maxYear + '</strong>' +
    '</div>';
    this.$maxDate.after(warning);
    this.showingWarning = true;
  }
};

DateFilter.prototype.hideWarning = function() {
  if (this.showingWarning) {
    this.$body.find('.message').remove();
    this.showingWarning = false;
  }
};

module.exports = {DateFilter: DateFilter};
