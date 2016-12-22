'use strict';

var $ = require('jquery');
var _ = require('underscore');
var URI = require('urijs');

var TextFilter = require('./text-filter').TextFilter;
var CheckboxFilter = require('./checkbox-filter').CheckboxFilter;
var MultiFilter = require('./multi-filter').MultiFilter;
var TypeaheadFilter = require('./typeahead-filter').TypeaheadFilter;
var SelectFilter = require('./select-filter').SelectFilter;
var DateFilter = require('./date-filter').DateFilter;
var ElectionFilter = require('./election-filter').ElectionFilter;
var ToggleFilter = require('./toggle-filter').ToggleFilter;
var RangeFilter = require('./range-filter').RangeFilter;

function FilterSet(elm) {
  this.$body = $(elm);
  $(document.body).on('tag:removed', this.handleTagRemove.bind(this));
  this.$body.on('filters:validation', this.handleValidation.bind(this));
  this.filters = {};
  this.fields = [];
  this.isValid = true;
}

var filterMap = {
  'text': TextFilter,
  'checkbox': CheckboxFilter,
  'date': DateFilter,
  'typeahead': TypeaheadFilter,
  'election': ElectionFilter,
  'multi': MultiFilter,
  'select': SelectFilter,
  'toggle': ToggleFilter,
  'range': RangeFilter,
};

FilterSet.prototype.buildFilter = function($elm) {
  var filterType = $elm.attr('data-filter');
  var F = filterMap[filterType].constructor;
  return new F($elm);
};

FilterSet.prototype.activate = function() {
  var self = this;
  var query = URI.parseQuery(window.location.search);
  if (_.isEmpty(this.filters)) {
    this.filters = _.chain(this.$body.find('.js-filter'))
      .map(function(elm) {
        var filter = self.buildFilter($(elm)); // .fromQuery(query);
        return [filter.name, filter];
      })
      .object()
      .value();
    this.fields = _.chain(this.filters)
      .pluck('fields')
      .flatten()
      .value();
  }
  _.each(this.filters, function(filter) {
    filter.fromQuery(query);
  });
  return this;
};

FilterSet.prototype.serialize = function() {
  return _.reduce(this.$body.find('input,select').serializeArray(), function(memo, val) {
    if (val.value && val.name.slice(0, 1) !== '_') {
      if (memo[val.name]) {
        memo[val.name].push(val.value);
      } else{
        memo[val.name] = [val.value];
      }
    }
    return memo;
  }, {});
};

FilterSet.prototype.clear = function() {
  _.each(this.filters, function(filter) {
    filter.setValue();
  });
};

FilterSet.prototype.handleTagRemove = function(e, opts) {
  var $input = this.$body.find('#' + opts.key);
  var type = $input.get(0).type;

  if (type === 'checkbox' || type === 'radio') {
    $input.click();
  } else if (type === 'text') {
    $input.val('').trigger('change');
  }
};

FilterSet.prototype.handleValidation = function(e, opts) {
  this.isValid = opts.isValid;
};

FilterSet.prototype.switchFilters = function(dataType) {
  // Save the current query for later
  var query = URI.parseQuery(window.location.search);
  var currentFilters = '.js-' + dataType + '-filters';
  var otherFilters = dataType == 'efiling' ? '.js-processed-filters' : '.js-efiling-filters';

  // Toggle visibility of filters
  this.$body.find(otherFilters).attr('aria-hidden', true);
  this.$body.find(currentFilters).attr('aria-hidden', false);
  this.$body.trigger('tag:removeAll');

  // If there was a previous query, activate filters
  if (this.previousQuery) {
    var previousQuery = this.previousQuery;
    _.each(this.filters, function(filter) {
      // Set the value if it's in the current filter set
      if (filter.$elm.closest('.js-' + dataType + '-filters').length > 0) {
        filter.fromQuery(previousQuery);
      }
    });
  }

  // Store the previous query for future reference
  this.previousQuery = query;
};

module.exports = {FilterSet: FilterSet};
