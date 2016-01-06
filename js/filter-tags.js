'use strict';

var $ = require('jquery');
var _ = require('underscore');

var events = require('./events');

var BODY_TEMPLATE = _.template(
  '<div class="class="data-container__tags">' +
    '<h3 class="tags__title">Viewing: ' +
      '<span class="js-tag-title tags__title__text">{{ title }}</span>' +
    '</h3>' +
    '<ul class="tags"></ul>' +
  '</div>',
  {interpolate: /\{\{(.+?)\}\}/g}
);

var TAG_TEMPLATE = _.template(
  '<li class="tag">' +
    '{{ text }}' +
    '<button class="button tag__remove">' +
      '<span class="u-visually-hidden">Remove</span>' +
    '</button>' +
  '</li>',
  {interpolate: /\{\{(.+?)\}\}/g}
);

function TagList(opts) {
  this.opts = opts;
  this.tags = {};
  this.title = this.opts.title;

  this.$body = $(BODY_TEMPLATE({title: this.title}));
  this.$list = this.$body.find('ul');
  this.$title = this.$body.find('.js-tag-title');

  events.on('filter:added', this.addTag.bind(this));
  events.on('filter:removed', this.removeTag.bind(this));
}

TagList.prototype.addTag = function(opts) {
  this.removeTag(opts);
  this.$title.html('');

  var tag = new Tag(opts);
  this.tags[tag.key] = tag;
  this.$list.append(tag.$content);
};

TagList.prototype.removeTag = function(opts) {
  var tag = this.tags[opts.key];
  if (tag) {
    delete this.tags[tag.key];
    tag.remove();
  }

  if (_.isEmpty(this.tags)) {
    this.$title.html(this.opts.title);
  }
};

function Tag(opts) {
  this.key = opts.key;
  this.text = opts.value;

  this.$content = $(TAG_TEMPLATE({text: this.text}));
  this.$content.on('click', 'button', this.remove.bind(this, true));
}

Tag.prototype.remove = function(triggerEvent) {
  this.$content.remove();
  if (triggerEvent) {
    events.emit('tag:removed', {key: this.key});
  }
};

module.exports = {
  TagList: TagList,
  Tag: Tag,
};
