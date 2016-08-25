'use strict';

var $ = require('jquery');
var _ = require('underscore');

var FilterControl = require('./filter-control').FilterControl;

function ensureArray(value) {
  return _.isArray(value) ? value : [value];
}

function prepareValue($elm, value) {
  return $elm.attr('type') === 'checkbox' ?
    ensureArray(value) :
    value;
}

function Filter(elm) {
  this.$elm = $(elm);
  this.$input = this.$elm.find('input:not([name^="_"])');
  this.$filterLabel = this.$elm.closest('.accordion__content').prev();

  // on error message, click to open feedback panel
  this.$elm.on('click', '.js-filter-feedback', function () {
    $(document.body).trigger('feedback:open');
  });

  this.name = this.$elm.data('name') || this.$input.attr('name');
  this.fields = [this.name];
  this.lastAction;

  $(document.body).on('filter:added', this.handleAddEvent.bind(this));
  $(document.body).on('filter:removed', this.handleRemoveEvent.bind(this));
  $(document.body).on('filter:changed', this.setLastAction.bind(this));

  if (this.$elm.hasClass('js-filter-control')) {
    new FilterControl(this.$elm);
  }
}

Filter.prototype.fromQuery = function(query) {
  this.setValue(query[this.name]);
  this.loadedOnce = true;
  return this;
};

Filter.prototype.setValue = function(value) {
  var $input = this.$input.data('temp') ?
    this.$elm.find('#' + this.$input.data('temp')) :
    this.$input;
  $input.val(prepareValue($input, value)).change();
  return this;
};

Filter.prototype.formatValue = function($input, value) {
  var prefix = $input.data('prefix');
  var suffix = $input.data('suffix');

  if (prefix) {
    prefix = prefix === '$' ? prefix : prefix + ' ';
    value = prefix + ' ' + value;
  }
  if (suffix) {
    value = value + ' ' + suffix;
  }

  return value;
};

Filter.prototype.handleAddEvent = function(e, opts) {
  if (opts.name !== this.name) { return; }

  var filterCount = this.$filterLabel.find('.filter-count');

  if (filterCount.html()) {
    filterCount.html(parseInt(filterCount.html(), 10) + 1);
  }
  else {
    this.$filterLabel.append(' <span class="filter-count">1</span>');
  }

  this.setLastAction(e, opts);
};

Filter.prototype.handleRemoveEvent = function(e, opts) {
  // Don't decrement on initial page load
  if (opts.name !== this.name || opts.loadedOnce !== true) { return; }

  var filterCount = this.$filterLabel.find('.filter-count');

  if (filterCount.html() === '1') {
    filterCount.remove();
  }
  else {
    filterCount.html(parseInt(filterCount.html(), 10) - 1);
  }

  this.setLastAction(e, opts);
};

Filter.prototype.setLastAction = function(e, opts) {
  if (opts.name !== this.name) { return; }

  if (e.type === 'filter:added') {
    this.lastAction = 'Filter added';
  } else if (e.type === 'filter:removed') {
    this.lastAction = 'Filter removed';
  } else {
    this.lastAction = 'Filter changed';
  }
};

Filter.prototype.disable = function() {
  this.$elm.find('input, label, button, .label').each(function() {
    var $this = $(this);
    $this.addClass('is-disabled').prop('disabled', true);
    // Disable the tag if it's checked
    if ($this.is(':checked')) {
      $this.trigger('filter:disabled', {
        key: $this.attr('id')
      });
    }
  });
  this.isEnabled = false;
};

Filter.prototype.enable = function() {
  this.$elm.find('input, label, button, .label').each(function() {
    var $this = $(this);
    $this.removeClass('is-disabled').prop('disabled', false);
    $this.trigger('filter:enabled', {
        key: $this.attr('id')
      });
  });
  this.isEnabled = true;
};

/* MultiFilters used when there are multiple filters that share the
 * same name attribute
*/

function MultiFilter(elm) {
  Filter.call(this, elm);
  this.$group = $(this.$elm.data('filter-group'));
  this.$input = this.$group.find('input[name=' + this.name + ']');
}

MultiFilter.prototype = Object.create(Filter.prototype);
MultiFilter.constructor = MultiFilter;

// This is a temporary override for the calendar filters to not show filter count
// Because this filter has multiple inputs with the same name,
// the filter count gets updated for each one,
// resulting in inflated numbers.
MultiFilter.prototype.handleAddEvent = function() { return; };

module.exports = {
  Filter: Filter,
  MultiFilter: MultiFilter,
  ensureArray: ensureArray,
  prepareValue: prepareValue
};

