(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/list', 'mc/artwork', 'mc/artworks', 'vc/artwork', 'found/utl'], function(VC, List, Artwork, Artworks, ArtworkVC, Utl) {
    var ArtworkListVC;
    ArtworkListVC = (function(superClass) {
      extend(ArtworkListVC, superClass);

      function ArtworkListVC() {
        this.onRightClickArtwork = bind(this.onRightClickArtwork, this);
        this.onClickArtwork = bind(this.onClickArtwork, this);
        return ArtworkListVC.__super__.constructor.apply(this, arguments);
      }

      ArtworkListVC.prototype.events = {
        "click [data-ui='artwork']": 'onClickArtwork',
        "contextmenu [data-ui='artwork']": 'onRightClickArtwork'
      };

      ArtworkListVC.prototype.onClickArtwork = function(e) {
        console.log('Artwork Clicked');
        e.stopPropagation();
        return this.loop();
      };

      ArtworkListVC.prototype.onRightClickArtwork = function(e) {
        console.log('Artwork Clicked');
        e.stopPropagation();
        e.preventDefault();
        return this.random();
      };

      ArtworkListVC.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        if (opt.model == null) {
          opt.model = new List;
        }
        if (opt.collection == null) {
          opt.collection = new Artworks;
        }
        ArtworkListVC.__super__.initialize.call(this, opt);
        this.vc = [];
        this.on({
          'didChangeState:current': (function(_this) {
            return function(vc, v) {
              var artworkVC;
              console.error(v);
              if (_this.vc.length > 0) {
                artworkVC = _this.vc[v];
                artworkVC.setState('isCurrent');
                if (artworkVC.getState('isFavorite')) {
                  return _this.setState('isCurrentFavorite');
                } else {
                  return _this.setState('isCurrentFavorite', false);
                }
              }
            };
          })(this),
          'didChangeState:isCurrentFavorite': (function(_this) {
            return function(vc, v) {
              var current;
              current = _this.getState('current');
              if (v) {
                return _this.vc[current].setState('isFavorite');
              } else {
                return _this.vc[current].setState('isFavorite', false);
              }
            };
          })(this)
        });
        this.c.on({
          'willChange:isCurrent': (function(_this) {
            return function(m, v) {
              if (v) {
                return _this.vc.map(function(v, i, l) {
                  return v.setState('isCurrent', false);
                });
              }
            };
          })(this)
        });
        this.render();
        return this.fetch();
      };

      ArtworkListVC.prototype.fetch = function() {
        this.setState('didFetch', false);
        return this.c.fetch({
          from: "local",
          callback: (function(_this) {
            return function(rawArtworks) {
              var artworks;
              if (rawArtworks.length > 0) {
                artworks = new Artworks(rawArtworks);
                _this.add(artworks);
              }
              return _this.setState('didFetch');
            };
          })(this)
        });
      };

      ArtworkListVC.prototype.render = function() {
        var current;
        this.setState('didRender', false);
        ArtworkListVC.__super__.render.call(this);
        if (this.c.length === 0) {
          console.log("No Artworks to Render");
          this.setState('didRender');
          return;
        }
        this.vc = [];
        this.$el.empty();
        this.add(this.c);
        current = this.getState('current');
        console.log(this.c.length + " Artworks Rendered");
        return this.setState('didRender');
      };

      ArtworkListVC.prototype.add = function(mc) {
        var artworks;
        this.setState('didAdd', false);
        if (mc instanceof Artwork) {
          artworks = new Artworks(mc);
        } else if (mc instanceof Artworks) {
          artworks = mc;
        }
        artworks.map((function(_this) {
          return function(artwork, i) {
            var artworkVC;
            if (_this.c.contains(artwork)) {
              _this.vc.map(function(artworkVC, i) {
                return console.error(artworkVC.m === artwork);
              });
            } else {
              artworkVC = new ArtworkVC({
                $root: _this.$el,
                position: 'append',
                template: 'artwork',
                model: artwork
              });
              _this.c.add(artwork);
              _this.vc.push(artworkVC);
            }
            if (artwork.get('isCurrent')) {
              return _this.setCurrent(artwork);
            }
          };
        })(this));
        return this.setState('didAdd');
      };

      ArtworkListVC.prototype.setCurrent = function(artwork) {
        var index;
        index = this.c.models.indexOf(artwork);
        return this.setState('current', index);
      };

      ArtworkListVC.prototype.loop = function() {
        var current, length, next;
        length = this.vc.length;
        if (length < 2) {
          return;
        }
        current = this.getState('current');
        next = Utl.getNextInt(current, length);
        return this.setState('current', next);
      };

      ArtworkListVC.prototype.random = function() {
        return this.setState('current', Utl.getRandomInt(this.vc.length));
      };

      return ArtworkListVC;

    })(VC);
    return ArtworkListVC;
  });

}).call(this);
