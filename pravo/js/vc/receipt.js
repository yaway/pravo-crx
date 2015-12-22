(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/artwork', 'mc/artworks', 'mc/feed', 'mc/feeds', 'mc/receipt', 'mc/scroll', 'mc/progress', 'vc/artwork-thumbnail', 'vc/artwork-feed', 'vc/scroll', 'vc/artwork-progress'], function(VC, Artwork, Artworks, Feed, Feeds, Receipt, Scroll, Progress, ArtworkThumbnailVC, ArtworkFeedVC, ScrollVC, ArtworkProgressVC) {
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
        return this.resetState('isDrawerUnfolded');
      };

      ReceiptVC.prototype.onClickBtnUnfoldDrawer = function(e) {
        e.stopPropagation();
        return this.setState('isDrawerUnfolded');
      };

      ReceiptVC.prototype.onMorphBtnUnfoldDrawer = function(e) {
        if (this.$el.hasClass('is-drawer-unfolded')) {
          return this.$el.addClass('is-morphing');
        } else {
          return this.$el.removeClass('is-morphing');
        }
      };

      ReceiptVC.prototype.onClickToolbarTitle = function(e) {
        console.log('ToolbarTitle Clicked');
        e.stopPropagation();
        return this.toggleState('isFeedListUnfolded');
      };

      ReceiptVC.prototype.initialize = function(opt) {
        ReceiptVC.__super__.initialize.call(this, opt);
        this.model = new Receipt;
        this.model.on({
          'change:isDrawerUnfolded': (function(_this) {
            return function(m, v) {
              if (v) {
                _this.scrollVC.resize();
                return _this.$el.addClass('is-drawer-unfolded');
              } else {
                return _this.$el.removeClass('is-drawer-unfolded');
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
          'change:isFeedsUpdating': (function(_this) {
            return function(m, v) {
              if (v) {
                console.debug('Receipt: isFeedsUpdating');
                _this.updateFeeds();
                return _this.resetState('isFeedsUpdating');
              }
            };
          })(this),
          'change:isFeedsUpdated': (function(_this) {
            return function(m, v) {
              if (v) {
                console.debug('Receipt: isFeedsUpdated');
                _this.setState('isArtworksUpdating');
                _this.setState('isFeedsRendered');
                return _this.resetState('isFeedsUpdated');
              }
            };
          })(this),
          'change:isFeedsRendered': (function(_this) {
            return function(m, v) {
              if (v) {
                console.debug('Receipt: isFeedsRendered');
                _this.renderFeeds();
                return _this.resetState('isFeedsRendered');
              }
            };
          })(this),
          'change:isArtworksUpdating': (function(_this) {
            return function(m, v) {
              if (v) {
                console.debug('Receipt: isArtworksUpdating');
                _this.resetState('isFeedListUnfolded');
                _this.updateArtworks({
                  reset: true
                });
                _this.artworkProgressVC.load({
                  infinite: true
                });
                _this.$el.addClass('has-artworks');
                return _this.resetState('isArtworksUpdating');
              }
            };
          })(this),
          'change:isArtworksUpdated': (function(_this) {
            return function(m, v) {
              if (v) {
                console.debug('Receipt: isArtworksUpdated');
                _this.artworkProgressVC.load();
                return _this.resetState('isArtworksUpdated');
              }
            };
          })(this),
          'change:isArtworksLoading': (function(_this) {
            return function(m, v) {
              if (v) {
                console.debug('Receipt: isArtworksLoading');
                _this.artworkProgressVC.load();
                return _this.resetState('isArtworksLoading');
              }
            };
          })(this),
          'change:isArtworksLoaded': (function(_this) {
            return function(m, v) {
              if (v) {
                console.debug('Receipt: isArtworksLoaded');
                _this.setState('isArtworksRendered');
                return _this.resetState('isArtworksLoaded');
              }
            };
          })(this),
          'change:isArtworksRendered': (function(_this) {
            return function(m, v) {
              if (v) {
                console.debug('Receipt: isArtworksRendered');
                _this.renderArtworks();
                _this.scrollVC.resize();
                return _this.resetState('isArtworksRendered');
              }
            };
          })(this)
        });
        this.initializeFeeds();
        this.initializeArtworks();
        return this.render();
      };

      ReceiptVC.prototype.update = function() {
        console.log("Receipt Rendered");
        this.renderScroll();
        return this.renderArtworkProgress();
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
          'update': (function(_this) {
            return function() {
              return _this.setState("isFeedsUpdated", true);
            };
          })(this),
          'change': (function(_this) {
            return function() {
              return _this.setState("isFeedsUpdated", true);
            };
          })(this)
        });
        return this.setState('isFeedsUpdating', true);
      };

      ReceiptVC.prototype.updateFeeds = function() {
        return this.feeds.fetch({
          callback: (function(_this) {
            return function(rawFeeds) {
              if (rawFeeds.length === 0) {
                return _this.feeds.add(alterFeeds);
              } else {
                return _this.feeds.add(rawFeeds);
              }
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

      ReceiptVC.prototype.initializeArtworks = function() {
        this.artworks = new Artworks;
        return this.artworks.on({
          'update': (function(_this) {
            return function() {
              return _this.setState('isArtworksUpdated', true);
            };
          })(this),
          'reset': (function(_this) {
            return function(m, v, opt) {
              return _this.setState('isArtworksUpdated', true);
            };
          })(this)
        });
      };

      ReceiptVC.prototype.updateArtworks = function(opt) {
        var feed, feedName;
        if (opt == null) {
          opt = {};
        }
        feed = opt.feed || this.feeds.findWhere({
          isCurrent: true
        });
        feedName = feed.get('name');
        return this.artworks.fetch({
          from: feedName,
          callback: (function(_this) {
            return function(rawArtworks) {
              if (opt.reset) {
                return _this.artworks.reset(rawArtworks);
              } else {
                return _this.artworks.add(rawArtworks);
              }
            };
          })(this)
        });
      };

      ReceiptVC.prototype.renderArtworks = function() {
        var timeout;
        if (!this.artworks) {
          console.log("No Artworks to Render");
          return;
        }
        this.$el.addClass('is-artworks-rendering');
        this.ui.$artworkList.empty();
        this.artworks.each((function(_this) {
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
        console.debug(this.artworks.length + " Receipt Artworks Rendered");
        timeout = (function(_this) {
          return function() {
            return _this.$el.removeClass('is-artworks-rendering');
          };
        })(this);
        setTimeout(timeout, 100);
        return this.model.set('isArtworksRendered', true);
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
        console.log('Artwork Progress Rendered');
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
        if (this.progress == null) {
          this.progress = new Progress({
            artworkType: 'thumb',
            indicatorType: opt.indicatorType
          });
        }
        this.progress.on({
          'change:isDone': (function(_this) {
            return function(m, v) {
              if (v) {
                _this.setState('isArtworksLoaded', true);
                return _this.progress.set('isDone', false);
              }
            };
          })(this)
        });
        this.progress.set('isDone', false);
        if (this.artworkProgressVC == null) {
          this.artworkProgressVC = new ArtworkProgressVC({
            $root: this.ui.$drawer,
            model: this.progress,
            artworks: this.artworks,
            template: template,
            position: 'prepend'
          });
        }
        this.artworkProgressVC.$el.addClass('top');
        return this.artworkProgressVC.load();
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
