'use strict';

/* global require, module */

var moment = require('moment');
var Handlebars = require('hbsfy/runtime');

var BREAKPOINTS = {
  MEDIUM: 640,
  LARGE: 860
};

var LOADING_DELAY = 1500;
var SUCCESS_DELAY = 5000;

var formatMap = {
  default: 'MM-DD-YYYY',
  pretty: 'MMM D, YYYY',
  time: 'h:mma',
  dateTime: 'MMM D, h:mma',
  dayOfWeek: 'ddd',
  fullDayOfWeek: 'dddd'
};

function getWindowWidth() {
  // window.innerWidth accounts for scrollbars and should match the width used
  // for media queries.
  return window.innerWidth;
}

function isLargeScreen() {
  if (window.innerWidth >= BREAKPOINTS.LARGE) {
    return true;
  } else {
    return false;
  }
}

function isMediumScreen() {
  if (window.innerWidth >= BREAKPOINTS.MEDIUM) {
    return true;
  } else {
    return false;
  }
}

function datetime(value, options) {
  var hash = options.hash || {};
  var format = formatMap[hash.format || 'default'];
  var parsed = moment(value, 'YYYY-MM-DDTHH:mm:ss');
  return parsed.isValid() ? parsed.format(format) : null;
}

Handlebars.registerHelper('datetime', datetime);

Handlebars.registerHelper({
  eq: function (v1, v2) {
    return v1 === v2;
  },
  toUpperCase: function(value) {
    return value.substr(0,1).toUpperCase() + value.substr(1);
  }
});

module.exports = {
  datetime: datetime,
  BREAKPOINTS: BREAKPOINTS,
  isMediumScreen: isMediumScreen,
  isLargeScreen: isLargeScreen,
  getWindowWidth: getWindowWidth,
  helpers: Handlebars.helpers,
  LOADING_DELAY: LOADING_DELAY,
  SUCCESS_DELAY: SUCCESS_DELAY
};
