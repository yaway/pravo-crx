(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/vc', 'moment'], function(VC, moment) {
    var ClockVC;
    ClockVC = (function(superClass) {
      extend(ClockVC, superClass);

      function ClockVC() {
        return ClockVC.__super__.constructor.apply(this, arguments);
      }

      ClockVC.prototype.initialize = function(opt) {
        ClockVC.__super__.initialize.call(this, opt);
        return this.render();
      };

      ClockVC.prototype.render = function() {
        ClockVC.__super__.render.call(this);
        console.log('Clock Rendered');
        this.renderTime();
        return setInterval((function(_this) {
          return function() {
            return _this.renderTime();
          };
        })(this), 1000);
      };

      ClockVC.prototype.renderTime = function() {
        return this.ui.$time.text(moment().format('hh:mm:ss'));
      };

      return ClockVC;

    })(VC);
    return ClockVC;
  });

}).call(this);
