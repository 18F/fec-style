'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var $ = require('jquery');

require('./setup')();

var TagList = require('../js/filter-tags').TagList;

describe('filter tags', function() {
  before(function() {
    var $fixture = $('<div id="fixtures"></div>');
    $('body').append($fixture);
  });

  beforeEach(function() {
    this.$fixture = $('#fixtures');
    this.$fixture.empty();
    this.tagList = new TagList({title: 'tags'});
    this.tagList.$body.appendTo(this.fixture);
  });

  describe('constructor()', function() {
    it('creates elements', function() {
      expect(this.tagList.$list.find('li').length).to.equal(1);
      expect(this.tagList.$title.text()).to.equal('tags');
    });
  });

  describe('addTag()', function() {
    it('adds tag on invoke', function() {
      this.tagList.addTag({}, {key: 'name', value: 'timmy'});
      expect(this.tagList.$title.text()).to.equal('');
      var tag = this.tagList.$list.find('li[data-id="name"]');
      expect(tag.length).to.equal(1);
      expect(tag.text()).to.contain('timmy');
    });

    it('removes existing tags by key', function() {
      this.tagList.addTag({}, {key: 'name', value: 'timmy'});
      this.tagList.addTag({}, {key: 'name', value: 'kyle'});
      var tag = this.tagList.$list.find('li[data-id="name"]');
      expect(tag.length).to.equal(1);
      expect(tag.text()).to.contain('kyle');
    });

    it('adds tag on event', function() {
      $(document.body).trigger('filter:added', [{key: 'name', value: 'timmy'}]);
      var tag = this.tagList.$list.find('li[data-id="name"]');
      expect(tag.length).to.equal(1);
    });

    it('it does not add remove button if nonremovable is true', function(){
      $(document.body).trigger('filter:added', [{key: 'name', value: 'timmy', nonremovable: true}]);
      var tag = this.tagList.$list.find('li[data-id="name"]');
      expect(tag.find('button')).to.have.length(0);
    });
  });

  describe('removeTag()', function() {
    beforeEach(function() {
      sinon.spy($.prototype, 'trigger');
    });

    afterEach(function() {
      $.prototype.trigger.restore();
    });

    it('removes tag on invoke', function() {
      this.tagList.addTag({}, {key: 'name', value: 'timmy'});
      this.tagList.removeTag('name', true);
      var tag = this.tagList.$list.find('li[data-id="name"]');
      expect(tag.length).to.equal(0);
      expect(this.tagList.$title.text()).to.equal('tags');
      expect($.prototype.trigger).to.have.been.calledWith('tag:removed', [{key: 'name'}]);
    });

    it('removes tag on dom event', function() {
      this.tagList.addTag({}, {key: 'name', value: 'timmy'});
      var tag = this.tagList.$list.find('li[data-id="name"]');
      tag.find('.js-close').trigger('click');
      tag = this.tagList.$list.find('li[data-id="name"]');
      expect(tag.length).to.equal(0);
    });
  });

  describe('renameTag()', function() {
    it('renames tag on invoke', function() {
      this.tagList.addTag({}, {key: 'name', value: 'timmy'});
      this.tagList.renameTag({}, {key: 'name', value: 'butters'});
      var tag = this.tagList.$list.find('li[data-id="name"]');
      expect(tag.text()).to.contain('butters');
    });

    it('renames tag on event', function() {
      this.tagList.addTag({}, {key: 'name', value: 'timmy'});
      $(document.body).trigger('filter:renamed', [{key: 'name', value: 'butters'}]);
      var tag = this.tagList.$list.find('li[data-id="name"]');
      expect(tag.text()).to.contain('butters');
    });
  });
});
