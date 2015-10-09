'use strict';

/* global require, module, document */

var $ = require('jquery');
var feedback = require('./templates/feedback.html');

function Feedback() {
  $('body').append(feedback);
  this.$button = this.getButton();
  this.$box = this.getBox();

  this.$button.on('click', this.toggle.bind(this));
};

Feedback.prototype.getButton = function() {
  return $('.js-feedback');
};

Feedback.prototype.getBox = function() {
  return $('.js-feedback-box');
}

Feedback.prototype.toggle = function() {
  var method = this.isOpen ? this.hide : this.show;
  method.apply(this);
};

Feedback.prototype.show = function() {
  this.$box.attr('aria-hidden', 'false');
  this.$button.attr('aria-expanded', 'true');
  this.isOpen = true;
}

Feedback.prototype.hide = function() {
  this.$box.attr('aria-hidden', 'true');
  this.$button.attr('aria-expanded', 'false');
  this.isOpen = false;
}

module.exports = {Feedback: Feedback};