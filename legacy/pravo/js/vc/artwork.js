(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/vc'], function(VC) {
    var ArtworkVC;
    ArtworkVC = (function(superClass) {
      extend(ArtworkVC, superClass);

      function ArtworkVC() {
        return ArtworkVC.__super__.constructor.apply(this, arguments);
      }

      ArtworkVC.prototype.initialize = function(opt) {
        ArtworkVC.__super__.initialize.call(this, opt);
        this.m.on({
          'change:isCurrent': (function(_this) {
            return function(m, v) {
              if (v) {
                return _this.$el.addClass('is-current');
              } else {
                return _this.$el.removeClass('is-current');
              }
            };
          })(this)
        });
        return this.render();
      };

      return ArtworkVC;

    })(VC);
    return ArtworkVC;
  });

}).call(this);
