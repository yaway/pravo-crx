(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone'], function(Backbone) {
    var M;
    M = (function(superClass) {
      extend(M, superClass);

      function M() {
        return M.__super__.constructor.apply(this, arguments);
      }

      M.prototype.toggle = function(k, opt) {
        if (this.get(k)) {
          this.set(k, false, opt);
        } else {
          this.set(k, true, opt);
        }
        return this;
      };

      return M;

    })(Backbone.Model);
    return M;
  });

}).call(this);
