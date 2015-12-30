(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/artworks', 'mc/feeds', 'mc/receipt', 'mc/scroll', 'mc/artwork-progress', 'vc/feed-list', 'vc/artwork-thumbnail-list', 'vc/scroll', 'vc/artwork-progress'], function(VC, Artworks, Feeds, Receipt, Scroll, ArtworkProgress, FeedListVC, ArtworkThumbnailListVC, ScrollVC, ArtworkProgressVC) {
    var ReceiptVC;
    ReceiptVC = (function(superClass) {
      extend(ReceiptVC, superClass);

      function ReceiptVC() {
        this.onClickToolbarTitle = bind(this.onClickToolbarTitle, this);
        this.onMorphBtnUnfoldDrawer = bind(this.onMorphBtnUnfoldDrawer, this);
        this.onClickBtnUnfoldDrawer = bind(this.onClickBtnUnfoldDrawer, this);
        this.onClickBtnFoldDrawer = bind(this.onClickBtnFoldDrawer, this);
        return ReceiptVC.__super__.constructor.apply(this, arguments);
      }

      ReceiptVC.prototype.events = {
        "click [data-ui='btnUnfoldDrawer']": "onClickBtnUnfoldDrawer",
        "click [data-ui='btnFoldDrawer']": "onClickBtnFoldDrawer",
        "transitionend [data-ui='btnUnfoldDrawer']": "onMorphBtnUnfoldDrawer",
        "click [data-ui='toobarTitle']": "onClickToolbarTitle"
      };

      ReceiptVC.prototype.onClickBtnFoldDrawer = function(e) {
        e.stopPropagation();
        return this.setState('isDrawerUnfolded', false);
      };

      ReceiptVC.prototype.onClickBtnUnfoldDrawer = function(e) {
        e.stopPropagation();
        return this.setState('isDrawerUnfolded');
      };

      ReceiptVC.prototype.onMorphBtnUnfoldDrawer = function(e) {
        if (this.getState('isDrawerUnfolded')) {
          return this.$el.addClass('is-morphing');
        } else {
          return this.$el.removeClass('is-morphing');
        }
      };

      ReceiptVC.prototype.onClickToolbarTitle = function(e) {
        console.log('Toolbar Title Clicked');
        e.stopPropagation();
        return this.feedListVC.setState('isUnfolded');
      };

      ReceiptVC.prototype.initialize = function(opt) {
        ReceiptVC.__super__.initialize.call(this, opt);
        this.model = new Receipt;
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
          'didChangeState:isDrawerUnfolded': (function(_this) {
            return function(mv, v) {
              if (v) {
                _this.scrollVC.resize();
                return _this.$el.addClass('is-drawer-unfolded');
              } else {
                return _this.$el.removeClass('is-drawer-unfolded');
              }
            };
          })(this)
        });
        this.c = new Artworks;
        return this.render();
      };

      ReceiptVC.prototype.render = function() {
        ReceiptVC.__super__.render.call(this);
        console.log("Receipt Rendered");
        this.renderFeedList();
        this.renderArtworkList();
        this.renderScroll();
        this.renderArtworkProgress();
        this.listenTo(this.feedListVC, 'didChangeState:current', (function(_this) {
          return function(vc, v) {
            var feed;
            if (v) {
              feed = vc.getState('current');
              _this.ui.$feedName.text(feed);
              _this.artworkListVC.setState('from', feed);
              return _this.artworkListVC.fetch();
            }
          };
        })(this));
        this.listenTo(this.artworkListVC, 'didChangeState:willFetch', (function(_this) {
          return function(vc, v) {
            var opt;
            if (v) {
              opt = {
                infinite: true
              };
              return _this.artworkProgressVC.load(opt);
            }
          };
        })(this));
        this.listenTo(this.artworkListVC, 'didChangeState:didFetch', (function(_this) {
          return function(vc, v) {
            if (v) {
              _this.setState('hasArtworks');
              return _this.artworkProgressVC.load();
            }
          };
        })(this));
        this.listenTo(this.artworkListVC, 'didChangeState:willRender', (function(_this) {
          return function(vc, v) {
            if (v) {
              return _this.$el.addClass('is-artwork-list-rendering');
            }
          };
        })(this));
        this.listenTo(this.artworkListVC, 'didChangeState:didRender', (function(_this) {
          return function(vc, v) {
            var timeout;
            if (v) {
              timeout = function() {
                return _this.$el.removeClass('is-artwork-list-rendering');
              };
              setTimeout(timeout, 200);
              return _this.scrollVC.resize();
            }
          };
        })(this));
        return this.listenTo(this.artworkProgressVC, 'didChangeState:isDone', (function(_this) {
          return function(vc, v) {
            if (v) {
              return _this.artworkListVC.render();
            }
          };
        })(this));
      };

      ReceiptVC.prototype.renderFeedList = function() {
        return this.feedListVC = new FeedListVC({
          $root: this.ui.$feedList
        });
      };

      ReceiptVC.prototype.renderArtworkList = function() {
        if (!this.c) {
          console.log("No Artworks to Render");
          return;
        }
        return this.artworkListVC = new ArtworkThumbnailListVC({
          $root: this.ui.$artworkList,
          collection: this.c
        });
      };

      ReceiptVC.prototype.renderScroll = function(scroll) {
        if (scroll == null) {
          scroll = new Scroll({
            direction: 'v'
          });
        }
        return this.scrollVC = new ScrollVC({
          $root: this.ui.$scroll,
          $scrollee: this.ui.$artworkList,
          model: scroll
        });
      };

      ReceiptVC.prototype.renderArtworkProgress = function(progress) {
        if (progress == null) {
          progress = new ArtworkProgress;
        }
        if (this.artworkProgressVC == null) {
          this.artworkProgressVC = new ArtworkProgressVC({
            $root: this.ui.$drawer,
            model: progress,
            collection: this.c,
            position: 'prepend'
          });
        }
        this.artworkProgressVC.$el.addClass('top');
        return this.artworkProgressVC.load();
      };

      return ReceiptVC;

    })(VC);
    return ReceiptVC;
  });

}).call(this);
