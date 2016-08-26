'use strict';

var $ = require('jquery');
window.$ = window.jQuery = $;

var Filter = require('./filter-base.js').Filter;

/* ToggleFilter that has to fire a custom event */
function ToggleFilter(elm) {
  Filter.call(this, elm);
}

ToggleFilter.prototype = Object.create(Filter.prototype);
ToggleFilter.constructor = ToggleFilter;

ToggleFilter.prototype.fromQuery = function(query) {
  this.$elm.find('input[value="' + query.data_type + '"]').prop('checked', true).change();
};

ToggleFilter.prototype.handleChange = function(e) {
  var value = $(e.target).val();
  var id = this.$input.attr('id');
  var eventName = this.loadedOnce ? 'filter:renamed' : 'filter:added';
  this.$elm.trigger(eventName, [
    {
      key: id,
      value: 'Data type: ' + value,
      loadedOnce: this.loadedOnce,
      name: this.name,
      nonremovable: true
    }
  ]);

  this.loadedOnce = true;
};

module.exports = {ToggleFilter: ToggleFilter};
