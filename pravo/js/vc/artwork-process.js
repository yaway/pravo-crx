(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/progress', 'vc/mCircularProgressVC'], function(VC, Progress, MCircularProgressVC) {
    var ArtworkProgress;
    ArtworkProgress = (function(superClass) {
      extend(ArtworkProgress, superClass);

      function ArtworkProgress() {
        return ArtworkProgress.__super__.constructor.apply(this, arguments);
      }

      ArtworkProgress.prototype.initialize = function(opt) {
        ArtworkProgress.__super__.initialize.call(this, opt);
        this.model = new Progress;
        this.on({
          'didInitializeArtworks': (function(_this) {
            return function() {
              var total;
              total = _this.artworks.length;
              _this.model.set('total', total);
              return _this.loadArtworks(opt);
            };
          })(this)
        });
        this.initializeArtworks(opt);
        return this.render();
      };

      ArtworkProgress.prototype.update = function() {
        return console.log('Artwork Loader Rendered');
      };

      ArtworkProgress.prototype.initializeArtworks = function(opt) {
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

      ArtworkProgress.prototype.loadArtworks = function(opt) {
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
              var dones;
              artwork.set('isLoaded', true);
              console.log("Artwork " + (artwork.get('id')) + " Loaded");
              dones = _this.artworks.where({
                isLoaded: true
              });
              _this.model.set('done', dones.length);
              if (dones.length === (_this.model.get('total'))) {
                console.error('All Artworks Loaded');
                return _this.model.set('isDone', true);
              }
            };
            return img.onload(onLoadImg);
          };
        })(this);
        return this.artworks.each(iteratee);
      };

      return ArtworkProgress;

    })(VC);
    return ArtworkProgress;
  });

}).call(this);
