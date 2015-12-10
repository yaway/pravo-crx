(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'vc/booth', 'vc/receipt'], function(VC, BoothVC, ReceiptVC) {
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

      GalleryVC.prototype.update = function() {
        console.log("Gallery Rendered");
        this.boothVC = new BoothVC({
          $root: this.ui.$booth
        });
        this.receiptVC = new ReceiptVC({
          $root: this.ui.$receipt
        });
        this.boothVC.on({
          "didClickArtwork": (function(_this) {
            return function() {
              return console.log('Booth Artwork Clicked');
            };
          })(this),
          "didChangeCurrentArtwork": (function(_this) {
            return function() {
              return _this.trigger('didChangeCurrentArtwork');
            };
          })(this),
          "didRenderArtworks": (function(_this) {
            return function() {
              return _this.trigger('didRenderArtworks');
            };
          })(this)
        });
        this.receiptVC.on({
          "didChooseArtwork": (function(_this) {
            return function(artwork) {
              return _this.boothVC.artworks.add(artwork);
            };
          })(this),
          "didUpdate": (function(_this) {
            return function() {
              return _this.receiptVC.artworks.remove(_this.boothVC.artworks.pluck('id'));
            };
          })(this)
        });
        return this.trigger('didUpdateGallery');
      };

      return GalleryVC;

    })(VC);
    return GalleryVC;
  });

}).call(this);
