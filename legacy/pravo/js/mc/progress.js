(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/m'], function(M) {
    var Progress;
    Progress = (function(superClass) {
      extend(Progress, superClass);

      function Progress() {
        return Progress.__super__.constructor.apply(this, arguments);
      }

      Progress.prototype.defaults = {
        isDone: false,
        done: 0,
        total: 0,
        infinite: false
      };

      return Progress;

    })(M);
    return Progress;
  });

}).call(this);
