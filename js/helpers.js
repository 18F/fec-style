'use strict';

/* global require, module */

var moment = require('moment');
var Handlebars = require('hbsfy/runtime');

var BREAKPOINTS = {
  MEDIUM: 640,
  LARGE: 860
};

var formatMap = {
  default: 'MM-DD-YYYY',
  pretty: 'MMM D, YYYY',
  time: 'h:mma',
  dateTime: 'MMM D, h:mma',
  dayOfWeek: 'ddd',
  fullDayOfWeek: 'dddd'
};

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
  helpers: Handlebars.helpers
};
