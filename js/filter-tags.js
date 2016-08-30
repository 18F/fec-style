'use strict';

var $ = require('jquery');
var _ = require('underscore');

var BODY_TEMPLATE = _.template(
  '<div>' +
    '<div class="row">' +
      '<h3 class="tags__title">Viewing ' +
        '<span class="js-count" aria-hidden="true"></span> ' +
        '<span class="js-result-type">filtered {{ resultType }} for:</span>' +
      '</h3>' +
      '<button type="button" class="js-filter-clear button--unstyled tags__clear" aria-hidden="true">Clear all filters</button>' +
    '</div>' +
    '<ul class="tags">' +
    '</ul>' +
  '</div>',
  {interpolate: /\{\{(.+?)\}\}/g}
);

var TAG_TEMPLATE = _.template(
  '<div data-id="{{ key }}" data-removable="true" class="tag__item">' +
    '{{ value }}' +
    '<button class="button js-close tag__remove">' +
      '<span class="u-visually-hidden">Remove</span>' +
    '</button>' +
  '</div>',
  {interpolate: /\{\{(.+?)\}\}/g}
);

var NONREMOVABLE_TAG_TEMPLATE = _.template(
  '<div data-id="{{ key }}" data-removable="false" class="tag__item">' +
    '{{ value }}' +
  '</div>',  {interpolate: /\{\{(.+?)\}\}/g}
);

function TagList(opts) {
  this.opts = opts;

  this.$body = $(BODY_TEMPLATE({resultType: this.opts.resultType}));
  this.$list = this.$body.find('.tags');
  this.$resultType = this.$body.find('.js-result-type');
  this.$clear = this.$body.find('.js-filter-clear');

  $(document.body)
    .on('filter:added', this.addTag.bind(this))
    .on('filter:removed', this.removeTagEvt.bind(this))
    .on('filter:renamed', this.renameTag.bind(this))
    .on('filter:disabled', this.disableTag.bind(this))
    .on('filter:enabled', this.enableTag.bind(this));

  this.$list.on('click', '.js-close', this.removeTagDom.bind(this));
  this.$clear.on('click', this.removeAllTags.bind(this));

  if (this.opts.showResultCount) {
    this.$body.find('.js-count').attr('aria-hidden', false);
  }
}

TagList.prototype.addTag = function(e, opts) {
  var tag = opts.nonremovable ? NONREMOVABLE_TAG_TEMPLATE(opts) : TAG_TEMPLATE(opts);
  var name = opts.range ? opts.rangeName : opts.name;
  var $tagCategory = this.$list.find('[data-tag-category="' + name + '"]');
  this.removeTag(opts.key, false);

  if ($tagCategory.length > 0) {
    this.addTagItem($tagCategory, tag, opts);
  }
  else {
    this.$list.append('<li data-tag-category="' + name + '" class="tag__category">' + tag + '</li>');
  }

  if (this.$list.find('.tag__item').length > 0) {
    this.$resultType.html('filtered ' + this.opts.resultType + ' for:');
    this.$list.attr('aria-hidden', false);
  }

  if (!opts.nonremovable) {
    this.$clear.attr('aria-hidden', false);
  }
};

TagList.prototype.addTagItem = function($tagCategory, tag, opts) {
  var rangeClass = 'tag__category__range--' + opts.rangeName;

  if (opts.range == 'min') {
    $tagCategory.addClass(rangeClass).prepend(tag);
  }
  else if (opts.range == 'max') {
    $tagCategory.addClass(rangeClass).append(tag);
  }
  else {
    $tagCategory.append(tag);
  }
};

TagList.prototype.removeTag = function(key, emit) {
  var $tag = this.$list.find('[data-id="' + key + '"]');
  var $tagCategory = $tag.parent();

  if ($tag.length > 0 && $tag.attr('data-removable') !== 'false') {
    if (emit) {
      $tag.trigger('tag:removed', [{key: key}]);
    }

    $tag.remove();

    $tagCategory.removeClass('tag__category__range--amount tag__category__range--date');

    if ($tagCategory.is(':empty')) {
      $tagCategory.remove();
    }
  }

  if (this.$list.find('.tag__item[data-removable]').length === 0) {
    this.$clear.attr('aria-hidden', true);
  }

  if (this.$list.find('.tag__item').length === 0) {
    var text = this.opts.emptyText ? this.opts.emptyText : this.opts.resultType;
    this.$resultType.html(text);
    this.$list.attr('aria-hidden', true);
  }
};

TagList.prototype.removeAllTags = function() {
  var self = this;

  this.$list.find('[data-removable]').each(function(){
    self.removeTag($(this).data('id'), true);
  });

  $(document.body).trigger('tag:removeAll');
};

TagList.prototype.removeTagEvt = function(e, opts) {
  this.removeTag(opts.key, false);
};

TagList.prototype.removeTagDom = function(e) {
  var key = $(e.target).closest('.tag__item').data('id');
  this.removeTag(key, true);
};

TagList.prototype.renameTag = function(e, opts) {
  var tag = opts.nonremovable ? NONREMOVABLE_TAG_TEMPLATE(opts) : TAG_TEMPLATE(opts);
  var $tag = this.$list.find('[data-id="' + opts.key + '"]');
  if ($tag.length) {
    $tag.replaceWith(tag);
  }
};

TagList.prototype.disableTag = function(e, opts) {
  var $tag = this.$list.find('[data-id="' + opts.key + '"]');
  $tag.addClass('is-disabled');
  $tag.attr('title', 'This filter is not avaible for efiling data');
};

TagList.prototype.enableTag = function(e, opts) {
  var $tag = this.$list.find('[data-id="' + opts.key + '"]');
  $tag.removeClass('is-disabled');
  $tag.attr('title', false);
};

module.exports = {TagList: TagList};
