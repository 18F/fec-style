'use strict';

var $ = require('jquery');
var _ = require('underscore');
var URI = require('urijs');

var TextFilter = require('./text-filter').TextFilter;
var CheckboxFilter = require('./checkbox-filter').CheckboxFilter;
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

FilterSet.prototype.disableFilters = function(excludedFilters) {
  _.each(this.filters, function(filter) {
    if (excludedFilters.indexOf(filter.name) < 0) {
      filter.disable();
    }
  });
};

FilterSet.prototype.enableFilters = function() {
  _.each(this.filters, function(filter) {
    filter.enable();
  });
};

module.exports = {FilterSet: FilterSet};
