(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['underscore', 'core/vc', 'mc/artworks', 'vc/booth', 'vc/receipt', 'core/utl'], function(_, VC, Artworks, BoothVC, ReceiptVC, Utl) {
    var GalleryVC;
    GalleryVC = (function(superClass) {
      extend(GalleryVC, superClass);

      function GalleryVC() {
        return GalleryVC.__super__.constructor.apply(this, arguments);
      }

      GalleryVC.prototype.initialize = function(opt) {
        GalleryVC.__super__.initialize.call(this, opt);
        return this.render();
      };

      GalleryVC.prototype.getComponents = function() {
        var components;
        components = {
          booth: {
            "class": BoothVC,
            options: {
              rootUI: 'booth'
            }
          },
          receipt: {
            "class": ReceiptVC,
            options: {
              rootUI: 'receipt'
            }
          }
        };
        return components;
      };

      GalleryVC.prototype.getActions = function() {};

      GalleryVC.prototype.render = function() {
        GalleryVC.__super__.render.call(this);
        console.log("Gallery Rendered");
        this.listenTo(this.receiptVC.c, 'didChange:isChosen', (function(_this) {
          return function(m, v) {
            if (v) {
              _this.boothVC.artworkListVC.add(m);
              return _this.boothVC.artworkListVC.setCurrent(m);
            }
          };
        })(this));
        this.listenTo(this.receiptVC, 'didChangeState:hasArtworks', (function(_this) {
          return function(vc, v) {
            var artworks, predicate, rawArtworks;
            if (_this.boothVC.getState('hasArtworks')) {
              return;
            }
            predicate = function(m, i) {
              return true;
            };
            rawArtworks = _this.receiptVC.c.filter(predicate);
            artworks = new Artworks(rawArtworks);
            _this.boothVC.artworkListVC.add(artworks);
            if (artworks.length > 0) {
              _this.boothVC.setState('hasArtworks');
              return _this.boothVC.artworkListVC.random();
            }
          };
        })(this));
        return this.listenTo(this.receiptVC, 'didChangeState:isDrawerUnfolded', (function(_this) {
          return function(vc, v) {
            if (v) {
              return _this.boothVC.setState('blur');
            } else {
              return _this.boothVC.setState('blur', false);
            }
          };
        })(this));
      };

      GalleryVC.prototype.receipt = function(artworks) {
        return this.boothVC.c.add(arr[0]);
      };

      return GalleryVC;

    })(VC);
    return GalleryVC;
  });

}).call(this);
