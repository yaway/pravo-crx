(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/vc', 'mc/artworks', 'mc/feeds', 'mc/receipt', 'mc/scroll', 'mc/artwork-progress', 'vc/feed-list', 'vc/artwork-thumbnail-list', 'vc/scroll', 'vc/artwork-progress'], function(VC, Artworks, Feeds, Receipt, Scroll, ArtworkProgress, FeedListVC, ArtworkThumbnailListVC, ScrollVC, ArtworkProgressVC) {
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

      ReceiptVC.prototype.initialize = function(opt) {
        this.m = new Receipt;
        this.c = new Artworks;
        ReceiptVC.__super__.initialize.call(this, opt);
        return this.render();
      };

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
        return this.cpn.feedList.setState('isUnfolded');
      };

      ReceiptVC.prototype.getComponents = function() {
        var components;
        components = {
          feedList: {
            "class": FeedListVC,
            options: {
              rootUI: 'feedList'
            }
          },
          artworkList: {
            "class": ArtworkThumbnailListVC,
            options: {
              rootUI: 'artworkList',
              collection: this.c
            }
          },
          scroll: {
            "class": ScrollVC,
            options: {
              rootUI: 'scroll',
              scrolleeUI: 'artworkList',
              defaults: {
                direction: 'v'
              }
            }
          },
          refreshProgress: {
            "class": ArtworkProgressVC,
            options: {
              rootUI: 'drawer',
              collection: this.c,
              position: 'prepend',
              defaults: {
                artworkType: 'thumb',
                indicatorType: 'linear'
              }
            }
          },
          fetchProgress: {
            "class": ArtworkProgressVC,
            options: {
              rootUI: 'scroll',
              collection: this.c,
              position: 'append',
              defaults: {
                artworkType: 'thumb',
                indicatorType: 'circular',
                infinite: true
              }
            }
          }
        };
        return components;
      };

      ReceiptVC.prototype.getActions = function() {
        var actions;
        actions = {
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
                _this.cpn.scroll.refresh();
                return _this.$el.addClass('is-drawer-unfolded');
              } else {
                return _this.$el.removeClass('is-drawer-unfolded');
              }
            };
          })(this),
          'feedList didChangeState:current': (function(_this) {
            return function(vc, v) {
              _this.ui.$feedName.text(v);
              _this.cpn.artworkList.setState('from', v);
              return _this.cpn.artworkList.fetch();
            };
          })(this),
          'artworkList didChangeState:willFetch': (function(_this) {
            return function(vc, v) {
              if (v) {
                _this.cpn.refreshProgress.setState('infinite');
                return _this.cpn.refreshProgress.load();
              }
            };
          })(this),
          'artworkList didChangeState:didFetch': (function(_this) {
            return function(vc, v) {
              if (v) {
                _this.setState('hasArtworks');
                _this.cpn.refreshProgress.setState('infinite', false);
                return _this.cpn.refreshProgress.load();
              }
            };
          })(this),
          'artworkList didChangeState:willRender': (function(_this) {
            return function(vc, v) {
              if (v) {
                return _this.$el.addClass('is-artwork-list-rendering');
              }
            };
          })(this),
          'artworkList didChangeState:didRender': (function(_this) {
            return function(vc, v) {
              var timeout;
              if (v) {
                timeout = function() {
                  return _this.$el.removeClass('is-artwork-list-rendering');
                };
                return setTimeout(timeout, 4);
              }
            };
          })(this),
          'refreshProgress didChangeState:isDone': (function(_this) {
            return function(vc, v) {
              if (v) {
                return _this.cpn.artworkList.render();
              }
            };
          })(this),
          'scroll didChangeState:didScrollToEnd': (function(_this) {
            return function(vc, v) {
              if (v) {
                return _this.cpn.fetchProgress.load();
              }
            };
          })(this)
        };
        return actions;
      };

      ReceiptVC.prototype.render = function() {
        ReceiptVC.__super__.render.call(this);
        this.cpn.refreshProgress.$el.addClass('top');
        return this.cpn.refreshProgress.load();
      };

      return ReceiptVC;

    })(VC);
    return ReceiptVC;
  });

}).call(this);
