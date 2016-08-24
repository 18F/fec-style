'use strict';

var Filter = require('./filter-base');

function RangeFilter(elm) {
  Filter.Filter.call(this, elm);

  this.id = this.$input.attr('id');

  this.$submit = this.$elm.find('button');

  this.$input.on('change', this.handleChange.bind(this));
  this.$input.on('keyup', this.handleKeyup.bind(this));
  this.$submit.on('click', this.handleClick.bind(this));

  if (this.$input.data('inputmask')) {
    this.$input.inputmask();
  }
}

RangeFilter.prototype = Object.create(Filter.Filter.prototype);
RangeFilter.constructor = RangeFilter;

RangeFilter.prototype.handleChange = function() {
  var prefix = this.$input.data('prefix');
  var suffix = this.$input.data('suffix');
  var value = this.$input.val();
  var loadedOnce = this.$input.data('loaded-once') || false;
  var eventName;

  // set focus to button
  this.$submit.focus();
  if (this.$input.data('had-value') && value.length > 0) {
    eventName = 'filter:renamed';
  } else if (value.length > 0) {
    eventName = 'filter:added';
    this.$input.data('had-value', true);
  } else {
    eventName = 'filter:removed';
    this.$input.data('had-value', false);
  }

  if (value.length > 0) {
    this.$submit.removeClass('is-disabled');
  } else {
    this.$submit.addClass('is-disabled');
  }

  if (prefix) {
    prefix = prefix === '$' ? prefix : prefix + ' ';
    value = prefix + ' ' + value;
  }

  if (suffix) {
    value = value + ' ' + suffix;
  }

  if (loadedOnce) {
    this.$submit.addClass('is-loading');
  }

  this.$input.trigger(eventName, [
    {
      key: this.id,
      value: value,
      loadedOnce: loadedOnce,
      name: this.name
    }
  ]);

  this.$input.data('loaded-once', true);
};

RangeFilter.prototype.handleKeyup = function() {
  this.$submit.removeClass('is-disabled');
};

RangeFilter.prototype.handleClick = function() {
  if (!this.$submit.hasClass('is-disabled')) {
    this.$input.change();
  }
};

module.exports = {RangeFilter: RangeFilter};
