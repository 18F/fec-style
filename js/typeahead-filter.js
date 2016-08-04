'use strict';

/* global API_LOCATION, API_VERSION, API_KEY */

var $ = require('jquery');
var URI = require('urijs');
var _ = require('underscore');
var typeahead = require('./typeahead');

var ID_PATTERN = /^\w{9}$/;

function slugify(value) {
  return value
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9:._-]/gi, '');
}

function formatLabel(datum) {
  return datum.name ?
    datum.name + ' (' + datum.id + ')' :
    '"' + datum.id + '"';
}

var textDataset = {
  display: 'id',
  source: function(query, syncResults) {
    syncResults([{id: query}]);
  },
  templates: {
    suggestion: function(datum) {
      return '<span>Search for: "' + datum.id + '"</span>';
    }
  }
};

var TypeaheadFilter = function(selector, dataset, allowText) {
  this.$body = $(selector);
  this.dataset = dataset;
  this.allowText = allowText;

  this.$field = this.$body.find('input[type="text"]');
  this.fieldName = this.$body.data('name') || this.$field.attr('name');
  this.$button = this.$body.find('button');
  this.$selected = this.$body.find('.dropdown__selected');

  this.$body.on('change', 'input', this.handleChange.bind(this));
  this.$body.on('mouseenter', '.tt-suggestion', this.handleHover.bind(this));
  $('body').on('filter:modify', this.changeDataset.bind(this));

  this.$field.on('typeahead:selected', this.handleSelect.bind(this));
  this.$field.on('typeahead:autocomplete', this.handleAutocomplete.bind(this));
  this.$field.on('typeahead:render', this.setFirstItem.bind(this));
  this.$field.on('blur', this.handleBlur.bind(this));
  this.$field.on('keyup', this.handleKeypress.bind(this));
  this.$button.on('click', this.handleSubmit.bind(this));

  this.typeaheadInit();
  this.disableButton();
};

TypeaheadFilter.prototype.typeaheadInit = function() {
  var opts = {minLength: 3, hint: false, highlight: true};
  if (this.allowText && this.dataset) {
    this.$field.typeahead(opts, textDataset, this.dataset);
  } else if (this.allowText && !this.dataset) {
    this.$field.typeahead(opts, textDataset);
  } else {
    this.$field.typeahead(opts, this.dataset);
  }

  this.$body.find('.tt-menu').attr('aria-live', 'polite');
};

TypeaheadFilter.prototype.setFirstItem = function() {
  // Set the firstItem to a datum upon each rendering of results
  // This way clicking enter or the button will submit with this datum
  this.firstItem = arguments[1];
  // Add a hover class to the first item to indicate it will be selected
  $(this.$body.find('.tt-suggestion')[0]).addClass('tt-cursor');
  if (this.$body.find('.tt-suggestion').length > 0) {
    this.enableButton();
  }
};

TypeaheadFilter.prototype.handleSelect = function(e, datum) {
  this.appendCheckbox({
    name: this.fieldName,
    label: formatLabel(datum),
    value: datum.id,
    id: this.fieldName + '-' + slugify(datum.id) + '-checkbox'
  });
  this.datum = null;

  this.$button.addClass('is-loading');
};

TypeaheadFilter.prototype.handleAutocomplete = function(e, datum) {
  this.datum = datum;
};

TypeaheadFilter.prototype.handleKeypress = function(e) {
  this.handleChange();

  if (e.keyCode === 13) {
    this.handleSubmit(e);
  }
};

TypeaheadFilter.prototype.handleBlur = function() {
  // If the user starts typing but then leaves the field clear the input
  if (!this.datum && !this.allowText) {
    this.clearInput();
  }
};

TypeaheadFilter.prototype.handleChange = function() {
  if ((this.allowText && this.$field.typeahead('val').length > 1) || this.datum) {
    this.enableButton();
  } else if (this.$field.typeahead('val').length === 0 ||
    (!this.allowText && this.$field.typeahead('val').length < 3)) {
    this.datum = null;
    this.disableButton();
  }
};

TypeaheadFilter.prototype.handleHover = function() {
  this.$body.find('.tt-suggestion.tt-cursor').removeClass('tt-cursor');
};

TypeaheadFilter.prototype.handleSubmit = function(e) {
  if (this.datum) {
    this.handleSelect(e, this.datum);
  } else if (!this.datum && !this.allowText) {
    this.handleSelect(e, this.firstItem);
  } else if (this.allowText && this.$field.typeahead('val').length > 0) {
    this.handleSelect(e, {id: this.$field.typeahead('val')});
  }
};

TypeaheadFilter.prototype.clearInput = function() {
  this.$field.typeahead('val', null).change();
  this.disableButton();
};

TypeaheadFilter.prototype.enableButton = function() {
  this.searchEnabled = true;
  this.$button.removeClass('is-disabled').attr('tabindex', '1').attr('disabled', false);
};

TypeaheadFilter.prototype.disableButton = function() {
  this.searchEnabled = false;
  this.$button.addClass('is-disabled').attr('tabindex', '-1').attr('disabled', false);
};

TypeaheadFilter.prototype.checkboxTemplate = _.template(
  '<li>' +
    '<input ' +
      'id="{{id}}" ' +
      'name="{{name}}" ' +
      'value="{{value}}" ' +
      'type="checkbox" ' +
      'checked' +
    '/>' +
    '<label for="{{id}}">{{label}}</li>' +
  '</li>',
  {interpolate: /\{\{(.+?)\}\}/g}
);

TypeaheadFilter.prototype.appendCheckbox = function(opts) {
  if (this.$body.find('#' + opts.id).length) {
    return;
  }
  var checkbox = $(this.checkboxTemplate(opts));
  checkbox.appendTo(this.$selected);
  checkbox.find('input').change();
  this.clearInput();
};

TypeaheadFilter.prototype.getFilters = function(values) {
  var self = this;
  if (this.dataset) {
    var dataset = this.dataset.name + 's';
    var idKey = this.dataset.name + '_id';
    var ids = values.filter(function(value) {
      return ID_PATTERN.test(value);
    });
    values.forEach(function(value) {
      self.appendCheckbox({
        name: self.fieldName,
        id: slugify(value) + '-checkbox',
        value: value,
        label: ID_PATTERN.test(value) ? 'Loading...' : value
      });
    });
    if (ids.length) {
      $.getJSON(
        URI(API_LOCATION)
          .path([API_VERSION, dataset].join('/'))
          .addQuery('api_key', API_KEY)
          .addQuery(idKey, ids)
          .toString()
      ).done(this.updateFilters.bind(this));
    }
  }
};

TypeaheadFilter.prototype.updateFilters = function(response) {
  var self = this;
  if (this.dataset) {
    var idKey = this.dataset.name + '_id';
    response.results.forEach(function(result) {
      var label = result.name + ' (' + result[idKey] + ')';
      self.$body.find('label[for="' + result[idKey] + '-checkbox"]').text(label);
      self.$body.find('#' + result[idKey] + '-checkbox').trigger('filter:renamed', [
        {
          key: result[idKey] + '-checkbox',
          value: label
        }
      ]);
    });
  }
};

TypeaheadFilter.prototype.changeDataset = function(e, opts) {
  // Method for changing the typeahead suggestion on the "contributor name" filter
  // when the "individual" or "committee" checkbox filter is changed
  // If the modify event names this filter, destroy it
  if (opts.filterName === this.fieldName) {
    this.$field.typeahead('destroy');
    // If the value array is only individuals and not committees
    // set the dataset to empty and re-init
    if (opts.filterValue.indexOf('individual') > -1 && opts.filterValue.indexOf('committee') < 0) {
      this.dataset = null;
      this.allowText = true;
      this.typeaheadInit();
    } else {
      // Otherwise initialize with the committee dataset
      this.dataset = typeahead.datasets.committees;
      this.typeaheadInit();
    }
  }
};

module.exports = {TypeaheadFilter: TypeaheadFilter};
