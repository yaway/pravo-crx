(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/m'], function(M) {
    var ArworkProcess;
    ArworkProcess = (function(superClass) {
      extend(ArworkProcess, superClass);

      function ArworkProcess() {
        return ArworkProcess.__super__.constructor.apply(this, arguments);
      }

      ArworkProcess.prototype.defaults = {
        isLoaded: false,
        done: 0,
        total: 0
      };

      return ArworkProcess;

    })(M);
    return ArworkProcess;
  });

}).call(this);
