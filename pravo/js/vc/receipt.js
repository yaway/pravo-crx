(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/artwork', 'mc/artworks', 'mc/feed', 'mc/feeds', 'mc/receipt', 'vc/artwork-thumbnail', 'vc/artwork-feed', 'vc/scroll'], function(VC, Artwork, Artworks, Feed, Feeds, Receipt, ArtworkThumbnailVC, ArtworkFeedVC, ScrollVC) {
    var ReceiptVC;
    ReceiptVC = (function(superClass) {
      extend(ReceiptVC, superClass);

      function ReceiptVC() {
        this.initializeFeeds = bind(this.initializeFeeds, this);
        this.onClickBtnToggleFeedList = bind(this.onClickBtnToggleFeedList, this);
        this.onClickBtnTogglePanel = bind(this.onClickBtnTogglePanel, this);
        this.onClickBtnTogglePanel = bind(this.onClickBtnTogglePanel, this);
        this.onClickBtnUnfoldPanel = bind(this.onClickBtnUnfoldPanel, this);
        this.onClickBtnFoldPanel = bind(this.onClickBtnFoldPanel, this);
        return ReceiptVC.__super__.constructor.apply(this, arguments);
      }

      ReceiptVC.prototype.events = {
        "click [data-ui='btnUnfoldPanel']": "onClickBtnUnfoldPanel",
        "click [data-ui='btnFoldPanel']": "onClickBtnFoldPanel",
        "click [data-ui='btnToggleFeedList']": "onClickBtnToggleFeedList"
      };

      ReceiptVC.prototype.onClickBtnFoldPanel = function(e) {
        console.log('BtnFoldPanel Clicked');
        e.stopPropagation();
        return this.model.set('isUnfolded', false);
      };

      ReceiptVC.prototype.onClickBtnUnfoldPanel = function(e) {
        console.log('BtnUnfoldPanel Clicked');
        e.stopPropagation();
        return this.model.set('isUnfolded', true);
      };

      ReceiptVC.prototype.onClickBtnTogglePanel = function(e) {
        console.log('BtnTogglePanel Clicked');
        e.stopPropagation();
        return this.model.toggle('isUnfolded');
      };

      ReceiptVC.prototype.onClickBtnTogglePanel = function(e) {
        console.log('BtnTogglePanel Clicked');
        e.stopPropagation();
        return this.model.toggle('isUnfolded');
      };

      ReceiptVC.prototype.onClickBtnToggleFeedList = function(e) {
        console.log('BtnToggleFeedList Clicked');
        e.stopPropagation();
        return this.model.toggle('isFeedListUnfolded');
      };

      ReceiptVC.prototype.initialize = function(opt) {
        ReceiptVC.__super__.initialize.call(this, opt);
        this.model = new Receipt;
        this.model.on({
          'change:hasArtworks': (function(_this) {
            return function() {
              if (_this.model.get('hasArtworks')) {
                return _this.$el.addClass('has-artworks');
              } else {
                return _this.$el.removeClass('has-artworks');
              }
            };
          })(this),
          'change:isUnfolded': (function(_this) {
            return function() {
              if (_this.model.get('isUnfolded')) {
                _this.$el.addClass('is-unfolded');
                return _this.model.set('isFeedListUnfolded', false);
              } else {
                return _this.$el.removeClass('is-unfolded');
              }
            };
          })(this),
          'change:isFeedListUnfolded': (function(_this) {
            return function() {
              if (_this.model.get('isFeedListUnfolded')) {
                return _this.$el.addClass('is-feed-list-unfolded');
              } else {
                return _this.$el.removeClass('is-feed-list-unfolded');
              }
            };
          })(this)
        });
        this.initializeFeeds();
        return this.render();
      };

      ReceiptVC.prototype.update = function() {
        console.log("Receipt Rendered");
        this.scrollVC = new ScrollVC({
          $root: this.ui.$scroll,
          direction: 'v',
          $target: this.ui.$artworkList
        });
        return this.renderFeeds();
      };

      ReceiptVC.prototype.initializeArtworks = function() {
        var chosenFeed;
        chosenFeed = this.feeds.findWhere({
          'isChosen': true
        }).get('name');
        console.log(chosenFeed);
        this.artworks = new Artworks;
        this.artworks.on({
          'didFetchFromServer': (function(_this) {
            return function() {};
          })(this),
          'update': (function(_this) {
            return function() {
              _this.renderArtworks();
              return _this.trigger('didUpdate');
            };
          })(this),
          'change:isChosen': (function(_this) {
            return function(artwork) {
              if (artwork.get('isChosen')) {
                return _this.trigger('didChooseArtwork', artwork);
              }
            };
          })(this)
        });
        return this.artworks.fetch({
          from: chosenFeed,
          callback: (function(_this) {
            return function(rawArtworks) {
              _this.artworks.add(rawArtworks);
              return console.debug(_this.artworks.pluck('id'));
            };
          })(this)
        });
      };

      ReceiptVC.prototype.renderArtworks = function() {
        this.ui.$artworkList.empty();
        if (!this.artworks) {
          console.log("No Artworks to Render");
          return;
        }
        console.log(this.artworks.length + " Receipt Artworks Rendered");
        this.model.set('hasArtworks', true);
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

      ReceiptVC.prototype.initializeFeeds = function() {
        var alterFeeds;
        alterFeeds = [
          {
            name: "unsplash",
            isChosen: true
          }, {
            name: "konachan"
          }
        ];
        this.feeds = new Feeds;
        this.feeds.fetch({
          callback: (function(_this) {
            return function(rawFeeds) {
              console.log(rawFeeds);
              if (rawFeeds.length === 0) {
                return _this.feeds.add(alterFeeds);
              } else {
                return _this.feeds.add(rawFeeds);
              }
            };
          })(this)
        });
        return this.feeds.on({
          'update': (function(_this) {
            return function() {
              _this.initializeArtworks();
              return _this.renderFeeds();
            };
          })(this),
          'change:isChosen': (function(_this) {
            return function(artwork) {
              if (artwork.get('isChosen')) {
                return _this.initializeArtworks();
              }
            };
          })(this),
          'didFetch': (function(_this) {
            return function() {
              return _this.renderFeeds();
            };
          })(this)
        });
      };

      ReceiptVC.prototype.renderFeeds = function() {
        this.ui.$feedList.empty();
        console.debug("New Feeds:");
        console.log(this.feeds.models);
        return this.feeds.each((function(_this) {
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
