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
        return console.log("New Artworks");
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
            return console.debug("Artworks Did Save");
          };
        })(this));
      };

      Artworks.prototype.fetch = function(opt) {
        var apiCallback, callback, parseRawArtwork, rawArtworks, resetProtocol;
        rawArtworks = [];
        callback = opt.callback || (function(data) {
          return data;
        });
        if (opt.from === "local") {
          console.log("Will Fetch Local Artworks");
          return chrome.storage.local.get('artworks', (function(_this) {
            return function(data) {
              if (!data.artworks) {
                return console.log('No Local Artworks Fetched');
              } else {
                rawArtworks = JSON.parse(data.artworks || {});
                console.debug(rawArtworks.length + " Local Artworks Fetched");
                callback(rawArtworks);
                return _this.trigger("didFetchFromLocal");
              }
            };
          })(this));
        } else {
          console.log("Will Fetch Server Artworks");
          resetProtocol = function(artwork) {
            var thumb, url;
            url = artwork.url;
            thumb = artwork.thumb;
            artwork.url = url.replace(/http\:/, "https:");
            artwork.thumb = thumb.replace(/http\:/, "https:");
            return artwork;
          };
          if (opt.from === "konachan") {
            parseRawArtwork = function(refArtwork) {
              var artwork;
              artwork = {
                id: refArtwork.id,
                url: refArtwork.file_url,
                thumb: refArtwork.preview_url
              };
              artwork = resetProtocol(artwork);
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
          apiCallback = (function(_this) {
            return function(err, data) {
              var i, len, rawArtwork, refArtwork, refArtworks;
              refArtworks = [];
              rawArtworks = [];
              if ((data != null ? data.length : void 0) > 0) {
                refArtworks = data;
                for (i = 0, len = refArtworks.length; i < len; i++) {
                  refArtwork = refArtworks[i];
                  rawArtwork = parseRawArtwork(refArtwork);
                  rawArtworks.push(rawArtwork);
                }
                console.debug(rawArtworks.length + " Server Artworks Fetched");
                callback(rawArtworks);
                return _this.trigger("didFetchFromServer");
              }
            };
          })(this);
          return (function(_this) {
            return function(parseRawArtwork) {
              return API.fetchArtworks({}, apiCallback, {
                from: opt.from
              });
            };
          })(this)(parseRawArtwork);
        }
      };

      return Artworks;

    })(C);
    return Artworks;
  });

}).call(this);
