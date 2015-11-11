'use strict';

var $ = require('jquery');
var modal = require('./templates/modal.html');

function Modal(trigger, parent) {
  this.$body = $(modal);
  this.$parent = $(parent || 'body');

  $('body').on('click', '.js-modal', this.addModal.bind(this));
  $('body').on('click', '.js-close', this.destroyModal.bind(this));
}

Modal.prototype.addModal = function() {
  this.$parent.append(this.$body);
}

Modal.prototype.destroyModal = function() {
  this.$body.remove();
}

module.exports = {Modal: Modal};
