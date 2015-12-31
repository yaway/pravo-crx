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
        this.m = new Receipt;
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
          'didChangeState:isDrawerUnfolded': (function(_this) {
            return function(mv, v) {
              if (v) {
                _this.scrollVC.refresh();
                return _this.$el.addClass('is-drawer-unfolded');
              } else {
                return _this.$el.removeClass('is-drawer-unfolded');
              }
            };
          })(this)
        });
        return this.render();
      };

      ReceiptVC.prototype.render = function() {
        ReceiptVC.__super__.render.call(this);
        console.log("Receipt Rendered");
        this.renderFeedList();
        this.renderArtworkList();
        this.renderScroll();
        this.renderRefreshProgress();
        this.renderFetchProgress();
        this.listenTo(this.feedListVC, 'didChangeState:current', (function(_this) {
          return function(vc, v) {
            _this.ui.$feedName.text(v);
            _this.artworkListVC.setState('from', v);
            return _this.artworkListVC.fetch();
          };
        })(this));
        this.listenTo(this.artworkListVC, 'didChangeState:willFetch', (function(_this) {
          return function(vc, v) {
            if (v) {
              _this.refreshProgressVC.setState('infinite');
              return _this.refreshProgressVC.load();
            }
          };
        })(this));
        this.listenTo(this.artworkListVC, 'didChangeState:didFetch', (function(_this) {
          return function(vc, v) {
            if (v) {
              _this.setState('hasArtworks');
              _this.refreshProgressVC.setState('infinite', false);
              return _this.refreshProgressVC.load();
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
              setTimeout(timeout, 4);
              _this.scrollVC.refresh();
              return _this.fetchProgressVC.setState('isLoading', false);
            }
          };
        })(this));
        this.listenTo(this.refreshProgressVC, 'didChangeState:isDone', (function(_this) {
          return function(vc, v) {
            if (v) {
              return _this.artworkListVC.render();
            }
          };
        })(this));
        return this.listenTo(this.scrollVC, 'didChangeState:didScrollToEnd', (function(_this) {
          return function(vc, v) {
            if (v) {
              return _this.fetchProgressVC.load();
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

      ReceiptVC.prototype.renderScroll = function() {
        var scroll;
        scroll = new Scroll({
          direction: 'v'
        });
        return this.scrollVC = new ScrollVC({
          $root: this.ui.$scroll,
          $scrollee: this.ui.$artworkList,
          model: scroll
        });
      };

      ReceiptVC.prototype.renderRefreshProgress = function() {
        var progress;
        progress = new ArtworkProgress({
          artworkType: 'thumb',
          indicatorType: 'linear'
        });
        this.refreshProgressVC = new ArtworkProgressVC({
          $root: this.ui.$drawer,
          model: progress,
          collection: this.c,
          position: 'prepend'
        });
        this.refreshProgressVC.$el.addClass('top');
        return this.refreshProgressVC.load();
      };

      ReceiptVC.prototype.renderFetchProgress = function() {
        var progress;
        progress = new ArtworkProgress({
          artworkType: 'thumb',
          indicatorType: 'circular',
          infinite: true
        });
        this.fetchProgressVC = new ArtworkProgressVC({
          $root: this.ui.$scroll,
          model: progress,
          collection: this.c,
          position: 'append'
        });
        return this.fetchProgressVC.$el.addClass('right');
      };

      return ReceiptVC;

    })(VC);
    return ReceiptVC;
  });

}).call(this);
