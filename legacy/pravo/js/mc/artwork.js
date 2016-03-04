(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/m', 'core/utl'], function(M, Utl) {
    var Artwork;
    Artwork = (function(superClass) {
      extend(Artwork, superClass);

      function Artwork() {
        return Artwork.__super__.constructor.apply(this, arguments);
      }

      Artwork.prototype.defaults = {
        "id": void 0,
        "idAttribute": "id",
        "url": '',
        "src": '',
        "thumb": '',
        "isCurrent": false,
        "isFavorite": false,
        "isChosen": false
      };

      Artwork.prototype.initialize = function() {
        if ((this.get('url')) === '') {
          return this.set("src", (this.get('root')) + "/" + (this.get('path')));
        } else {
          return this.set("src", this.get('url'));
        }
      };

      Artwork.prototype.saveDataURL = function() {
        console.log(this.get('src'));
        return Utl.fetchDataURL(this.get('src'), (function(_this) {
          return function(dataURL) {
            console.debug("Data URL:");
            console.log(dataURL);
            return _this.set('src', dataURL);
          };
        })(this));
      };

      return Artwork;

    })(M);
    return Artwork;
  });

}).call(this);
