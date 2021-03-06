(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc'], function(VC) {
    var ImageLoader;
    ImageLoader = (function(superClass) {
      extend(ImageLoader, superClass);

      function ImageLoader() {
        return ImageLoader.__super__.constructor.apply(this, arguments);
      }

      ImageLoader.prototype.initialize = function(opt) {
        ImageLoader.__super__.initialize.call(this, opt);
        return this.render();
      };

      ImageLoader.prototype.update = function() {
        return console.log('Image Loader Rendered');
      };

      ImageLoader.prototype.initializeImages = function(opt) {
        if (opt == null) {
          opt = {};
        }
        if (!opt.srcs) {
          console.log("No Images to Load");
          return;
        }
        return this.srcs = opt.srcs;
      };

      ImageLoader.prototype.load = function() {};

      return ImageLoader;

    })(VC);
    return ImageLoader;
  });

}).call(this);
