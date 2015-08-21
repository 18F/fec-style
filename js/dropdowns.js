'use strict';

/* global require, module, document */

var $ = require('jquery');
var perfectScrollbar = require('perfect-scrollbar/jquery') ($);
var KEYCODE_ESC = 27;

/**
 * Dropdown toggles
 * @constructor
 * @param {string} mainSelector - CSS selector for the fieldset that contains everything
 */

function Dropdown(mainSelector) {
    var self = this;

    self.isOpen = false;
    self.hasPanel = true;

    self.$body = $(mainSelector);
    self.$selected = this.$body.find('.dropdown__selected');
    self.$button = this.$body.find('.dropdown__button');
    self.$panel = this.$body.find('.dropdown__panel');
    self.$checkboxes = this.$panel.find('input[type="checkbox"]');

    self.$button.on('click', this.toggle.bind(this));
    self.$checkboxes.each(function(){
        $(this).on('change', self.selectItem.bind(self));
    });
    $(document.body).on('click keyup', this.handleExit.bind(this));

    // Set ARIA attributes
    self.$button.attr('aria-haspopup', 'true');
    self.$panel.attr('aria-label','More options');
}

Dropdown.prototype.toggle = function(ev) {
  ev.preventDefault();
  var method = this.isOpen ? this.hide : this.show;
  method.apply(this);
}

Dropdown.prototype.show = function() {
    this.$panel.attr('aria-hidden', 'false');
    this.$panel.perfectScrollbar({ 'suppressScrollX': true });
    var checkboxes = this.$panel.find('input[type="checkbox"]');
    checkboxes[0].focus();
    this.isOpen = true;

}

Dropdown.prototype.hide = function() {
    this.$panel.attr('aria-hidden', 'true');
    this.isOpen = false;
}

Dropdown.prototype.handleExit = function(ev) {
    var $target = $(ev.target);
    if ( !this.$body.has($target).length ) {
        this.hide.apply(this);
    } else if (ev.keyCode == KEYCODE_ESC) {
        if (this.isOpen) {
          this.hide();
        }
    }
}

Dropdown.prototype.selectItem = function() {
    var $item = this.$panel.find('input:checked').closest('.dropdown__item');
    var $prev = $item.prev('.dropdown__item')
    var $next = $item.next('.dropdown__item')
    this.$selected.append($item);
    if ( $next.length ) {
        $next.find('input[type="checkbox"]').focus();
    } else if ( $prev.length ) {
        $prev.find('input[type="checkbox"]').focus();
    } else if ( !this.$panel.find('.dropdown__item').length ) {
        this.removePanel();
    }        
}

Dropdown.prototype.removePanel = function() {
    if ( this.hasPanel ) {
      this.$selected.find('input[type="checkbox"]').focus();
      this.$panel.remove();
      this.$button.remove();
      this.hasPanel = false;
    }
}

module.exports = {Dropdown: Dropdown};