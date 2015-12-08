(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc'], function(VC) {
    var ArtworkFeedVC;
    ArtworkFeedVC = (function(superClass) {
      extend(ArtworkFeedVC, superClass);

      function ArtworkFeedVC() {
        this.onChangeIsChosen = bind(this.onChangeIsChosen, this);
        this.onClick = bind(this.onClick, this);
        return ArtworkFeedVC.__super__.constructor.apply(this, arguments);
      }

      ArtworkFeedVC.prototype.events = {
        'click': 'onClick'
      };

      ArtworkFeedVC.prototype.onClick = function() {
        this.model.trigger('willChangeIsChosen');
        return this.model.set('isChosen', true);
      };

      ArtworkFeedVC.prototype.initialize = function(opt) {
        ArtworkFeedVC.__super__.initialize.call(this, opt);
        this.model.on({
          'change:isChosen': this.onChangeIsChosen
        });
        return this.render();
      };

      ArtworkFeedVC.prototype.onChangeIsChosen = function() {
        return this.updateStateChosen();
      };

      ArtworkFeedVC.prototype.updateStateChosen = function() {
        if (this.model.get('isChosen')) {
          return this.$el.addClass('is-chosen');
        } else {
          return this.$el.removeClass('is-chosen');
        }
      };

      ArtworkFeedVC.prototype.update = function() {
        return this.updateStateChosen();
      };

      return ArtworkFeedVC;

    })(VC);
    return ArtworkFeedVC;
  });

}).call(this);
