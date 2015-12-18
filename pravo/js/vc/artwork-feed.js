(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc'], function(VC) {
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
        this.model.trigger('willChangeIsCurrent');
        return this.model.set('isCurrent', true);
      };

      ArtworkFeed.prototype.initialize = function(opt) {
        ArtworkFeed.__super__.initialize.call(this, opt);
        return this.render();
      };

      return ArtworkFeed;

    })(VC);
    return ArtworkFeed;
  });

}).call(this);
