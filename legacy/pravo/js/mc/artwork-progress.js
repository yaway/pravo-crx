(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['mc/progress'], function(Progress) {
    var ArtworkProgress;
    ArtworkProgress = (function(superClass) {
      extend(ArtworkProgress, superClass);

      function ArtworkProgress() {
        return ArtworkProgress.__super__.constructor.apply(this, arguments);
      }

      ArtworkProgress.prototype.defaults = {
        artworkType: 'src',
        indicatorType: 'linear'
      };

      return ArtworkProgress;

    })(Progress);
    return ArtworkProgress;
  });

}).call(this);
