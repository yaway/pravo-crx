(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/vc'], function(VC) {
    var ArtworkFeed;
    ArtworkFeed = (function(superClass) {
      extend(ArtworkFeed, superClass);

      function ArtworkFeed() {
        this.onClick = bind(this.onClick, this);
        return ArtworkFeed.__super__.constructor.apply(this, arguments);
      }

      ArtworkFeed.prototype.events = {
        'click': 'onClick'
      };

      ArtworkFeed.prototype.onClick = function() {
        return this.setState('isCurrent');
      };

      ArtworkFeed.prototype.initialize = function(opt) {
        ArtworkFeed.__super__.initialize.call(this, opt);
        this.on({
          'didChangeState:isCurrent': (function(_this) {
            return function(m, v) {
              return _this.update();
            };
          })(this)
        });
        return this.render();
      };

      ArtworkFeed.prototype.render = function() {
        ArtworkFeed.__super__.render.call(this);
        return this.update();
      };

      ArtworkFeed.prototype.update = function() {
        if (this.getState('isCurrent')) {
          return this.$el.addClass('is-current');
        }
      };

      return ArtworkFeed;

    })(VC);
    return ArtworkFeed;
  });

}).call(this);
