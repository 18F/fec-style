'use strict';

var moment = require('moment');
var Handlebars = require('hbsfy/runtime');

function datetime(value, options) {
  var hash = options.hash || {};
  var formatMap = {
    default: 'MM-DD-YYYY',
    pretty: 'MMM D, YYYY',
    time: 'h:mma',
    dateTime: 'MMM D, h:mma',
    dayOfWeek: 'ddd'
  }
  var format = hash.format ? formatMap[hash.format] : formatMap['default'];
  var parsed = moment(value, 'YYYY-MM-DDTHH:mm:ss');
  return parsed.isValid() ? parsed.format(format) : null;
}

Handlebars.registerHelper('datetime', datetime);

module.exports = {
  datetime: datetime
}
