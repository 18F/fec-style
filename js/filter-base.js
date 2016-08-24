'use strict';

var $ = require('jquery');
var _ = require('underscore');

var KEYCODE_ENTER = 13;
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
  this.$body = $(elm);
  this.$input = this.$body.find('input:not([name^="_"])');
  this.$remove = this.$body.find('.button--remove');
  this.$inputFilter = this.$body.find('.input--removable input');
  this.$inputFilterButton = this.$body.find('.button--go');
  this.$filterLabel = this.$body.closest('.accordion__content').prev();

  this.$input.on('change', this.handleChange.bind(this));
  this.$input.on('keydown', this.handleKeydown.bind(this));
  this.$remove.on('click', this.handleClear.bind(this));
  this.$inputFilter.on('keyup', this.handleInputFilterKeyup.bind(this));
  this.$inputFilterButton.on('click', this.handleInputFilterClick.bind(this));

  // on error message, click to open feedback panel
  this.$body.on('click', '.js-filter-feedback', function () {
    $(document.body).trigger('feedback:open');
  });

  this.name = this.$body.data('name') || this.$input.attr('name');
  this.fields = [this.name];
  this.lastAction;

  $(document.body).on('filter:modify', this.handleModifyEvent.bind(this));
  $(document.body).on('filter:added', this.handleAddEvent.bind(this));
  $(document.body).on('filter:removed', this.handleRemoveEvent.bind(this));
  $(document.body).on('filter:changed', this.setLastAction.bind(this));

  if (this.$body.hasClass('js-filter-control')) {
    new FilterControl(this.$body);
  }

  if (this.$input.data('inputmask')) {
    this.$input.inputmask();
  }
}

Filter.prototype.fromQuery = function(query) {
  this.setValue(query[this.name]);
  this.loadedOnce = true;
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

// text input (no typeahead) keypress
Filter.prototype.handleInputFilterKeyup = function() {
  this.$inputFilterButton.removeClass('is-disabled');
};

// text input (no typeahead) button click
Filter.prototype.handleInputFilterClick = function() {
  if (!this.$inputFilterButton.hasClass('is-disabled')) {
    this.$input.change();
  }
};

Filter.prototype.handleKeydown = function(e) {
  if (e.which === KEYCODE_ENTER) {
    e.preventDefault();
    this.$input.change();
  }
};

Filter.prototype.handleModifyEvent = function() {};

Filter.prototype.handleChange = function(e) {
  var $input = $(e.target);
  var type = $input.attr('type') || 'text';
  var prefix = $input.data('prefix');
  var suffix = $input.data('suffix');
  var id = $input.attr('id');
  var loadedOnce,
      eventName,
      value;

  this.$remove.css('display', $input.val() ? 'block' : 'none');

  if (type === 'checkbox' || type === 'radio') {
    var $label = this.$body.find('label[for="' + id + '"]');
    loadedOnce = $input.data('loaded-once') || false;
    eventName = $input.is(':checked') ? 'filter:added' : 'filter:removed';
    value = $label.text();

    if (loadedOnce) {
      $label.addClass('is-loading');

      // dropdown loading status
      if ($input.parent().hasClass('dropdown__item')) {
        this.$body.find('button[data-name="' + $input.attr('name') + '"]').addClass('is-loading');
      }
    }
  }
  else if (type === 'text') {
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
      this.$inputFilterButton.addClass('is-loading');

      // trigger button loading state on side by side range inputs
      // because min input doesn't have button within js-filter
      if ($input.parent().hasClass('range__input')) {
        this.$body.parent().find('.button--go').addClass('is-loading');
      }
    }

    if (value) {
      this.$inputFilterButton.removeClass('is-disabled');
    }
  } else {
    return;
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
  this.$body.find('input, label, button, .label').each(function() {
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
  this.$body.find('input, label, button, .label').each(function() {
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
  this.$group = $(this.$body.data('filter-group'));
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

