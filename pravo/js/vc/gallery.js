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

      GalleryVC.prototype.render = function() {
        GalleryVC.__super__.render.call(this);
        console.log("Gallery Rendered");
        this.boothVC = new BoothVC({
          $root: this.ui.$booth
        });
        this.receiptVC = new ReceiptVC({
          $root: this.ui.$receipt
        });
        return this.receiptVC.on({
          'didChangeState:isDrawerUnfolded': (function(_this) {
            return function(m, v) {
              if (v) {
                return _this.boothVC.setState('blur');
              } else {
                return _this.boothVC.setState('blur', false);
              }
            };
          })(this)
        });
      };

      return GalleryVC;

    })(VC);
    return GalleryVC;
  });

}).call(this);
