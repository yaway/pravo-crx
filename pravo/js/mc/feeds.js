(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/c', 'mc/feed', 'found/utl'], function(C, Feed, Utl) {
    var Feeds;
    Feeds = (function(superClass) {
      extend(Feeds, superClass);

      function Feeds() {
        return Feeds.__super__.constructor.apply(this, arguments);
      }

      Feeds.prototype.model = Feed;

      Feeds.prototype.initialize = function() {
        console.log("New Feeds");
        return this.on({
          'willChangeIsCurrent': (function(_this) {
            return function() {
              return _this.allSet({
                isCurrent: false
              }, {
                silent: true
              });
            };
          })(this),
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
        var data;
        data = JSON.stringify(this.models);
        return chrome.storage.local.set({
          'feeds': data
        }, (function(_this) {
          return function() {
            return _this.trigger("didSave");
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
            var rawData;
            if (data.feeds) {
              rawData = JSON.parse(data.feeds);
            } else {
              rawData = [];
            }
            console.debug(rawData.length + " Local Feeds Fetched");
            callback(rawData);
            return _this.trigger("didFetch");
          };
        })(this));
      };

      return Feeds;

    })(C);
    return Feeds;
  });

}).call(this);
