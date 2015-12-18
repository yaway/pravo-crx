(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/artwork', 'mc/artworks', 'mc/booth', 'vc/artwork'], function(VC, Artwork, Artworks, Booth, ArtworkVC) {
    var BoothVC;
    BoothVC = (function(superClass) {
      extend(BoothVC, superClass);

      function BoothVC() {
        this.onArtworksChangeIsCurrent = bind(this.onArtworksChangeIsCurrent, this);
        this.onArtworksChangeIsFavorite = bind(this.onArtworksChangeIsFavorite, this);
        this.onArtworksAdd = bind(this.onArtworksAdd, this);
        this.onArtworksUpdate = bind(this.onArtworksUpdate, this);
        this.initializeArtworks = bind(this.initializeArtworks, this);
        this.onChangeHasArtworks = bind(this.onChangeHasArtworks, this);
        this.onClickBtnToggleFav = bind(this.onClickBtnToggleFav, this);
        this.onClickArtwork = bind(this.onClickArtwork, this);
        return BoothVC.__super__.constructor.apply(this, arguments);
      }

      BoothVC.prototype.events = {
        "click [data-ui='artwork']": 'onClickArtwork',
        "contextmenu [data-ui='artwork']": 'onClickArtwork',
        "click [data-ui='btnToggleFav']": 'onClickBtnToggleFav'
      };

      BoothVC.prototype.onClickArtwork = function(e) {
        console.log('Artwork Clicked');
        e.stopPropagation();
        if (this.model.get('ableToLoop')) {
          this.artworks.loop();
          this.updateStateFavorite();
        }
        return this.trigger('didClickArtwork');
      };

      BoothVC.prototype.onClickBtnToggleFav = function(e) {
        var currentArtwork;
        e.stopPropagation();
        console.log('BtnFav Clicked');
        currentArtwork = this.artworks.getCurrent();
        console.log(currentArtwork);
        return currentArtwork.toggle('isFavorite');
      };

      BoothVC.prototype.initialize = function(opt) {
        BoothVC.__super__.initialize.call(this, opt);
        this.artworks = new Artworks;
        this.artworks.on({
          'didFetchFromLocal': this.onArtworksDidFetchFromLocal,
          'didFetchFromServer': this.onArtworksDidFetchFromServer,
          'change:isFavorite': this.onArtworksChangeIsFavorite,
          'change:isCurrent': this.onArtworksChangeIsCurrent,
          'add': this.onArtworksAdd,
          'update': this.onArtworksUpdate
        });
        this.model = new Booth;
        this.model.on({
          'change:hasArtworks': this.onChangeHasArtworks
        });
        return this.render();
      };

      BoothVC.prototype.update = function() {
        console.log("Booth Rendered");
        return this.initializeArtworks();
      };

      BoothVC.prototype.onChangeHasArtworks = function() {
        if (this.model.get('hasArtworks')) {
          return this.$el.addClass('has-artworks');
        } else {
          return this.$el.removeClass('has-artworks');
        }
      };

      BoothVC.prototype.initializeArtworks = function() {
        return this.artworks.fetch({
          from: "local",
          callback: (function(_this) {
            return function(rawArtworks) {
              var index;
              if (rawArtworks.length > 0) {
                index = Math.floor(Math.random() * rawArtworks.length);
                rawArtworks[index].isCurrent = true;
                return _this.artworks.add(rawArtworks);
              }
            };
          })(this)
        });
      };

      BoothVC.prototype.onArtworksUpdate = function() {
        console.log("Booth Artworks Updated");
        return this.renderArtworks();
      };

      BoothVC.prototype.onArtworksAdd = function(artwork) {
        if (artwork.get('isCurrent')) {
          artwork.trigger('willChangeIsCurrent');
          return artwork.set('isCurrent', true);
        }
      };

      BoothVC.prototype.onArtworksChangeIsFavorite = function() {
        this.updateStateFavorite();
        return this.artworks.save({
          only: "fav"
        });
      };

      BoothVC.prototype.onArtworksChangeIsCurrent = function() {
        this.updateStateFavorite();
        return this.trigger('didChangeCurrentArtwork');
      };

      BoothVC.prototype.updateStateFavorite = function() {
        var currentArtwork;
        if (this.artworks.length === 0) {
          return;
        }
        currentArtwork = this.artworks.getCurrent();
        if (currentArtwork != null ? currentArtwork.get('isFavorite') : void 0) {
          this.$el.addClass('is-favorite');
          return this.ui.$icoToggleFav.text('bookmark');
        } else {
          this.$el.removeClass('is-favorite');
          return this.ui.$icoToggleFav.text('bookmark_border');
        }
      };

      BoothVC.prototype.renderArtworks = function() {
        var artwork, artworkVC, i, len, ref;
        this.ui.$artworkList.empty();
        if (this.artworks.length === 0) {
          console.log("No Artworks to Render");
          return;
        }
        console.log(this.artworks.length + " Booth Artworks Rendered");
        this.model.set('hasArtworks', true);
        ref = this.artworks.models;
        for (i = 0, len = ref.length; i < len; i++) {
          artwork = ref[i];
          artworkVC = new ArtworkVC({
            $root: this.ui.$artworkList,
            position: 'append',
            template: 'artwork',
            model: artwork
          });
        }
        this.updateStateFavorite();
        return this.trigger('didRenderArtworks');
      };

      return BoothVC;

    })(VC);
    return BoothVC;
  });

}).call(this);
