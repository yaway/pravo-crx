(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc'], function(VC) {
    var ArtworkVC;
    ArtworkVC = (function(superClass) {
      extend(ArtworkVC, superClass);

      function ArtworkVC() {
        this.onChangeIsCurrent = bind(this.onChangeIsCurrent, this);
        this.onChangeSrc = bind(this.onChangeSrc, this);
        return ArtworkVC.__super__.constructor.apply(this, arguments);
      }

      ArtworkVC.prototype.initialize = function(opt) {
        ArtworkVC.__super__.initialize.call(this, opt);
        this.model.on({
          "change:src": this.onChangeSrc,
          "change:isCurrent": this.onChangeIsCurrent,
          "change:isFavorite": this.onChangeIsFavorite
        });
        return this.render();
      };

      ArtworkVC.prototype.onChangeSrc = function() {
        return this.ui.$img.attr('src', this.model.get('src'));
      };

      ArtworkVC.prototype.onChangeIsCurrent = function() {
        return this.updateStateCurrent();
      };

      ArtworkVC.prototype.update = function() {
        return this.updateStateCurrent();
      };

      ArtworkVC.prototype.updateStateCurrent = function() {
        if (this.model.get('isCurrent')) {
          return this.$el.addClass('is-current');
        } else {
          return this.$el.removeClass('is-current');
        }
      };

      return ArtworkVC;

    })(VC);
    return ArtworkVC;
  });

}).call(this);
