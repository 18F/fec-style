'use strict';

/* global require, module, window, document, API_LOCATION, API_VERSION, API_KEY */

var $ = require('jquery');
var URI = require('URIjs');
var _ = require('underscore');

var TypeaheadFilter = function(selector, dataset) {
  var self = this;

  self.$body = $(selector);
  self.dataset = dataset;

  self.$field = self.$body.find('input[type="text"]');
  self.fieldName = self.$field.attr('name');
  self.$selected = self.$body.find('.dropdown__selected');
  self.$field.on('typeahead:selected', this.handleSelect.bind(this));
  self.$field.typeahead({}, this.dataset);
  $(window).on('load', this.getFilters.bind(this));
};

TypeaheadFilter.prototype.handleSelect = function(e, datum) {
  this.appendCheckbox({
    name: this.fieldName,
    label: e.currentTarget.value,
    value: datum.id,
    id: datum.id + '-checkbox'
  });
};

TypeaheadFilter.prototype.clearInput = function() {
  this.$field.typeahead('val', null);
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
  $(this.checkboxTemplate(opts)).appendTo(this.$selected);
  this.$field.val(opts.id).change();
  this.clearInput();
};

TypeaheadFilter.prototype.getFilters = function() {
  var self = this;
  var ids = this.$field.val().split(',');
  var dataset = this.dataset.name + 's';
  if (ids.length) {
    _.each(ids, function(id) {
      $.getJSON(
        URI(API_LOCATION)
          .path([API_VERSION, 'names', dataset].join('/'))
          .addQuery('api_key', API_KEY)
          .addQuery('q', id)
          .toString()
      ).done(function(response) {
        self.appendCheckbox({
          name: self.fieldName,
          id: id + '-checkbox',
          value: id,
          label: response.results[0].name
        });
      });
    });
  }
};

module.exports = {TypeaheadFilter: TypeaheadFilter};
