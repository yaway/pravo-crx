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
        "lastDistence": 0,
        "scrollSize": 0,
        "scrolleeSize": 0,
        "isScrollable": false
      };

      Scroll.prototype.initialize = function() {
        console.log("New Scroll");
        Scroll.__super__.initialize.call(this);
        return this.on({
          "willChangeDisance": (function(_this) {
            return function() {
              return _this.set('lastDistence', _this.get('distance'));
            };
          })(this),
          'change:distance': (function(_this) {
            return function() {
              if ((_this.get('distance')) === (_this.get('lastDistence'))) {

              } else {
                return _this.trigger('didChangeDistance');
              }
            };
          })(this),
          'didChangeDistance': (function(_this) {
            return function() {
              return _this.validateDistance();
            };
          })(this)
        });
      };

      Scroll.prototype.validateDistance = function() {
        var distance, isScrolledToEnd, isValid, limit;
        distance = this.get('distance');
        limit = (this.get('scrolleeSize')) - (this.get('scrollSize'));
        isValid = false;
        if (distance > 0) {
          this.set('distance', 0);
        } else if (distance < -limit) {
          this.set('distance', -limit);
          isScrolledToEnd = true;
        } else {
          isValid = true;
        }
        this.set('isScrolledToEnd', isScrolledToEnd || false);
        return this.set("isScrollable", isValid);
      };

      return Scroll;

    })(M);
    return Scroll;
  });

}).call(this);
