'use strict';

var $ = require('jquery');

function StickyBar(selector) {
  this.$body = $('body');
  this.$bar = $(selector);
  this.height = this.$bar.outerHeight();
  this.offset = this.$bar.offset().top;
  this.delay = 100; // Delay before it sticks

  this.defaultBodyPadding = this.$body.css('padding-top');
  $(window).on('scroll', this.toggle.bind(this));
}

StickyBar.prototype.toggle = function() {
  var scrollTop = this.$body.scrollTop();
  if (scrollTop >= this.offset + this.delay) {
    this.$bar.addClass('is-stuck');
    this.$body.css('padding-top', this.height);
  } else if (scrollTop < this.offset) {
    this.$bar.removeClass('is-stuck');
    this.$body.css('padding-top', this.defaultBodyPadding);
  }
};

module.exports = {StickyBar: StickyBar};
