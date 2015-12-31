(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/m'], function(M) {
    var Scroll;
    Scroll = (function(superClass) {
      extend(Scroll, superClass);

      function Scroll() {
        return Scroll.__super__.constructor.apply(this, arguments);
      }

      Scroll.prototype.defaults = {
        "direction": "h",
        "distance": 0,
        "validDistance": 0,
        "scrollSize": 0,
        "scrolleeSize": 0,
        "isScrollable": false
      };

      return Scroll;

    })(M);
    return Scroll;
  });

}).call(this);
