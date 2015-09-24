'use strict';

/* global require, module, document */

var $ = require('jquery');

/* Utilities for setting or removing tabindex on all focusable elements 
 * in a parent div. Useful for hiding elements off-canvas without setting 
 * display:none, while still removing from the tab order
 */

var removeTabindex = function($elm) {
  $elm.find('a, button, :input, [tabindex]').each(function(){
    $(this).attr('tabindex', '-1');
  })
};

var restoreTabindex = function($elm) {
  $elm.find('a, button, :input, [tabindex]').each(function(){
    $(this).attr('tabindex', '0');
  })
};

module.exports = {
  removeTabindex: removeTabindex,
  restoreTabindex: restoreTabindex
}