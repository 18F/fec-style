'use strict';

/* global require, window, describe, before, beforeEach, afterEach, it */

var $ = require('jquery');
var _ = require('underscore');

window.$ = window.jQuery = $;
_.extend(window, {
  API_LOCATION: '',
  API_VERSION: '/v1',
});

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var typeahead = require('../js/typeahead');

var TypeaheadFilter = require('../js/typeahead-filter').TypeaheadFilter;

describe('typeaheadFilter', function() {
  before(function() {
    this.$fixture = $('<div id="fixtures"></div>');
    $('body').append(this.$fixture);
  });

  beforeEach(function() {
    this.$fixture.empty().append(
      '<div class="js-typeahead-filter" data-dataset="committees">' +
        '<ul class="dropdown__selected"></ul>' +
        '<input type="text" name="committee_id">' +
        '<button type="button"></button>' +
      '</div>'
    );

    this.typeaheadFilter = new TypeaheadFilter('.js-typeahead-filter', typeahead.datasets.committees, true);
  });

  it('should initialize', function() {
    var typeahead = this.typeaheadFilter.$body.find('.twitter-typeahead');
    expect(typeahead.length).to.equal(1);
  });

  it('should set firstItem', function() {
    this.typeaheadFilter.setFirstItem({}, {id: 'smith'});
    expect(this.typeaheadFilter.firstItem.id).to.equal('smith');
  });

  it('should append checkbox and clear datum on typeahead:select', function() {
    var appendCheckbox = sinon.spy(this.typeaheadFilter, 'appendCheckbox');
    var datum = {
      name: 'FAKE CANDIDATE',
      id: '12345',
      office: 'Senate'
    };
    this.typeaheadFilter.handleSelect({}, datum);

    expect(appendCheckbox).to.have.been.calledWith({
      name: 'committee_id',
      label: 'FAKE CANDIDATE (12345)',
      value: '12345',
      id: 'committee_id-12345-checkbox'
    });
    expect(this.typeaheadFilter.datum).to.equal(null);

    this.typeaheadFilter.appendCheckbox.restore();
  });

  it('should set this.datum on typeahead:autocomplte', function() {
    this.typeaheadFilter.handleAutocomplete({}, {id: '12345'});
    expect(this.typeaheadFilter.datum).to.deep.equal({id: '12345'});
  });

  it('should submit on enter', function() {
    var handleSubmit = sinon.spy(this.typeaheadFilter, 'handleSubmit');
    this.typeaheadFilter.handleKeypress({keyCode: 13});
    expect(handleSubmit).to.have.been.calledWith({keyCode: 13});
    this.typeaheadFilter.handleSubmit.restore();
  });

  it('should clear the input on blur if it does not allow free text', function() {
    this.typeaheadFilter.datum = null;
    this.typeaheadFilter.allowText = false;
    this.typeaheadFilter.$field.focus();
    this.typeaheadFilter.$field.typeahead('val','text');
    this.typeaheadFilter.$field.blur();
    expect(this.typeaheadFilter.$field.typeahead('val')).to.equal('');
  });

  it('should enable and disable button when the input changes', function() {
    var enableButton = sinon.spy(this.typeaheadFilter, 'enableButton');
    var disableButton = sinon.spy(this.typeaheadFilter, 'disableButton');

    this.typeaheadFilter.$field.typeahead('val', 'FAKE CANDIDATE').change();
    expect(enableButton).to.have.been.called;

    this.typeaheadFilter.$field.typeahead('val', '').change();
    expect(disableButton).to.have.been.called;

    this.typeaheadFilter.enableButton.restore();
    this.typeaheadFilter.disableButton.restore();
  });

  it('should clear input', function() {
    this.typeaheadFilter.$field.val('hello');
    this.typeaheadFilter.enableButton();
    this.typeaheadFilter.clearInput();
    expect(this.typeaheadFilter.$field.val()).to.equal('');
    expect(this.typeaheadFilter.$button.hasClass('is-disabled')).to.be.true;
  });

  it('should enable the search button', function() {
    this.typeaheadFilter.enableButton();
    expect(this.typeaheadFilter.searchEnabled).to.be.true;
    expect(this.typeaheadFilter.$button.hasClass('is-disabled')).to.be.false;
  });

  it('should disable the search button', function() {
    this.typeaheadFilter.disableButton();
    expect(this.typeaheadFilter.searchEnabled).to.be.false;
    expect(this.typeaheadFilter.$button.hasClass('is-disabled')).to.be.true;
  });

  describe('handleSubmit()', function() {
    beforeEach(function() {
      this.handleSelect = sinon.spy(this.typeaheadFilter, 'handleSelect');
      this.e = {name: 'event'};
    });

    it('should select this.datum if present', function() {
      this.typeaheadFilter.datum = {id: '12345'};
      this.typeaheadFilter.handleSubmit(this.e);
      expect(this.handleSelect).to.have.been.called;
    });

    it('should select this.firstItem if no datum and it does not allow text', function() {
      this.typeaheadFilter.datum = null;
      this.typeaheadFilter.allowText = false;
      this.typeaheadFilter.firstItem = {id: 'firstItem'};
      this.typeaheadFilter.handleSubmit(this.e);
      expect(this.handleSelect).to.have.been.calledWith(this.e, {id: 'firstItem'});
    });

    it('should select the free text input if present', function() {
      this.typeaheadFilter.allowText = true;
      this.typeaheadFilter.$field.typeahead('val', 'freetext');
      this.typeaheadFilter.handleSubmit(this.e);
      expect(this.handleSelect).to.have.been.calledWith(this.e, {id: 'freetext'});
    });

    afterEach(function() {
      this.typeaheadFilter.handleSelect.restore();
    });
  });
});
