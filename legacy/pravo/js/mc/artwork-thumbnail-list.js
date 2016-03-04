(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['mc/list'], function(List) {
    var ArtworkThumbnailList;
    ArtworkThumbnailList = (function(superClass) {
      extend(ArtworkThumbnailList, superClass);

      function ArtworkThumbnailList() {
        return ArtworkThumbnailList.__super__.constructor.apply(this, arguments);
      }

      ArtworkThumbnailList.prototype.defaults = {
        from: 'unsplash'
      };

      return ArtworkThumbnailList;

    })(List);
    return ArtworkThumbnailList;
  });

}).call(this);
