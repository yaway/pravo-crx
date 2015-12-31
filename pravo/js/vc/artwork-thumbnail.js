(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc'], function(VC) {
    var ArtworkThumbnailVC;
    ArtworkThumbnailVC = (function(superClass) {
      extend(ArtworkThumbnailVC, superClass);

      function ArtworkThumbnailVC() {
        this.onClick = bind(this.onClick, this);
        return ArtworkThumbnailVC.__super__.constructor.apply(this, arguments);
      }

      ArtworkThumbnailVC.prototype.events = {
        'click': 'onClick'
      };

      ArtworkThumbnailVC.prototype.onClick = function() {
        this.setState('isChosen');
        return this.setState('isCurrent');
      };

      ArtworkThumbnailVC.prototype.initialize = function(opt) {
        ArtworkThumbnailVC.__super__.initialize.call(this, opt);
        this.on({
          'didChangeState:isChosen': (function(_this) {
            return function(vc, v) {
              if (v) {
                return _this.$el.addClass('is-chosen');
              } else {
                return _this.$el.removeClass('is-chosen');
              }
            };
          })(this)
        });
        return this.lazyRender();
      };

      ArtworkThumbnailVC.prototype.lazyRender = function() {
        var img;
        img = new Image;
        img.src = this.model.get('thumb');
        return img.onload = (function(_this) {
          return function() {
            return _this.render();
          };
        })(this);
      };

      return ArtworkThumbnailVC;

    })(VC);
    return ArtworkThumbnailVC;
  });

}).call(this);
