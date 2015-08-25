'use strict';

/* global require, module, window, document */

var $ = require('jquery');

var events = require('./events');

var TypeaheadFilter = function(selector, dataset) {
  var self = this;
  var dataset = dataset;

  self.$body = $(selector);

  self.$body.prepend('<ul class="dropdown__selected"></ul>');

  self.$field = self.$body.find('input[type="text"]');
  self.fieldName = self.$field.attr('name');
  self.$selected = self.$body.find('.dropdown__selected');
  self.$hiddenField = self.$body.append('<input type="hidden" name="' +
                                        self.hiddenFieldName + '"' +
                                        'id="committee_id">');
  self.$field.on('typeahead:selected', this.handleSelect.bind(this));
  self.$field.typeahead({}, dataset);
}

TypeaheadFilter.prototype.handleSelect = function(e, datum) {
  var name = this.fieldName;
  var label = e.currentTarget.value;
  var value = datum.id;
  var id = value + '-checkbox';
  this.$selected
    .append('<li class="dropdown__item"><input ' + 
            ' name="' + name + '"' +
            ' type="checkbox"' +
            ' id="' + id + '"' +
            ' value="' + value + '">' + 
            '<label class="dropdown__value" for="' + id + '">' + label + '</li>');
  this.clearInput();
}

TypeaheadFilter.prototype.clearInput = function() {
  this.$field.typeahead('val', null);
}

module.exports = {
  TypeaheadFilter: TypeaheadFilter,
};
