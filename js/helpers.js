'use strict';

/* global require, module */

var moment = require('moment');
var Handlebars = require('hbsfy/runtime');

var formatMap = {
  default: 'MM-DD-YYYY',
  pretty: 'MMM D, YYYY',
  time: 'h:mma',
  dateTime: 'MMM D, h:mma',
  dayOfWeek: 'ddd'
};

function datetime(value, options) {
  var hash = options.hash || {};
  var format = formatMap[hash.format || 'default'];
  var parsed = moment(value, 'YYYY-MM-DDTHH:mm:ss');
  return parsed.isValid() ? parsed.format(format) : null;
}

Handlebars.registerHelper('datetime', datetime);

module.exports = {
  datetime: datetime
};
