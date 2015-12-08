(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/c', 'mc/artwork', 'found/api', 'found/utl'], function(C, Artwork, API, Utl) {
    var Artworks;
    Artworks = (function(superClass) {
      extend(Artworks, superClass);

      function Artworks() {
        return Artworks.__super__.constructor.apply(this, arguments);
      }

      Artworks.prototype.model = Artwork;

      Artworks.prototype.initialize = function() {
        console.log("New Artworks");
        return this.on({
          'willChangeIsChosen': (function(_this) {
            return function() {};
          })(this),
          'willChangeIsCurrent': (function(_this) {
            return function() {
              return _this.allSet('isCurrent', false);
            };
          })(this)
        });
      };

      Artworks.prototype.save = function(opt) {
        var artworksJSON, rawArtworks;
        console.debug('Will Save Artworks');
        rawArtworks = Utl.deepCopy(this.models);
        _.map(rawArtworks, (function(_this) {
          return function(artwork) {
            artwork.isCurrent = false;
            return artwork;
          };
        })(this));
        if (opt.only === "fav") {
          rawArtworks = _.where(rawArtworks, {
            isFavorite: true
          });
        } else if (opt.only === "nil") {
          rawArtworks = [];
        }
        artworksJSON = JSON.stringify(rawArtworks);
        console.log(artworksJSON);
        return chrome.storage.local.set({
          'artworks': artworksJSON
        }, (function(_this) {
          return function() {
            _this.trigger("didSaveToLocal");
            console.debug("Artworks Did Save:");
            return console.log(rawArtworks);
          };
        })(this));
      };

      Artworks.prototype.fetch = function(opt) {
        var callback, parseRawArtwork, rawArtworks;
        console.debug('Will Fetch Artworks');
        rawArtworks = [];
        callback = opt.callback || (function(data) {
          return data;
        });
        if (opt.from === "local") {
          console.debug("Will Fetch Local Artworks");
          return chrome.storage.local.get('artworks', (function(_this) {
            return function(data) {
              if (!data.artworks) {
                return console.log('No Local Artworks to Fetch');
              } else {
                rawArtworks = JSON.parse(data.artworks || {});
                console.debug("Local Artworks Did Fetch:");
                console.log(rawArtworks);
                callback(rawArtworks);
                return _this.trigger("didFetchFromLocal");
              }
            };
          })(this));
        } else {
          console.debug("Will Fetch Server Artworks");
          if (opt.from === "konachan") {
            parseRawArtwork = function(refArtwork) {
              var artwork;
              artwork = {
                id: refArtwork.id,
                url: refArtwork.file_url,
                thumb: refArtwork.preview_url
              };
              return artwork;
            };
          } else if (opt.from === "unsplash") {
            parseRawArtwork = function(refArtwork) {
              var artwork;
              artwork = {
                id: refArtwork.id,
                url: refArtwork.urls.full,
                thumb: refArtwork.urls.thumb
              };
              return artwork;
            };
          }
          return (function(_this) {
            return function(parseRawArtwork) {
              return API.fetchArtworks({
                from: opt.from
              }, {}, function(err, data) {
                var i, len, rawArtwork, refArtwork, refArtworks;
                refArtworks = [];
                rawArtworks = [];
                console.debug("Server RefArtworks:");
                console.log(data);
                if ((data != null ? data.length : void 0) > 0) {
                  refArtworks = data;
                  console.log(refArtworks);
                  for (i = 0, len = refArtworks.length; i < len; i++) {
                    refArtwork = refArtworks[i];
                    rawArtwork = parseRawArtwork(refArtwork);
                    rawArtworks.push(rawArtwork);
                  }
                  console.debug("Server Artworks Did Fetch:");
                  console.log(rawArtworks);
                  callback(rawArtworks);
                  return _this.trigger("didFetchFromServer");
                }
              });
            };
          })(this)(parseRawArtwork);
        }
      };

      Artworks.prototype.loop = function() {
        var next;
        if (this.length < 2) {
          return;
        }
        next = this.getNext();
        next.trigger('willChangeIsCurrent');
        return next.set('isCurrent', true);
      };

      Artworks.prototype.getCurrent = function() {
        var current;
        current = this.findWhere({
          isCurrent: true
        });
        return current;
      };

      Artworks.prototype.getNext = function() {
        var current, currentIndex, next;
        current = this.getCurrent();
        currentIndex = this.indexOf(current);
        if (currentIndex < this.length - 1) {
          next = this.at(currentIndex + 1);
        } else {
          next = this.at(0);
        }
        return next;
      };

      return Artworks;

    })(C);
    return Artworks;
  });

}).call(this);
