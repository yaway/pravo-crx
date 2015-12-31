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

      Artworks.prototype.save = function(opt) {
        var data, props, rawArtworks;
        if (opt == null) {
          opt = {};
        }
        console.debug('Will Save Artworks');
        rawArtworks = Utl.cloneObj(this.models);
        if (opt.only === "fav") {
          props = {
            isFavorite: true
          };
          rawArtworks = _.where(rawArtworks, props);
        } else if (opt.only === "nil") {
          rawArtworks = [];
        }
        data = {
          artworks: rawArtworks
        };
        return chrome.storage.local.set(data, (function(_this) {
          return function() {
            return console.debug("Did Save Artworks");
          };
        })(this));
      };

      Artworks.prototype.fetch = function(opt) {
        var apiCallback, callback, parseRawArtwork, rawArtworks, resetProtocol;
        if (opt == null) {
          opt = {};
        }
        rawArtworks = [];
        callback = opt.callback || (function(data) {
          return data;
        });
        if (opt.from === "local") {
          console.debug("Will Fetch Local Artworks");
          return chrome.storage.local.get('artworks', (function(_this) {
            return function(data) {
              var raw;
              raw = data.artworks || [];
              console.debug(raw.length + " Local Artworks Fetched");
              return callback(raw);
            };
          })(this));
        } else {
          console.debug("Will Fetch Server Artworks");
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
                return callback(rawArtworks);
              }
            };
          })(this);
          return API.fetchArtworks({}, apiCallback, {
            from: opt.from
          });
        }
      };

      return Artworks;

    })(C);
    return Artworks;
  });

}).call(this);
