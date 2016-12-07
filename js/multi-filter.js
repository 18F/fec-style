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
    var subfilter = new CheckboxFilter(this);
    // Explicitly assign filterLabel, which will show the count
    // Necessary because each subfilter may be part of a different accordion
    subfilter.$filterLabel = $('#' + subfilter.$elm.data('filter-label'));
  });
}

MultiFilter.prototype = Object.create(Filter.prototype);
MultiFilter.constructor = MultiFilter;

module.exports = {
  MultiFilter: MultiFilter
};
