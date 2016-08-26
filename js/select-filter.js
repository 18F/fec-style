'use strict';

var $ = require('jquery');

var Filter = require('./filter-base.js').Filter;

function SelectFilter(elm) {
  Filter.call(this, elm);
  this.$input = this.$elm.find('select');
  this.name = this.$input.attr('name');
  this.requiredDefault = this.$elm.data('required-default') || null; // If a default is required
  this.loadedOnce = false;

  this.$input.on('change', this.handleChange.bind(this));
  this.setRequiredDefault();
}

SelectFilter.prototype = Object.create(Filter.prototype);
SelectFilter.constructor = SelectFilter;

SelectFilter.prototype.setRequiredDefault = function() {
  if (this.requiredDefault) {
    this.setValue(this.requiredDefault);
  }
};

SelectFilter.prototype.fromQuery = function(query) {
  this.setValue(query[this.name]);
};

SelectFilter.prototype.setValue = function(value) {
  this.$input.find('option[selected]').attr('selected','false');
  this.$input.find('option[value="' + value + '"]').attr('selected','true');
  this.$input.change();
};

SelectFilter.prototype.handleChange = function(e) {
  var value = $(e.target).val();
  var id = this.$input.attr('id');
  var eventName = this.loadedOnce ? 'filter:renamed' : 'filter:added';

  this.$input.trigger(eventName, [
    {
      key: id,
      value: 'Transaction period: ' + (value - 1) + '-' + value,
      loadedOnce: this.loadedOnce,
      name: this.name,
      nonremovable: true
    }
  ]);

  this.loadedOnce = true;
};

module.exports = {SelectFilter: SelectFilter};
