'use strict';

var $ = require('jquery');

function FilterControl($selector) {
  this.$body = $selector;
  this.modifiesFilter = this.$body.data('modifies-filter');
  this.modifiesProperty = this.$body.data('modifies-property');
  this.getValue();

  this.controlledFilter = $('#' + this.$body.data('controls'));
  this.$body.on('change', this.handleChange.bind(this));
}

FilterControl.prototype.getValue = function() {
  var values = [];
  this.$body.find('input:checked').each(function() {
    values.push($(this).val());
  });
  this.values = values;
};

FilterControl.prototype.handleChange = function() {
  this.getValue();
  this.$body.trigger('filter:modify', [
    {
      filterName: this.modifiesFilter,
      filterProperty: this.modifiesProperty,
      filterValue: this.values
    }
  ]);
};

module.exports = {FilterControl: FilterControl};
