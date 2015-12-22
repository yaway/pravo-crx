(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone'], function(Backbone) {
    var C;
    C = (function(superClass) {
      extend(C, superClass);

      function C() {
        return C.__super__.constructor.apply(this, arguments);
      }

      C.prototype.initialize = function() {
        return this.on({
          "update": this.update
        });
      };

      C.prototype.allSet = function(k, v, opt) {
        var i, len, model, ref;
        ref = this.models;
        for (i = 0, len = ref.length; i < len; i++) {
          model = ref[i];
          model.set(k, v, opt);
        }
        return this;
      };

      return C;

    })(Backbone.Collection);
    return C;
  });

}).call(this);
