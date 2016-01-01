'use strict';

var $ = require('jquery');
var _ = require('underscore');

var events = require('./events');

var TAGTEMPLATE = _.template(
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
  if (this.findTag(opts.key)) {
    this.removeTag(opts);
  }

  var tag = new Tag(opts);
  this.tags[tag.key] = tag;
  this.$body.append(tag.$content);
};

TagList.prototype.removeTag = function(opts) {
  if (Object.keys(this.tags).length > 0 && this.findTag(opts.key)) {
    var tag = this.findTag(opts.key);
    delete this.tags[tag.key];
    tag.remove();
  }
};

TagList.prototype.findTag = function(key) {
  return this.tags[key] || null;
};

function Tag(opts) {
  this.key = opts.key;
  this.checkOrRadio = opts.type === 'checkbox' || opts.type === 'radio';
  this.text = opts.value;

  this.$content = $(TAGTEMPLATE({text: this.text}));
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
