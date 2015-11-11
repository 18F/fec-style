'use strict';

var $ = require('jquery');
var modal = require('./templates/modal.html');

function Modal(trigger, parent) {
  this.isOpen = false;
  this.$body = $(modal);
  this.$parent = $(parent || 'body');

  $('body').on('click', '.js-modal', this.addModal.bind(this));
  $('body').on('click', '.js-close', this.destroyModal.bind(this));
}

Modal.prototype.addModal = function() {
  this.$parent.append(this.$body);
  this.timeToDownload();
}

Modal.prototype.destroyModal = function() {
  this.$body.remove();
}

Modal.prototype.timeToDownload = function() {
  var time = Math.floor(Math.random() * (15 - 2)) + 2;
  this.$body.find('.js-random-time').text(time + ' minutes');
}

module.exports = {Modal: Modal};
