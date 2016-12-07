'use strict';

var $ = require('jquery');
var Filter = require('./filter-base.js').Filter;
var CheckboxFilter = require('./checkbox-filter').CheckboxFilter;

/* MultiFilters used when there are multiple filters that share the
 * same name attribute
*/

function MultiFilter(elm) {
  Filter.call(this, elm);
  this.$subfilters = this.$elm.find('.js-sub-filter[data-name="' + this.name + '"]');

  this.$subfilters.each(function() {
    new CheckboxFilter(this);
  });
}

MultiFilter.prototype = Object.create(Filter.prototype);
MultiFilter.constructor = MultiFilter;

module.exports = {
  MultiFilter: MultiFilter
};
