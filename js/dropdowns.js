'use strict';

/* global require, module, document */

var $ = require('jquery');
var perfectScrollbar = require('perfect-scrollbar/jquery')($);

var KEYCODE_ESC = 27;
var KEYCODE_ENTER = 13;

var defaultOpts = {
  checkboxes: true,
};

/**
 * Dropdown toggles
 * @constructor
 * @param {string} selector - CSS selector for the fieldset that contains everything
 * @param {object} opts - Options
 */
function Dropdown(selector, opts) {
  var self = this;
  self.opts = $.extend({}, defaultOpts, opts);

  self.isOpen = false;

  self.$body = $(selector);
  self.$button = this.$body.find('.dropdown__button');
  self.$panel = this.$body.find('.dropdown__panel');

  self.listeners = [];

  if (self.opts.checkboxes) {
    self.$selected = this.$body.find('.dropdown__selected');
    self.$panel.on('keyup', 'input[type="checkbox"]', this.handleCheckKeyup.bind(this));
    self.$panel.on('change', 'input[type="checkbox"]', this.handleCheck.bind(this));

    if (self.isEmpty()) {
      self.removePanel();
    }
  }

  self.$button.on('click', this.toggle.bind(this));

  this.addEventListener(document.body, 'click', this.handleClickAway.bind(this));
  this.addEventListener(document.body, 'focusin', this.handleFocusAway.bind(this));
  this.addEventListener(document.body, 'keyup', this.handleKeyup.bind(this));

  // Set ARIA attributes
  self.$button.attr('aria-haspopup', 'true');
  self.$panel.attr('aria-label','More options');
}

Dropdown.prototype.toggle = function(e) {
  e.preventDefault();
  var method = this.isOpen ? this.hide : this.show;
  method.apply(this);
};

Dropdown.prototype.show = function() {
  this.$panel.attr('aria-hidden', 'false');
  this.$panel.perfectScrollbar({suppressScrollX: true});
  this.$panel.find('input[type="checkbox"]:first').focus();
  this.isOpen = true;
};

Dropdown.prototype.hide = function() {
  this.$panel.attr('aria-hidden', 'true');
  this.isOpen = false;
};

Dropdown.prototype.handleClickAway = function(e) {
  var $target = $(e.target);
  if (!this.$body.has($target).length) {
    this.hide();
  }
};

Dropdown.prototype.handleFocusAway = function(e) {
  var $target = $(e.target);
  if (this.isOpen && !this.$panel.has($target).length && !$target.is(this.$button)) {
    this.hide();
  }
};

Dropdown.prototype.handleKeyup = function(e) {
  if (e.keyCode === KEYCODE_ESC) {
    if (this.isOpen) {
      this.hide();
      this.$button.focus();
    }
  }
};

Dropdown.prototype.handleCheckKeyup = function(e) {
  if (e.keyCode === KEYCODE_ENTER) {
    $(e.target).prop('checked', true).change();
  }
};

Dropdown.prototype.handleCheck = function(e) {
  var $input = $(e.target);
  if ($input.is(':checked')) {
    this.selectItem($input);
  }
};

Dropdown.prototype.selectItem = function($input) {
  var $item = $input.parent('.dropdown__item');
  var prev = $item.prevAll('.dropdown__item');
  var next = $item.nextAll('.dropdown__item');
  this.$selected.append($item);
  if (!this.isEmpty()) {
    if (next.length) {
      $(next[0]).find('input[type="checkbox"]').focus();
    } else if (prev.length) {
      $(prev[0]).find('input[type="checkbox"]').focus();
    }
  } else {
    this.removePanel();
    this.$selected.find('input[type="checkbox"]').focus();
  }
};

Dropdown.prototype.removePanel = function() {
  this.$panel.remove();
  this.$button.remove();
};

Dropdown.prototype.isEmpty = function() {
  return this.$panel.find('input').length === 0;
};

Dropdown.prototype.addEventListener = function(elm, event, callback) {
  if (elm) {
    elm.addEventListener(event, callback);
    this.listeners.push({
      elm: elm,
      event: event,
      callback: callback
    });
  }
};

Dropdown.prototype.destroy = function() {
  this.listeners.forEach(function(listener) {
    listener.elm.removeEventListener(listener.event, listener.callback);
  });
};

module.exports = {Dropdown: Dropdown};
