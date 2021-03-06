(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/vc', 'mc/feed-list', 'mc/feed', 'mc/feeds', 'vc/artwork-feed', 'core/utl'], function(VC, FeedList, Feed, Feeds, ArtworkFeedVC, Utl) {
    var FeedListVC;
    FeedListVC = (function(superClass) {
      extend(FeedListVC, superClass);

      function FeedListVC() {
        return FeedListVC.__super__.constructor.apply(this, arguments);
      }

      FeedListVC.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        if (opt.model == null) {
          opt.model = new FeedList;
        }
        if (opt.collection == null) {
          opt.collection = new Feeds;
        }
        FeedListVC.__super__.initialize.call(this, opt);
        this.on({
          'didChangeState:current': (function(_this) {
            return function(vc, v) {
              if (v) {
                _this.render();
                return _this.setState('isUnfolded', false);
              }
            };
          })(this),
          'didChangeState:isUnfolded': (function(_this) {
            return function(vc, v) {
              if (v) {
                return _this.$el.addClass('is-unfolded');
              } else {
                return _this.$el.removeClass('is-unfolded');
              }
            };
          })(this)
        });
        this.listenTo(this.c, 'willChange:isCurrent', (function(_this) {
          return function(m, v) {
            if (v) {
              return _this.vc.map(function(v, i, l) {
                return v.setState('isCurrent', false);
              });
            }
          };
        })(this));
        this.listenTo(this.c, {
          'didChange:isCurrent': (function(_this) {
            return function(m, v) {
              var current;
              if (v) {
                current = m.get('name');
                _this.setState('current', current);
                return _this.render();
              }
            };
          })(this)
        });
        return this.fetch();
      };

      FeedListVC.prototype.fetch = function() {
        var defaults, from;
        this.setState('didFetch', false);
        defaults = [
          {
            name: "unsplash",
            isCurrent: true
          }, {
            name: "konachan"
          }
        ];
        from = this.getState('from');
        return this.c.fetch({
          from: from,
          callback: (function(_this) {
            return function(rawC) {
              var attrs, current, m;
              if (rawC.length > 0) {
                _this.c.add(rawC);
              } else {
                _this.c.add(defaults);
              }
              attrs = {
                isCurrent: true
              };
              m = _this.c.find(attrs);
              current = m.get('name');
              _this.setState('current', current);
              return _this.setState('didFetch');
            };
          })(this)
        });
      };

      FeedListVC.prototype.render = function() {
        FeedListVC.__super__.render.call(this);
        this.setState('didRender', false);
        if (this.c.length === 0) {
          console.log("No Feeds to Render");
          return;
        }
        this.vc = [];
        this.$el.empty();
        return this.c.map((function(_this) {
          return function(v, i, l) {
            var m, vc;
            m = v;
            vc = new ArtworkFeedVC({
              $root: _this.$el,
              position: 'append',
              template: 'artworkFeed',
              model: m
            });
            _this.vc.push(vc);
            return _this.setState('didRender');
          };
        })(this));
      };

      return FeedListVC;

    })(VC);
    return FeedListVC;
  });

}).call(this);
