'use strict';

var $ = require('jquery');
var _ = require('underscore');
var feedback = require('./templates/feedback.html');

var statusClasses = {
  success: 'success',
  error: 'error'
};

/**
 * Feedback widget
 * @constructor
 * @param {String} url - AJAX URL
 * @param {String} parent - Optional parent selector; defaults to 'body'
 */
function Feedback(url, parent) {
  this.url = url;
  this.$feedback = $(feedback);

  $(parent || 'body').append(this.$feedback);

  this.$button = this.$feedback.find('.js-feedback');
  this.$box = this.$feedback.find('.js-feedback-box');
  this.$status = this.$box.find('.js-status');
  this.$form = this.$feedback.find('form');

  this.$button.on('click', this.toggle.bind(this));
  this.$form.on('submit', this.submit.bind(this));
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

Feedback.prototype.submit = function(e) {
  e.preventDefault();
  var data = _.chain(this.$box.find('textarea'))
    .map(function(elm) {
      var $elm = $(elm);
      return [$elm.attr('name'), $elm.val()];
    })
    .object()
    .value();
  var promise = $.ajax({
    method: 'POST',
    url: this.url,
    data: JSON.stringify(data),
    contentType: 'application/json'
  });
  promise.done(this.handleSuccess.bind(this));
  promise.fail(this.handleError.bind(this));
};

Feedback.prototype.handleSuccess = function(response) {
  this.$box.find('textarea').val('');
  this.message('Issue submitted.');
};

Feedback.prototype.handleError = function() {
  this.message('Error submitting issue. Please try again.');
};

Feedback.prototype.message = function(text, style) {
  this.$status.text(text);
  _.each(statusClasses, function(value, key) {
    this.$status.removeClass(value);
  });
  this.$status.addClass(statusClasses[style]);
};

module.exports = {Feedback: Feedback};
