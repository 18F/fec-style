'use strict';

var $ = require('jquery');
var _ = require('underscore');

// Hack: Append jQuery to `window` for use by legacy libraries
window.$ = window.jQuery = $;

var typeahead = require('./typeahead');
var typeaheadFilter = require('./typeahead-filter');
var filterTags = require('./filter-tags');

var KEYCODE_ENTER = 13;

function ensureArray(value) {
  return _.isArray(value) ? value : [value];
}

function prepareValue($elm, value) {
  return $elm.attr('type') === 'checkbox' ?
    ensureArray(value) :
    value;
}

function Filter(elm) {
  this.$body = $(elm);
  this.$input = this.$body.find('input[name]');
  this.$remove = this.$body.find('.button--remove');

  this.tags = [];

  this.$input.on('change', this.handleChange.bind(this));
  this.$input.on('keydown', this.handleKeydown.bind(this));
  this.$remove.on('click', this.handleClear.bind(this));

  this.name = this.$body.data('name') || this.$input.attr('name');
  this.fields = [this.name];
}

Filter.build = function($elm) {
  if ($elm.hasClass('js-date-choice-field')) {
    return new DateFilter($elm);
  } else if ($elm.hasClass('js-typeahead-filter')) {
    return new TypeaheadFilter($elm);
  } else {
    return new Filter($elm);
  }
};

Filter.prototype.fromQuery = function(query) {
  this.setValue(query[this.name]);
  return this;
};

Filter.prototype.setValue = function(value) {
  var $input = this.$input.data('temp') ?
    this.$body.find('#' + this.$input.data('temp')) :
    this.$input;
  $input.val(prepareValue($input, value)).change();
  return this;
};

Filter.prototype.handleClear = function() {
  this.setValue();
  this.$input.focus();
};

Filter.prototype.handleKeydown = function(e) {
  if (e.which === KEYCODE_ENTER) {
    e.preventDefault();
    this.$input.change();
  }
};

Filter.prototype.handleChange = function(e) {
  this.toggleTags($(e.target));
  this.$remove.css('display', this.$input.val() ? 'block' : 'none');
};

Filter.prototype.toggleTags = function($input) {
  if ($input.attr('type') === 'checkbox' || 'radio') {
    $input.is(':checked') ? this.addTag($input) : this.removeTag($input);
  }

  if ($input.attr('type') === 'text') {
    $input.val().length > 0 ? this.addTag($input) : this.removeTag($input);
  }
};

Filter.prototype.addTag = function($input) {
  var tag = new filterTags.Tag($input, this);
  this.tags.push(tag);
  $('.js-tag-container').append(tag.$content);
};

Filter.prototype.removeTag = function($input) {
  if (this.tags.length > 0) {
    _.each(this.tags, function(tag) {
      if (tag.key === $input.attr('id')) {
        tag.remove();
      }
    });
  }
};

function DateFilter(elm) {
  Filter.call(this, elm);

  this.$minDate = this.$body.find('.js-min-date');
  this.$maxDate = this.$body.find('.js-max-date');
  this.$body.on('change', this.handleRadioChange.bind(this));

  this.fields = ['min_' + this.name, 'max_' + this.name];
}

DateFilter.prototype = Object.create(Filter.prototype);
DateFilter.constructor = DateFilter;

DateFilter.prototype.handleRadioChange = function(e) {
  var $input = $(e.target);
  if (!$input.is(':checked')) { return; }
  if ($input.attr('data-min-date')) {
    this.$minDate.val($input.data('min-date')).change();
    this.$maxDate.val($input.data('max-date')).change();
  }
};

DateFilter.prototype.fromQuery = function(query) {
  this.setValue([
    query['min_' + this.name],
    query['max_' + this.name]
  ]);
  return this;
};

DateFilter.prototype.setValue = function(value) {
  value = ensureArray(value);
  this.$minDate.val(value[0]);
  this.$maxDate.val(value[1]);
};

function TypeaheadFilter(elm) {
  Filter.call(this, elm);

  var key = this.$body.data('dataset');
  var dataset = typeahead.datasets[key];
  this.typeaheadFilter = new typeaheadFilter.TypeaheadFilter(this.$body, dataset);
}

TypeaheadFilter.prototype = Object.create(Filter.prototype);
TypeaheadFilter.constructor = TypeaheadFilter;

module.exports = {Filter: Filter};
