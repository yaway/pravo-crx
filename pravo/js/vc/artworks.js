(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/artwork', 'mc/artworks', 'mc/booth', 'vc/artwork', 'found/utl'], function(VC, Artwork, Artworks, Booth, ArtworkVC, Utl) {
    Artworks = (function(superClass) {
      extend(Artworks, superClass);

      function Artworks() {
        this.onClickArtwork = bind(this.onClickArtwork, this);
        return Artworks.__super__.constructor.apply(this, arguments);
      }

      Artworks.prototype.events = {
        "click [data-ui='artwork']": 'onClickArtwork'
      };

      Artworks.prototype.onClickArtwork = function(e) {
        console.log('Artwork Clicked');
        e.stopPropagation();
        if (this.model.get('ableToLoop')) {
          return this.c.loop();
        }
      };

      Artworks.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        Artworks.__super__.initialize.call(this, opt);
        this.vc = [];
        this.c = new Artworks;
        this.c.on({
          'didFetchFromLocal': this.onArtworksDidFetchFromLocal,
          'didFetchFromServer': this.onArtworksDidFetchFromServer,
          'change:isFavorite': this.onArtworksChangeIsFavorite,
          'change:isCurrent': this.onArtworksChangeIsCurrent,
          'add': this.onArtworksAdd,
          'update': this.onArtworksUpdate
        });
        this.c = opt.artworks || new Artworks;
        this.c.on({
          'update': (function(_this) {
            return function() {
              return _this.setState('isUpdated');
            };
          })(this)
        });
        return this.on({
          'didChangeState:isUpdated': (function(_this) {
            return function(m, v) {
              if (v) {
                _this.setState('isRendered');
                return _this.resetState('isUpdated');
              }
            };
          })(this),
          'didChangeState:isRendered': (function(_this) {
            return function(m, v) {
              if (v) {
                _this.renderArtworks();
                return _this.resetState('isRendered');
              }
            };
          })(this)
        });
      };

      Artworks.prototype.update = function() {
        return this.c.fetch({
          from: "local",
          callback: (function(_this) {
            return function(rawArtworks) {
              if (rawArtworks.length > 0) {
                _this.c.add(rawArtworks);
                return _this.setState('isUpdated');
              }
            };
          })(this)
        });
      };

      Artworks.prototype.render = function() {
        if (this.c.length === 0) {
          console.log("No Artworks to Render");
          return;
        }
        this.$el.empty();
        this.c.map((function(_this) {
          return function(v, i) {
            var artworkVC;
            return artworkVC = new ArtworkVC({
              $root: _this.ui.$artworkList,
              position: 'append',
              template: 'artwork',
              model: artwork
            });
          };
        })(this));
        if (this.ci == null) {
          this.ci = Utl.getRandomInt(this.vc.length);
        }
        this.vc[this.ci].setState('isCurrent');
        return console.debug(this.c.length + " Booth Artworks Rendered");
      };

      return Artworks;

    })(VC);
    return Artworks;
  });

}).call(this);
