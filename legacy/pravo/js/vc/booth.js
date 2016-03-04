(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/vc', 'mc/booth', 'mc/artworks', 'vc/artwork-list', 'core/utl'], function(VC, Booth, Artworks, ArtworkListVC, Utl) {
    var BoothVC;
    BoothVC = (function(superClass) {
      extend(BoothVC, superClass);

      function BoothVC() {
        this.onClickBtnToggleFav = bind(this.onClickBtnToggleFav, this);
        return BoothVC.__super__.constructor.apply(this, arguments);
      }

      BoothVC.prototype.events = {
        "click [data-ui='artwork']": 'onClickArtwork',
        "click [data-ui='btnToggleFav']": 'onClickBtnToggleFav'
      };

      BoothVC.prototype.onClickBtnToggleFav = function(e) {
        var saveOpt;
        e.stopPropagation();
        console.log('BtnFav Clicked');
        this.artworkListVC.toggleState('isCurrentFavorite');
        saveOpt = {
          only: 'fav'
        };
        return this.c.save(saveOpt);
      };

      BoothVC.prototype.initialize = function(opt) {
        BoothVC.__super__.initialize.call(this, opt);
        this.m = new Booth;
        this.c = new Artworks;
        this.on({
          'didChangeState:hasArtworks': (function(_this) {
            return function(vc, v) {
              if (v) {
                return _this.$el.addClass('has-artworks');
              } else {
                return _this.$el.removeClass('has-artworks');
              }
            };
          })(this),
          'didChangeState:blur': (function(_this) {
            return function(vc, v) {
              if (v) {
                return _this.$el.addClass('blur');
              } else {
                return _this.$el.removeClass('blur');
              }
            };
          })(this)
        });
        return this.render();
      };

      BoothVC.prototype.render = function() {
        BoothVC.__super__.render.call(this);
        this.artworkListVC = new ArtworkListVC({
          $root: this.ui.$artworkList,
          collection: this.c
        });
        this.listenTo(this.artworkListVC, 'didChangeState:didAdd', (function(_this) {
          return function(vc, v) {
            if (v) {
              if (vc.c.length > 0) {
                return _this.setState('hasArtworks', true);
              } else {
                return _this.setState('hasArtworks', false);
              }
            }
          };
        })(this));
        return this.listenTo(this.artworkListVC, 'didChangeState:isCurrentFavorite', (function(_this) {
          return function(vc, v) {
            if (v) {
              _this.$el.addClass('is-favorite');
              return _this.ui.$icoToggleFav.text('bookmark');
            } else {
              _this.$el.removeClass('is-favorite');
              return _this.ui.$icoToggleFav.text('bookmark_border');
            }
          };
        })(this));
      };

      return BoothVC;

    })(VC);
    return BoothVC;
  });

}).call(this);
