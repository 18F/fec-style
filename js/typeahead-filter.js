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

var TypeaheadFilter = function(selector, dataset) {
  this.$body = $(selector);
  this.dataset = dataset;

  this.$field = this.$body.find('input[type="text"]');
  this.fieldName = this.$field.attr('name');
  this.$selected = this.$body.find('.dropdown__selected');
  this.$field.on('typeahead:selected', this.handleSelect.bind(this));
  this.$field.on('change', this.handleChange.bind(this));
  this.$field.typeahead({minLength: 3}, this.dataset);
};

TypeaheadFilter.prototype.handleSelect = function(e, datum) {
  this.appendCheckbox({
    name: this.fieldName,
    label: e.currentTarget.value,
    value: datum.id,
    id: datum.id + '-checkbox'
  });
};

TypeaheadFilter.prototype.handleChange = function(e) {
  var value = e.target.value;
  if (!value || this.$body.find('.tt-suggestions').length) {
    return;
  }
  var values = this.$body.find('input[type="checkbox"]').map(function(idx, elm) {
    return elm.value;
  }).get();
  if (values.indexOf(value) === -1) {
    this.appendCheckbox({
      name: this.fieldName,
      label: value,
      value: value,
      id: slugify(value) + '-checkbox'
    });
  }
};

TypeaheadFilter.prototype.clearInput = function() {
  this.$field.typeahead('val', null).change();
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
    self.$body.find('label[for="' + result[idKey] + '-checkbox"]').text(result.name);
    self.$body.find('#' + result[idKey] + '-checkbox').trigger('filter:renamed', [
      {
        key: result[idKey] + '-checkbox',
        value: result.name
      }
    ]);
  });
};

module.exports = {TypeaheadFilter: TypeaheadFilter};
