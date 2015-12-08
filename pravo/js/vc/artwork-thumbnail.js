(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc'], function(VC) {
    var ArtworkThumbnailVC;
    ArtworkThumbnailVC = (function(superClass) {
      extend(ArtworkThumbnailVC, superClass);

      function ArtworkThumbnailVC() {
        this.onChangeIsChosen = bind(this.onChangeIsChosen, this);
        this.onClick = bind(this.onClick, this);
        return ArtworkThumbnailVC.__super__.constructor.apply(this, arguments);
      }

      ArtworkThumbnailVC.prototype.events = {
        'click': 'onClick'
      };

      ArtworkThumbnailVC.prototype.onClick = function() {
        this.model.trigger('willChangeIsCurrent');
        this.model.set('isCurrent', true);
        this.model.trigger('willChangeIsChosen');
        return this.model.set('isChosen', true);
      };

      ArtworkThumbnailVC.prototype.initialize = function(opt) {
        ArtworkThumbnailVC.__super__.initialize.call(this, opt);
        this.model.on({
          'change:isChosen': this.onChangeIsChosen,
          'change:isCurrent': this.onChangeIsCurrent
        });
        return this.render();
      };

      ArtworkThumbnailVC.prototype.onChangeIsChosen = function() {
        if (this.model.get('isChosen')) {
          return this.$el.addClass('is-chosen');
        } else {
          return this.$el.removeClass('is-chosen');
        }
      };

      ArtworkThumbnailVC.prototype.update = function() {};

      return ArtworkThumbnailVC;

    })(VC);
    return ArtworkThumbnailVC;
  });

}).call(this);
