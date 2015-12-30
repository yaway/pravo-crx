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
        this.on({
          'didChangeState:isFetched': (function(_this) {
            return function(vc, v) {
              if (v) {
                _this.setState('isRendered');
                return _this.resetState('isFetched');
              }
            };
          })(this),
          'didChangeState:isRendered': (function(_this) {
            return function(vc, v) {
              if (v) {
                _this.render();
                return _this.resetState('isRendered');
              }
            };
          })(this),
          'didChangeState:current': (function(_this) {
            return function(vc, v) {
              return _this.vc[v].setState('isCurrent');
            };
          })(this),
          'didChangeState:isCurrentFav': (function(_this) {
            return function(vc, v) {
              var current;
              current = _this.getState('current');
              if (v) {
                _this.vc[current].setState('isFavorite');
              } else {
                _this.vc[current].setState('isFavorite', false);
              }
              return _this.c.save();
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
          this.random();
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
