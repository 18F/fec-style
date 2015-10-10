'use strict';

/* global require, module, document */

var $ = require('jquery');
var feedback = require('./templates/feedback.html');

/** Feedback widget
  * @constructor
  * @param {string} url - URL to submit the form to
  */

function Feedback(url) {
  $('body').append(feedback);

  this.url = url;
  this.$button = this.getButton();
  this.$box = this.getBox();
  this.$action = this.$box.find('[name=action]');
  this.$response = this.$box.find('[name=response');
  this.$feedback = this.$box.find('[name=feedback]');

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
};

Feedback.prototype.hide = function() {
  this.$box.attr('aria-hidden', 'true');
  this.$button.attr('aria-expanded', 'false');
  this.isOpen = false;
};

Feedback.prototype.submit = function() {
  e.preventDefault();
  var promise = $.ajax({
    method: 'POST',
    url: url,
    data: {
      url: this.url,
      action: this.$action.val(),
      response: this.$response.val(),
      feedback: this.$feedback.val()
    }
  });
};

module.exports = {Feedback: Feedback};