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
        this.on({
          'didChangeState:current': (function(_this) {
            return function(vc, v) {
              _this.vc[v].setState('isCurrent');
              if (_this.vc[v].getState('isFavorite')) {
                return _this.setState('isCurrentFavorite');
              } else {
                return _this.setState('isCurrentFavorite', false);
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
          })(this),
          'didChangeState:didFetch': (function(_this) {
            return function(vc, v) {
              return _this.render();
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
          })(this),
          'add': (function(_this) {
            return function(m) {
              return _this.render();
            };
          })(this)
        });
        return this.fetch();
      };

      ArtworkListVC.prototype.fetch = function() {
        this.setState('didFetch', false);
        return this.c.fetch({
          from: "local",
          callback: (function(_this) {
            return function(rawArtworks) {
              if (rawArtworks.length > 0) {
                _this.c.add(rawArtworks);
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
        this.$el.empty();
        this.vc = [];
        this.c.map((function(_this) {
          return function(v, i, l) {
            var artworkVC, m;
            m = v;
            artworkVC = new ArtworkVC({
              $root: _this.$el,
              position: 'append',
              template: 'artwork',
              model: m
            });
            _this.vc.push(artworkVC);
            if (m.get('isCurrent')) {
              return _this.setState('current', i);
            }
          };
        })(this));
        current = this.getState('current');
        if (!current) {
          this.random();
        }
        console.log(this.c.length + " Artworks Rendered");
        return this.setState('didRender');
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
