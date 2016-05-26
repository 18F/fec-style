'use strict';

var $ = require('jquery');

function FilterControl($selector) {
  this.$element = $selector;
  this.modifiesFilter = this.$element.data('modifies-filter');
  this.modifiesProperty = this.$element.data('modifies-property');

  this.controlledFilter = $('#' + this.$element.data('controls'));
  this.$element.on('change', this.handleChange.bind(this));
}

FilterControl.prototype.getValue = function() {
  var values = [];
  this.$element.find('input:checked').each(function() {
    values.push($(this).val());
  });
  return values;
};

FilterControl.prototype.handleChange = function() {
  this.$element.trigger('filter:modify', [
    {
      filterName: this.modifiesFilter,
      filterProperty: this.modifiesProperty,
      filterValue: this.getValue()
    }
  ]);
};

module.exports = {FilterControl: FilterControl};
