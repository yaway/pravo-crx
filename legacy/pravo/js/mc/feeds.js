(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/c', 'mc/feed', 'core/utl'], function(C, Feed, Utl) {
    var Feeds;
    Feeds = (function(superClass) {
      extend(Feeds, superClass);

      function Feeds() {
        return Feeds.__super__.constructor.apply(this, arguments);
      }

      Feeds.prototype.model = Feed;

      Feeds.prototype.initialize = function() {
        Feeds.__super__.initialize.call(this);
        return this.on({
          'change:isCurrent': (function(_this) {
            return function(m, v) {
              if (v) {
                return _this.save();
              }
            };
          })(this)
        });
      };

      Feeds.prototype.save = function(opt) {
        var data, raw, rawFeeds;
        if (opt == null) {
          opt = {};
        }
        raw = Utl.cloneObj(this.models);
        if (opt.only === 'nil') {
          rawFeeds = [];
        }
        data = {
          feeds: raw
        };
        return chrome.storage.local.set(data, (function(_this) {
          return function() {
            return console.debug("Did Save Feeds");
          };
        })(this));
      };

      Feeds.prototype.fetch = function(opt) {
        var callback;
        callback = opt.callback || (function(data) {
          return data;
        });
        return chrome.storage.local.get('feeds', (function(_this) {
          return function(data) {
            var raw;
            raw = data.feeds || [];
            console.debug(raw.length + " Local Feeds Fetched");
            return callback(raw);
          };
        })(this));
      };

      return Feeds;

    })(C);
    return Feeds;
  });

}).call(this);
