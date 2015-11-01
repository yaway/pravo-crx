// Generated by CoffeeScript 1.9.3
var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

define(['lib/underscore', 'found/utl', 'found/m'], function(_, Utl, M) {
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
      "base64": '',
      "root": "../../img/artwork",
      "path": "0.png",
      "src": '',
      "isCurrent": false,
      "isFavorite": false
    };

    Artwork.prototype.initialize = function() {
      console.log("New Artwork");
      if ((this.get('url')) === '') {
        return this.set("src", (this.get('root')) + "/" + (this.get('path')));
      } else {
        this.set("src", this.get('url'));
        console.log(this.get('src'));
        return Utl.getDataUrl(this.get('src'), (function(_this) {
          return function(dataUrl) {
            console.debug("Data URL:");
            console.log(dataUrl);
            return _this.set('src', dataUrl);
          };
        })(this));
      }
    };

    Artwork.prototype.getFav = function() {
      var fav;
      fav = this.get('isFavorite');
      return fav;
    };

    Artwork.prototype.setFav = function() {
      return this.set('isFavorite', true);
    };

    Artwork.prototype.unsetFav = function() {
      return this.set('isFavorite', false);
    };

    Artwork.prototype.toggleFav = function() {
      if (this.get('isFavorite')) {
        return this.unsetFav();
      } else {
        return this.setFav();
      }
    };

    return Artwork;

  })(M);
  return Artwork;
});
