// Generated by CoffeeScript 1.9.3
define(['jquery', 'lib/underscore'], function($, _) {
  var TPL;
  TPL = {};
  TPL.getTpl = function(tpl) {
    var tplStr;
    tplStr = _.unescape($("[data-tpl='" + tpl + "']").html());
    return tplStr;
  };
  return TPL;
});
