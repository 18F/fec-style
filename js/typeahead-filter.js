'use strict';

/* global require, module, window, document, API_LOCATION, API_VERSION, API_KEY */

var $ = require('jquery');
var URI = require('URIjs');
var _ = require('underscore');

var events = require('./events');

var TypeaheadFilter = function(selector, dataset) {
  var self = this;

  self.$body = $(selector);
  
  self.$field = self.$body.find('input[type="text"]');
  self.fieldName = self.$field.attr('name');
  self.dataset = dataset;
  self.$selected = self.$body.find('.dropdown__selected');
  self.$field.on('typeahead:selected', this.handleSelect.bind(this));
  self.$field.typeahead({}, this.dataset);
  $(window).on('load', this.getFilters.bind(this));
};

TypeaheadFilter.prototype.handleSelect = function(e, datum) {
  var name = this.fieldName;
  var label = e.currentTarget.value;
  var value = datum.id;
  var id = value + '-checkbox';
  this.appendField(name, id, value, label)
};

TypeaheadFilter.prototype.clearInput = function() {
  this.$field.typeahead('val', null);
};

TypeaheadFilter.prototype.appendField = function(name, id, value, label) {
  this.$selected
    .append('<li><input ' + 
            ' name="' + name + '"' +
            ' type="checkbox"' +
            ' id="' + id + '"' +
            ' value="' + value + '" checked>' + 
            '<label for="' + id + '">' + label + '</li>');
  this.$field.val(id).change();
  this.clearInput();
};

TypeaheadFilter.prototype.getFilters = function() {
  var self = this;
  var ids = this.$field.val().split(',');
  var dataset = this.dataset.name + 's';
  if ( ids.length ) {
    _.each(ids, function(id) {
      $.getJSON(
          URI(API_LOCATION)
          .path([API_VERSION, 'names', dataset].join('/'))
          .addQuery('api_key', API_KEY)
          .addQuery('q', id)
          .toString())
          .done(function(response) {
            var name = response.results[0].name;
            self.appendField('committee_id', id + '-checkbox', id, name);
          })
    })
  }
};

module.exports = {
  TypeaheadFilter: TypeaheadFilter,
};
