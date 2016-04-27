'use strict';

/* global API_LOCATION, API_VERSION, API_KEY */

var $ = require('jquery');
var URI = require('urijs');
var _ = require('underscore');

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
      return '<span>"' + datum.id + '"</span>';
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
  this.$field.on('typeahead:selected', this.handleSelect.bind(this));
  this.$field.on('typeahead:autocomplete', this.handleAutocomplete.bind(this));
  this.$field.on('blur', this.handleBlur.bind(this));
  this.$field.on('keyup', this.handleKeypress.bind(this));
  this.$button.on('click', this.handleSubmit.bind(this));
  if (this.allowText) {
    this.$field.typeahead({minLength: 3}, textDataset, this.dataset);
  } else {
    this.$field.typeahead({minLength: 3}, this.dataset);
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
};

TypeaheadFilter.prototype.handleAutocomplete = function(e, datum) {
  this.datum = datum;
};

TypeaheadFilter.prototype.handleKeypress = function(e) {
  if (e.keyCode === 13) {
    this.handleSubmit(e);
  }
};

TypeaheadFilter.prototype.selectFirstItem = function(e) {
  // Hack to select the first item in the list
  // Refactor to be less hacky if usability testing reveals it to be a good move
  this.$body.find('.tt-suggestion__name')[0].click();
  this.handleSelect(e, this.datum);
};

TypeaheadFilter.prototype.handleBlur = function() {
  // If the user starts typing but then leaves the field clear the input
  if (!this.datum && !this.allowText) {
    this.clearInput();
  }
};

TypeaheadFilter.prototype.handleSubmit = function(e) {
  if (this.datum) {
    this.handleSelect(e, this.datum);
  } else if (!this.datum && !this.allowText) {
    this.selectFirstItem(e);
  } else if (this.allowText && this.$field.typeahead('val').length > 0) {
    this.handleSelect(e, {id: this.$field.typeahead('val')});
  }
};

TypeaheadFilter.prototype.clearInput = function() {
  this.$field.typeahead('val', null).change();
};

TypeaheadFilter.prototype.handleChange = function() {
  // Clear the hidden datum value if the input is emptied
  if (this.$field.typeahead('val').length === 0) {
    this.datum = null;
  }
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
};

TypeaheadFilter.prototype.updateFilters = function(response) {
  var self = this;
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
};

module.exports = {TypeaheadFilter: TypeaheadFilter};
