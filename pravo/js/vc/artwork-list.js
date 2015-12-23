(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/list', 'mc/artwork', 'mc/artworks', 'vc/artwork', 'found/utl'], function(VC, List, Artwork, Artworks, ArtworkVC, Utl) {
    var ArtworkListVC;
    ArtworkListVC = (function(superClass) {
      extend(ArtworkListVC, superClass);

      function ArtworkListVC() {
        this.onClickArtwork = bind(this.onClickArtwork, this);
        return ArtworkListVC.__super__.constructor.apply(this, arguments);
      }

      ArtworkListVC.prototype.events = {
        "click [data-ui='artwork']": 'onClickArtwork'
      };

      ArtworkListVC.prototype.onClickArtwork = function(e) {
        console.log('Artwork Clicked');
        e.stopPropagation();
        return this.loop();
      };

      ArtworkListVC.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        ArtworkListVC.__super__.initialize.call(this, opt);
        this.m = new List;
        this.c = opt.artworks || new Artworks;
        this.c.on({
          'willChange:isCurrent': (function(_this) {
            return function(m, v) {
              if (v) {
                return _this.vc.map(function(v, i, l) {
                  var artworkVC;
                  artworkVC = v;
                  return artworkVC.setState('isCurrent', false);
                });
              }
            };
          })(this)
        });
        this.on({
          'didChangeState:isFetched': (function(_this) {
            return function(m, v) {
              if (v) {
                _this.setState('isRendered');
                return _this.resetState('isFetched');
              }
            };
          })(this),
          'didChangeState:isRendered': (function(_this) {
            return function(m, v) {
              if (v) {
                _this.render();
                return _this.resetState('isRendered');
              }
            };
          })(this)
        });
        return this.fetch();
      };

      ArtworkListVC.prototype.fetch = function() {
        return this.c.fetch({
          from: "local",
          callback: (function(_this) {
            return function(rawArtworks) {
              if (rawArtworks.length > 0) {
                _this.c.add(rawArtworks);
                return _this.setState('isFetched');
              }
            };
          })(this)
        });
      };

      ArtworkListVC.prototype.render = function() {
        var current;
        ArtworkListVC.__super__.render.call(this);
        if (this.c.length === 0) {
          console.log("No Artworks to Render");
          return;
        }
        this.vc = [];
        this.$el.empty();
        this.c.map((function(_this) {
          return function(v, i, l) {
            var artwork, artworkVC;
            artwork = v;
            artworkVC = new ArtworkVC({
              $root: _this.$el,
              position: 'append',
              template: 'artwork',
              model: artwork
            });
            if (artwork.get('isCurrent')) {
              _this.setState('current', i);
            }
            return _this.vc.push(artworkVC);
          };
        })(this));
        current = this.getState('current');
        if (!current) {
          this.setState('current', Utl.getRandomInt(this.vc.length));
          current = this.getState('current');
          this.vc[current].setState('isCurrent');
        }
        return console.debug(this.c.length + " Artworks Rendered");
      };

      ArtworkListVC.prototype.loop = function() {
        var current, length, next;
        length = this.vc.length;
        if (length < 2) {
          return;
        }
        current = this.getState('current');
        next = Utl.getNextInt(current, length);
        this.vc[next].setState('isCurrent');
        return this.setState('current', next);
      };

      return ArtworkListVC;

    })(VC);
    return ArtworkListVC;
  });

}).call(this);
