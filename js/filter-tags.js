'use strict';

var $ = require('jquery');
var _ = require('underscore');

var events = require('./events');

var TAG_TEMPLATE = _.template(
  '<li class="tag">' +
    '{{ text }}' +
    '<button class="button tag__remove">' +
      '<span class="u-visually-hidden">Remove</span>' +
    '</button>' +
  '</li>',
  {interpolate: /\{\{(.+?)\}\}/g}
);

function TagList() {
  this.$body = $('<ul class="data-container__tags"></ul>');
  this.tags = {};

  events.on('filter:added', this.addTag.bind(this));
  events.on('filter:removed', this.removeTag.bind(this));
}

TagList.prototype.addTag = function(opts) {
  this.removeTag(opts);

  var tag = new Tag(opts);
  this.tags[tag.key] = tag;
  this.$body.append(tag.$content);
};

TagList.prototype.removeTag = function(opts) {
  var tag = this.tags[opts.key];
  if (tag) {
    delete this.tags[tag.key];
    tag.remove();
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
