(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/progress', 'vc/m-circular-progress'], function(VC, Progress, MCircularProgressVC) {
    var ArtworkProgress;
    ArtworkProgress = (function(superClass) {
      extend(ArtworkProgress, superClass);

      function ArtworkProgress() {
        return ArtworkProgress.__super__.constructor.apply(this, arguments);
      }

      ArtworkProgress.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        ArtworkProgress.__super__.initialize.call(this, opt);
        if (!opt.artworks) {
          console.log("No Artwork to Load");
          return;
        }
        this.artworks = opt.artworks;
        if (this.model == null) {
          this.model = new Progress;
        }
        this.model.set('total', this.artworks.length);
        this.model.on({
          'change:isDone': (function(_this) {
            return function(m, v) {
              if (v) {
                return _this.$el.addClass('is-done');
              } else {
                return _this.$el.removeClass('is-done');
              }
            };
          })(this)
        });
        this.loadArtworks();
        return this.render();
      };

      ArtworkProgress.prototype.update = function() {
        return console.log('Artwork Progress Rendered');
      };

      ArtworkProgress.prototype.loadArtworks = function() {
        var iteratee, srcKey;
        if ((this.model.get('artworkType')) === 'src') {
          srcKey = 'src';
        } else if ((this.model.get('artworkType')) === 'thumb') {
          srcKey = 'thumb';
        } else {
          return;
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
                console.log('All Artworks Loaded');
                return _this.model.set('isDone', true);
              }
            };
            return img.onload = onLoadImg;
          };
        })(this);
        return this.artworks.forEach(iteratee);
      };

      return ArtworkProgress;

    })(VC);
    return ArtworkProgress;
  });

}).call(this);
