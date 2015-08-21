'use strict';

/* global require, module, window, document, Bloodhound, API_LOCATION, API_VERSION, API_KEY */

var $ = require('jquery');
var URI = require('URIjs');
var _ = require('underscore');
var Handlebars = require('handlebars');

require('typeahead.js');

var events = require('./events');

var officeMap = {
  H: 'House',
  S: 'Senate',
  P: 'President'
};

function formatCandidate(result) {
  return {
    name: result.name,
    id: result.id,
    office: officeMap[result.office_sought]
  };
}

function getUrl(resource) {
  return URI(API_LOCATION)
    .path([API_VERSION, 'names', resource].join('/'))
    .query({
      q: '%QUERY',
      api_key: API_KEY
    })
    .readable();
}

var engineOpts = {
  datumTokenizer: function(datum) {
    return Bloodhound.tokenizers.whitespace(datum.name);
  },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  limit: 10
};

function createEngine(opts) {
  var engine = new Bloodhound(_.extend({}, engineOpts, opts));
  engine.initialize();
  return engine;
}

var candidateEngine = createEngine({
  name: 'Candidates',
  remote: {
    url: getUrl('candidates'),
    filter: function(response) {
      return _.map(response.results, formatCandidate);
    }
  }
});

var committeeEngine = createEngine({
  name: 'Committees',
  remote: {
    url: getUrl('committees'),
    filter: function(response) {
      return response.results;
    },
    dupDetector: function(remote, local) {
      return remote.name === local.name;
    }
  }
});

var candidateDataset = {
  name: 'candidate',
  displayKey: 'name',
  source: candidateEngine.ttAdapter(),
  templates: {
    suggestion: Handlebars.compile(
      '<span>' +
        '<span class="tt-suggestion__name">{{ name }}</span>' +
        '<span class="tt-suggestion__office">{{ office }}</span>' +
      '</span>'
    )
  }
};

var committeeDataset = {
  name: 'committee',
  displayKey: 'name',
  source: committeeEngine.ttAdapter(),
  templates: {
    suggestion: Handlebars.compile(
      '<span class="tt-suggestion__name">{{ name }}</span>'
    )
  }
};

var datasets = {
  candidates: candidateDataset,
  committees: committeeDataset
};

var typeaheadOpts = {
  minLength: 3,
  highlight: true,
  hint: false
};

function Typeahead(selector, type, url) {
  this.$input = $(selector);
  this.url = url || '/';
  this.typeahead = null;

  this.init(type || 'candidates');

  events.on('searchTypeChanged', this.handleChangeEvent.bind(this));
}

Typeahead.prototype.init = function(type) {
  if (this.typeahead) {
    this.$input.typeahead('destroy');
  }
  this.typeahead = this.$input.typeahead(typeaheadOpts, datasets[type]);
  this.$input.on('typeahead:selected', this.select.bind(this));
  $('.twitter-typeahead').css('display', 'block');
};

Typeahead.prototype.handleChangeEvent = function(data) {
  this.init(data.type);
};

Typeahead.prototype.select = function(event, datum, name) {
  window.location = this.url + name + '/' + datum.id;
};

module.exports = {Typeahead: Typeahead};
