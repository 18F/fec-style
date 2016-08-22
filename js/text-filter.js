'use strict';

var $ = require('jquery');
var Filter = require('./filter-base.js').Filter;

var KEYCODE_ENTER = 13;

function TextFilter(elm) {
  Filter.call(this, elm);

  this.$submit = this.$elm.find('button');

  this.$input.on('change', this.handleChange.bind(this));
  this.$input.on('keydown', this.handleKeydown.bind(this));
  this.$input.on('keyup', this.handleInputFilterKeyup.bind(this));
  this.$submit.on('click', this.handleInputFilterClick.bind(this));


  if (this.$input.data('inputmask')) {
    this.$input.inputmask();
  }
}


TextFilter.prototype = Object.create(Filter.prototype);
TextFilter.constructor = TextFilter;

TextFilter.prototype.handleChange = function(e) {
  var $input = $(e.target);
  var prefix = $input.data('prefix');
  var suffix = $input.data('suffix');
  var id = $input.attr('id');
  var loadedOnce,
      eventName,
      value;

  value = $input.val();
  loadedOnce = $input.data('loaded-once') || false;

  // set focus to button
  $input.next().focus();

  if ($input.data('had-value') && value.length > 0) {
    eventName = 'filter:renamed';
  } else if (value.length > 0) {
    eventName = 'filter:added';
    $input.data('had-value', true);
  } else {
    eventName = 'filter:removed';
    $input.data('had-value', false);
  }

  if (loadedOnce) {
    this.$submit.addClass('is-loading');
  }

  if (value) {
    this.$submit.removeClass('is-disabled');
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

TextFilter.prototype.handleKeydown = function(e) {
  if (e.which === KEYCODE_ENTER) {
    e.preventDefault();
    this.$input.change();
  }
};

TextFilter.prototype.handleClear = function() {
  this.setValue();
  this.$input.focus();
};

// text input (no typeahead) keypress
TextFilter.prototype.handleInputFilterKeyup = function() {
  this.$submit.removeClass('is-disabled');
};

// text input (no typeahead) button click
TextFilter.prototype.handleInputFilterClick = function() {
  if (!this.$submit.hasClass('is-disabled')) {
    this.$input.change();
  }
};

module.exports = {TextFilter: TextFilter};
