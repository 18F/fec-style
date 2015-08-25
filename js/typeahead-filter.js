'use strict';

/* global require, module, window, document */

var $ = require('jquery');

var events = require('./events');

var TypeaheadFilter = function(selector, dataset) {
  var self = this;
  var dataset = dataset;

  self.$body = $(selector);

  self.$field = self.$body.find('input[type="text"]');
  self.fieldName = self.$field.attr('name');
  self.$selected = self.$body.find('.dropdown__selected');
  self.$field.on('typeahead:selected', this.handleSelect.bind(this));
  self.$field.typeahead({}, dataset);
}

TypeaheadFilter.prototype.handleSelect = function(e, datum) {
  var name = this.fieldName;
  var label = e.currentTarget.value;
  var value = datum.id;
  var id = value + '-checkbox';
  this.$selected
    .append('<li><input ' + 
            ' name="' + name + '"' +
            ' type="checkbox"' +
            ' id="' + id + '"' +
            ' value="' + value + '" checked>' + 
            '<label for="' + id + '">' + label + '</li>');
  this.$field.val(id).change();
  this.clearInput();
}

TypeaheadFilter.prototype.clearInput = function() {
  this.$field.typeahead('val', null);
}

module.exports = {
  TypeaheadFilter: TypeaheadFilter,
};
