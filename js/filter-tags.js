'use strict';

var $ = require('jquery');
var _ = require('underscore');

var TAGTEMPLATE = _.template(
  '<li class="tag">' +
    '{{ text }}' +
    '<button class="button tag__remove">' +
      '<span class="u-visually-hidden">Remove</span>' +
    '</button>' +
  '</li>',
  {interpolate: /\{\{(.+?)\}\}/g}
);

function Tag($input, filter) {
  this.$input = $input;
  this.key = $input.attr('id');
  this.filter = filter;
  this.checkOrRadio = $input.attr('type') === 'checkbox' || $input.attr('type') === 'radio';
  this.text = this.getText($input);

  this.$content = $(TAGTEMPLATE({text: this.text}));

  this.$content.on('click', 'button', this.remove.bind(this));
};

Tag.prototype.getText = function($input) {
  var text;
  if (this.checkOrRadio) {
    text = this.filter.$body.find('label[for="' + $input.attr('id') + '"]').text();
  } else {
    text = $input.val();
  }
  return text;
};

Tag.prototype.remove = function(e) {
  this.$content.remove();
  this.filter.tags.pop(this);
  this.checkOrRadio ?
    this.$input.attr('checked', false).trigger('change') :
    this.$input.val('').trigger('change');
}

module.exports = {
  Tag: Tag,
}
