'use strict';

module.exports.register = function(handlebars) {
  handlebars.registerHelper('renderChild', function () {
    var instances = '';
    var options = arguments[arguments.length - 1];
    for(var i = 0; i < arguments.length - 1; ++i) {
      var instance = options.fn({className: arguments[i], index: i});
      instances += instance;
    }
    return new handlebars.SafeString(instances);
  });
};
