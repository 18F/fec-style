'use strict';

/* global require, module, document */

var $ = require('jquery');

function Skipnav(selector) {
  var self = this;
  self.$link = $(selector);
  self.$target = self.findTarget();
  $(document.body).on('click, keyup', self, this.focusOnTarget.bind(this));
};

Skipnav.prototype.findTarget = function() {
  return $('main').find('a, button, :input, [tabindex]').filter(':visible')[0];
};

Skipnav.prototype.focusOnTarget = function(e) {
  if (e.keyCode === 13 || e.type === 'click') {    
    this.$target.focus();
  }
};

module.exports = {Skipnav: Skipnav};