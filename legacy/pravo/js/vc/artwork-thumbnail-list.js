(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/vc', 'mc/artwork-thumbnail-list', 'mc/artwork', 'mc/artworks', 'vc/artwork-thumbnail', 'core/utl'], function(VC, ArtworkThumbnailList, Artwork, Artworks, ArtworkThumbnailVC, Utl) {
    var ArtworkThumbnailListVC;
    ArtworkThumbnailListVC = (function(superClass) {
      extend(ArtworkThumbnailListVC, superClass);

      function ArtworkThumbnailListVC() {
        this.onClickArtwork = bind(this.onClickArtwork, this);
        return ArtworkThumbnailListVC.__super__.constructor.apply(this, arguments);
      }

      ArtworkThumbnailListVC.prototype.events = {
        "click [data-ui='artwork']": 'onClickArtwork'
      };

      ArtworkThumbnailListVC.prototype.onClickArtwork = function(e) {
        console.log('Artwork Clicked');
        return e.stopPropagation();
      };

      ArtworkThumbnailListVC.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        if (opt.model == null) {
          opt.model = new ArtworkThumbnailList;
        }
        ArtworkThumbnailListVC.__super__.initialize.call(this, opt);
        return this.fetch();
      };

      ArtworkThumbnailListVC.prototype.fetch = function(c) {
        var callback, callbacks;
        this.setState('willFetch');
        this.setState('didFetch', false);
        if (c) {
          this.c = c;
        }
        callback = (function(_this) {
          return function(rawC) {
            if (rawC.length > 0) {
              if (_this.getState('from')) {
                _this.c.reset(rawC);
              } else {
                _this.c.add(rawC);
              }
              _this.setState('willFetch', false);
              return _this.setState('didFetch');
            }
          };
        })(this);
        callbacks = (this.getState('callbacks')) || [];
        callbacks.push(callback);
        this.setState('callbacks', callbacks);
        return this.c.fetch({
          from: this.getState('from'),
          callback: (function(_this) {
            return function(rawC) {
              var cbs, lastCb;
              cbs = _this.getState('callbacks');
              lastCb = (cbs.slice(-1))[0];
              if (callback === lastCb) {
                return callback(rawC);
              }
            };
          })(this)
        });
      };

      ArtworkThumbnailListVC.prototype.checkContained = function(c) {
        return c.map((function(_this) {
          return function(artwork, i) {
            var artworkId, filter, isContained;
            artworkId = artwork.get('id');
            filter = {
              id: artworkId
            };
            isContained = (_this.c.where(filter)).length > 0;
            if (isContained) {
              return console.error(c);
            }
          };
        })(this));
      };

      ArtworkThumbnailListVC.prototype.render = function() {
        ArtworkThumbnailListVC.__super__.render.call(this);
        this.setState('didRender', false);
        this.setState('willRender');
        if (this.c.length === 0) {
          console.log("No Artworks to Render");
          this.setState('willRender', false);
          this.setState('didRender');
          return;
        }
        this.$el.empty();
        this.vc = [];
        this.c.map((function(_this) {
          return function(v, i, l) {
            var artworkVC, m;
            m = v;
            artworkVC = new ArtworkThumbnailVC({
              $root: _this.$el,
              position: 'append',
              template: 'artworkThumbnail',
              model: m
            });
            return _this.vc.push(artworkVC);
          };
        })(this));
        console.log(this.c.length + " Artwork Thumbnails Rendered");
        this.setState('willRender', false);
        return this.setState('didRender');
      };

      return ArtworkThumbnailListVC;

    })(VC);
    return ArtworkThumbnailListVC;
  });

}).call(this);
