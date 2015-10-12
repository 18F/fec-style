'use strict';

var $ = require('jquery');
var _ = require('underscore');
var feedback = require('./templates/feedback.html');

var statusClasses = {
  success: 'message--success',
  error: 'message--error'
};

/**
 * Feedback widget
 * @constructor
 * @param {String} url - AJAX URL
 * @param {String} parent - Optional parent selector; defaults to 'body'
 */
function Feedback(url, parent) {
  this.url = url;
  this.isOpen = false;
  this.$feedback = $(feedback);

  $(parent || 'body').append(this.$feedback);

  this.$button = this.$feedback.find('.js-feedback');
  this.$reset = this.$feedback.find('.js-reset');
  this.$box = this.$feedback.find('.js-feedback-box');
  this.$status = this.$box.find('.js-status');
  this.$form = this.$feedback.find('form');

  this.$button.on('click', this.toggle.bind(this));
  this.$reset.on('click', this.reset.bind(this));
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

Feedback.prototype.handleSuccess = function() {
  var message =
    '<h2 class="feedback__title">Thank you for helping us improve betaFEC</h2>' +
    '<p>This information has been reported on GitHub, where it is publicly visible. ' +
    'You can review all reported feedback on <a href="https://github.com/18f/fec/issues">our GitHub page</a>.</p>';
  var buttonText = 'Submit another issue';
  this.$box.find('textarea').val('');
  this.message(message, buttonText, 'success');
};

Feedback.prototype.handleError = function() {
  var message =
    '<h2 class="feedback__title">There was an error</h2>' +
    '<p>Please try submitting your issue again.</p>';
  var buttonText = 'Try again';
  this.message(message, buttonText, 'error');
};

Feedback.prototype.message = function(text, buttonText, style) {
  var self = this;
  this.$form.attr('aria-hidden', true);
  self.$status.attr('aria-hidden', false);
  self.$reset.text(buttonText);
  self.$status.find('.js-status-content').html(text);
  _.each(statusClasses, function(value) {
    self.$status.removeClass(value);
  });
  self.$status.addClass(statusClasses[style]);
};

Feedback.prototype.reset = function() {
  this.$form.attr('aria-hidden', false);
  this.$status.attr('aria-hidden', true);
};

module.exports = {Feedback: Feedback};
