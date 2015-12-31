(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['underscore', 'found/vc', 'vc/booth', 'vc/receipt', 'found/utl'], function(_, VC, BoothVC, ReceiptVC, Utl) {
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

      GalleryVC.prototype.render = function() {
        GalleryVC.__super__.render.call(this);
        console.log("Gallery Rendered");
        this.boothVC = new BoothVC({
          $root: this.ui.$booth
        });
        this.receiptVC = new ReceiptVC({
          $root: this.ui.$receipt
        });
        this.listenTo(this.receiptVC.c, 'didChange:isCurrent', (function(_this) {
          return function(m, v) {
            return _this.boothVC.c.add(m);
          };
        })(this));
        this.listenTo(this.receiptVC, 'didChangeState:hasArtworks', (function(_this) {
          return function(vc, v) {
            var artworks, predicate;
            if (_this.boothVC.getState('hasArtworks')) {
              return;
            }
            predicate = function(m, i) {
              return true;
            };
            artworks = _this.receiptVC.c.filter(predicate);
            return _this.boothVC.c.add(artworks);
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
