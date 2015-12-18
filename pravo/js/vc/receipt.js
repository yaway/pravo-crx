(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/artwork', 'mc/artworks', 'mc/feed', 'mc/feeds', 'mc/receipt', 'mc/scroll', 'mc/progress', 'vc/artwork-thumbnail', 'vc/artwork-feed', 'vc/scroll', 'vc/artwork-progress'], function(VC, Artwork, Artworks, Feed, Feeds, Receipt, Scroll, Progress, ArtworkThumbnailVC, ArtworkFeedVC, ScrollVC, ArtworkProgressVC) {
    var ReceiptVC;
    ReceiptVC = (function(superClass) {
      extend(ReceiptVC, superClass);

      function ReceiptVC() {
        this.initializeFeeds = bind(this.initializeFeeds, this);
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
        console.log('BtnFoldDrawer Clicked');
        e.stopPropagation();
        return this.model.set('isUnfolded', false);
      };

      ReceiptVC.prototype.onClickBtnUnfoldDrawer = function(e) {
        console.log('BtnUnfoldDrawer Clicked');
        e.stopPropagation();
        return this.model.set('isUnfolded', true);
      };

      ReceiptVC.prototype.onMorphBtnUnfoldDrawer = function(e) {
        console.log('BtnUnfoldDrawer Morphed');
        if (this.$el.hasClass('is-unfolded')) {
          return;
        }
        return this.$el.addClass('is-morphed');
      };

      ReceiptVC.prototype.onClickToolbarTitle = function(e) {
        console.log('ToolbarTitle Clicked');
        e.stopPropagation();
        return this.model.toggle('isFeedListUnfolded');
      };

      ReceiptVC.prototype.initialize = function(opt) {
        ReceiptVC.__super__.initialize.call(this, opt);
        this.model = new Receipt;
        this.model.on({
          'change:hasArtworks': (function(_this) {
            return function(m, v) {
              if (v) {
                return _this.$el.addClass('has-artworks');
              } else {
                return _this.$el.removeClass('has-artworks');
              }
            };
          })(this),
          'change:isUnfolded': (function(_this) {
            return function(m, v) {
              if (v) {
                _this.unfoldDrawer();
                _this.scrollVC.setSize();
                return _this.model.set('isFeedListUnfolded', false);
              } else {
                return _this.foldDrawer();
              }
            };
          })(this),
          'change:isFeedListUnfolded': (function(_this) {
            return function(m, v) {
              if (v) {
                return _this.$el.addClass('is-feed-list-unfolded');
              } else {
                return _this.$el.removeClass('is-feed-list-unfolded');
              }
            };
          })(this),
          'change:isFeedsUpdated': (function(_this) {
            return function(m, v) {
              if (v) {
                _this.renderFeeds();
                _this.initializeArtworks();
                _this.model.set('isFeedListUnfolded', false);
                return _this.model.set('isFeedsUpdated', false);
              }
            };
          })(this),
          'change:isArtworksUpdated': (function(_this) {
            return function(m, v) {
              if (v) {
                _this.model.set('hasArtworks', true);
                _this.renderArtworkProgress();
                return _this.model.set('isArtworksUpdated', false);
              }
            };
          })(this),
          'change:isArtworksLoaded': (function(_this) {
            return function(m, v) {
              if (v) {
                _this.renderArtworks();
                _this.scrollVC.setSize();
                return _this.model.set('isArtworksLoaded', false);
              }
            };
          })(this)
        });
        this.initializeFeeds();
        return this.render();
      };

      ReceiptVC.prototype.unfoldDrawer = function() {
        this.$el.addClass('is-unfolded');
        return this.$el.removeClass('is-morphed');
      };

      ReceiptVC.prototype.foldDrawer = function() {
        return this.$el.removeClass('is-unfolded');
      };

      ReceiptVC.prototype.update = function() {
        console.log("Receipt Rendered");
        return this.renderScroll();
      };

      ReceiptVC.prototype.initializeFeeds = function() {
        var alterFeeds;
        alterFeeds = [
          {
            name: "unsplash",
            isCurrent: true
          }, {
            name: "konachan"
          }
        ];
        this.feeds = new Feeds;
        this.feeds.on({
          'didChangeIsCurrent': (function(_this) {
            return function(v) {
              return _this.model.set("isFeedsUpdated", true);
            };
          })(this)
        });
        return this.feeds.fetch({
          callback: (function(_this) {
            return function(rawFeeds) {
              if (rawFeeds.length === 0) {
                _this.feeds.reset(alterFeeds);
              } else {
                _this.feeds.reset(rawFeeds);
              }
              return _this.model.set("isFeedsUpdated", true);
            };
          })(this)
        });
      };

      ReceiptVC.prototype.renderFeeds = function() {
        var currentFeed;
        this.ui.$feedList.empty();
        console.log("Feeds Rendered");
        this.feeds.each((function(_this) {
          return function(feed) {
            var feedVC;
            return feedVC = new ArtworkFeedVC({
              $root: _this.ui.$feedList,
              position: 'append',
              template: 'artworkFeed',
              model: feed
            });
          };
        })(this));
        currentFeed = this.feeds.findWhere({
          isCurrent: true
        });
        if (currentFeed) {
          return this.ui.$feedName.text(currentFeed.get('name'));
        }
      };

      ReceiptVC.prototype.initializeArtworks = function(opt) {
        var feed, feedName;
        if (opt == null) {
          opt = {};
        }
        feed = opt.feed || this.feeds.findWhere({
          'isCurrent': true
        });
        feedName = feed.get('name');
        this.artworks = new Artworks;
        this.artworks.on({
          'update': (function(_this) {
            return function() {
              return _this.model.set('isArtworksUpdated', true);
            };
          })(this)
        });
        return this.artworks.fetch({
          from: feedName,
          callback: (function(_this) {
            return function(rawArtworks) {
              return _this.artworks.add(rawArtworks);
            };
          })(this)
        });
      };

      ReceiptVC.prototype.renderArtworks = function() {
        if (!this.artworks) {
          console.log("No Artworks to Render");
          return;
        }
        console.log(this.artworks.length + " Receipt Artworks Rendered");
        this.ui.$artworkList.empty();
        return this.artworks.each((function(_this) {
          return function(artwork) {
            var artworkVC;
            return artworkVC = new ArtworkThumbnailVC({
              $root: _this.ui.$artworkList,
              position: 'append',
              template: 'artworkThumbnail',
              model: artwork
            });
          };
        })(this));
      };

      ReceiptVC.prototype.renderScroll = function() {
        this.scroll = new Scroll({
          direction: 'v'
        });
        return this.scrollVC = new ScrollVC({
          $root: this.ui.$scroll,
          $scrollee: this.ui.$artworkList,
          model: this.scroll
        });
      };

      ReceiptVC.prototype.renderArtworkProgress = function(opt) {
        var template;
        if (opt == null) {
          opt = {};
        }
        if (opt.indicatorType == null) {
          opt.indicatorType = 'linear';
        }
        if (opt.indicatorType === 'linear') {
          template = 'mLinearProgress';
        } else if (opt.indicatorType === 'circular') {
          template = 'mCircularProgress';
        }
        this.progress = new Progress({
          artworkType: 'thumb',
          indicatorType: opt.indicatorType
        });
        this.progress.on({
          'change:isDone': (function(_this) {
            return function(m, v) {
              if (v) {
                _this.model.set('isArtworksLoaded', true);
                return _this.progress.set('isDone', false);
              }
            };
          })(this)
        });
        this.artworkProgressVC = new ArtworkProgressVC({
          $root: this.ui.$drawer,
          model: this.progress,
          artworks: this.artworks,
          template: template,
          position: 'prepend'
        });
        return this.artworkProgressVC.$el.addClass('top');
      };

      ReceiptVC.prototype.updateBC = function() {
        var className, i, len, ref, results;
        ref = ['is-dark', 'is-light', 'is-complex'];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          className = ref[i];
          if (this.ui.$btnTogglePanel.hasClass(className)) {
            results.push(this.$el.addClass(className));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };

      return ReceiptVC;

    })(VC);
    return ReceiptVC;
  });

}).call(this);
