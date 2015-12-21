// Generated by CoffeeScript 1.9.3
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['found/m'], function(M) {
  var Progress;
  Progress = (function(superClass) {
    extend(Progress, superClass);

    function Progress() {
      return Progress.__super__.constructor.apply(this, arguments);
    }

    Progress.prototype.defaults = {
      isDone: false,
      done: 0,
      total: 0
    };

    Progress.prototype.initialize = function() {
      return console.log('New Progress');
    };

    return Progress;

  })(M);
  return Progress;
});
