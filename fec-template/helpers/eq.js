'use strict';

module.exports.register = function(handlebars) {
  handlebars.registerHelper('eq', function (v1, v2) {
    return v1 === v2;
  });
};
