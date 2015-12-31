(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/m'], function(M) {
    var Booth;
    Booth = (function(superClass) {
      extend(Booth, superClass);

      function Booth() {
        return Booth.__super__.constructor.apply(this, arguments);
      }

      Booth.prototype.defaults = {
        "hasArtworks": false,
        "ableToLoop": true
      };

      return Booth;

    })(M);
    return Booth;
  });

}).call(this);
