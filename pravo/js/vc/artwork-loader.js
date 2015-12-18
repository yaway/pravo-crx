(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc'], function(VC) {
    var ArtworkLoader;
    ArtworkLoader = (function(superClass) {
      extend(ArtworkLoader, superClass);

      function ArtworkLoader() {
        return ArtworkLoader.__super__.constructor.apply(this, arguments);
      }

      ArtworkLoader.prototype.initialize = function(opt) {
        ArtworkLoader.__super__.initialize.call(this, opt);
        this.on({
          'didInitializeArtworks': (function(_this) {
            return function() {
              return loadArtworks(opt);
            };
          })(this)
        });
        this.initializeArtworks(opt);
        return this.render();
      };

      ArtworkLoader.prototype.update = function() {
        return console.log('Artwork Loader Rendered');
      };

      ArtworkLoader.prototype.initializeArtworks = function(opt) {
        if (opt == null) {
          opt = {};
        }
        if (!opt.artworks) {
          console.log("No Artwork to Load");
          return;
        }
        this.artworks = opt.artworks;
        return this.trigger('didInitializeArtworks');
      };

      ArtworkLoader.prototype.loadArtworks = function(opt) {
        var iteratee, srcKey;
        if (opt.type === 'src') {
          srcKey = 'src';
        } else if (opt.type === 'thumb') {
          srcKey = 'thumb';
        }
        iteratee = (function(_this) {
          return function(artwork, i) {
            var img, onLoadImg;
            artwork.set('isLoaded', false);
            img = new Image;
            img.src = artwork.get(srcKey);
            onLoadImg = function() {
              artwork.set('is Loaded', true);
              return console.log("Artwork " + (artwork.get('id')) + " Loaded");
            };
            return img.onload(onLoadImg);
          };
        })(this);
        return this.artworks.each;
      };

      return ArtworkLoader;

    })(VC);
    return ArtworkLoader;
  });

}).call(this);
