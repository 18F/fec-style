'use strict';

var $ = require('jquery');

var Filter = require('./filter-base.js').Filter;

function CheckboxFilter(elm) {
  Filter.call(this, elm);

  this.$elm.on('change', this.handleChange.bind(this));
}

CheckboxFilter.prototype = Object.create(Filter.prototype);
CheckboxFilter.constructor = CheckboxFilter;

CheckboxFilter.prototype.handleChange = function(e) {
  var $input = $(e.target);
  var prefix = $input.data('prefix');
  var suffix = $input.data('suffix');
  var id = $input.attr('id');
  var loadedOnce,
      eventName,
      value;

  var $label = this.$elm.find('label[for="' + id + '"]');
  loadedOnce = $input.data('loaded-once') || false;
  eventName = $input.is(':checked') ? 'filter:added' : 'filter:removed';
  value = $label.text();

  if (loadedOnce) {
    $label.addClass('is-loading');

    // dropdown loading status
    if ($input.parent().hasClass('dropdown__item')) {
      this.$elm.find('button[data-name="' + $input.attr('name') + '"]').addClass('is-loading');
    }
  }

  if (prefix) {
    value = prefix + ' ' + value;
  }
  if (suffix) {
    value = value + ' ' + suffix;
  }

  $input.trigger(eventName, [
    {
      key: id,
      value: value,
      loadedOnce: loadedOnce,
      name: this.name
    }
  ]);

  $input.data('loaded-once', true);
};

module.exports = {CheckboxFilter: CheckboxFilter};
