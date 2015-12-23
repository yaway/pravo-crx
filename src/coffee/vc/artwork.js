// Generated by CoffeeScript 1.9.3
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['found/vc'], function(VC) {
  var Artwork;
  Artwork = (function(superClass) {
    extend(Artwork, superClass);

    function Artwork() {
      return Artwork.__super__.constructor.apply(this, arguments);
    }

    Artwork.prototype.initialize = function(opt) {
      Artwork.__super__.initialize.call(this, opt);
      this.on({
        'didChangeState:isCurrent': (function(_this) {
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

    return Artwork;

  })(VC);
  return Artwork;
});
