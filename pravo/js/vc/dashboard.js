(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'vc/gallery', 'vc/clock', 'background-check'], function(VC, GalleryVC, ClockVC, BC) {
    var DashboardVC;
    DashboardVC = (function(superClass) {
      extend(DashboardVC, superClass);

      function DashboardVC() {
        return DashboardVC.__super__.constructor.apply(this, arguments);
      }

      DashboardVC.prototype.initialize = function(opt) {
        DashboardVC.__super__.initialize.call(this, opt);
        return this.render();
      };

      DashboardVC.prototype.update = function() {
        console.log('Dashboard Rendered');
        this.galleryVC = new GalleryVC({
          $root: this.ui.$gallery,
          template: 'gallery'
        });
        this.clockVC = new ClockVC({
          $root: this.ui.$clock,
          template: 'clock'
        });
        return this.galleryVC.on({
          'didRenderArtworks': (function(_this) {
            return function() {
              return _this.initBC();
            };
          })(this),
          'didChangeCurrentArtwork': (function(_this) {
            return function() {
              return _this.updateBC();
            };
          })(this),
          'didUpdateGallery': (function(_this) {
            return function() {
              _this.initBC();
              return _this.updateBC();
            };
          })(this)
        });
      };

      DashboardVC.prototype.initBC = function() {
        return BC.init({
          targets: '[data-ui="time"],[data-ui="btnFav"],[data-ui="btnTogglePanel"]',
          images: '[data-ui="img"]',
          classes: {
            dark: 'is-dark',
            light: 'is-light',
            complex: 'is-complex'
          },
          threshold: 70,
          minComplexity: 20,
          windowEvents: false,
          maxDuration: 1000 * 30
        });
      };

      DashboardVC.prototype.updateBC = function() {
        return BC.refresh();
      };

      return DashboardVC;

    })(VC);
    return DashboardVC;
  });

}).call(this);
