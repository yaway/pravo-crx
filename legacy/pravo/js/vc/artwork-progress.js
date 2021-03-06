(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/vc', 'mc/artwork-progress'], function(VC, ArtworkProgress) {
    var ArtworkProgressVC;
    ArtworkProgressVC = (function(superClass) {
      extend(ArtworkProgressVC, superClass);

      function ArtworkProgressVC() {
        return ArtworkProgressVC.__super__.constructor.apply(this, arguments);
      }

      ArtworkProgressVC.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        if (opt.model == null) {
          opt.model = new ArtworkProgress;
        }
        if ((opt.model.get('indicatorType')) === 'linear') {
          opt.template = 'mLinearProgress';
        } else if ((opt.model.get('indicatorType')) === 'circular') {
          opt.template = 'mCircularProgress';
        }
        ArtworkProgressVC.__super__.initialize.call(this, opt);
        this.on({
          'didChangeState:isLoading': (function(_this) {
            return function(m, v) {
              if (v) {
                return _this.$el.addClass('is-loading');
              } else {
                return _this.$el.removeClass('is-loading');
              }
            };
          })(this)
        });
        return this.render();
      };

      ArtworkProgressVC.prototype.render = function() {
        ArtworkProgressVC.__super__.render.call(this);
        return console.log("Artwork Progress Rendered:" + (this.getState('indicatorType')));
      };

      ArtworkProgressVC.prototype.load = function(c) {
        var iteratee, srcKey, timeout, total;
        this.setState('isLoading', true);
        this.setState('isDone', false);
        timeout = (function(_this) {
          return function() {
            console.log('Artworks Failed to Load:timeout');
            return _this.setState('isLoading', false);
          };
        })(this);
        setTimeout(timeout, 1000 * 10);
        if (this.getState('infinite')) {
          return;
        }
        if ((this.getState('artworkType')) === 'src') {
          srcKey = 'src';
        } else if ((this.getState('artworkType')) === 'thumb') {
          srcKey = 'thumb';
        } else {
          return;
        }
        total = this.c.length;
        this.setState('total', total);
        iteratee = (function(_this) {
          return function(v, i) {
            var artwork, img, onLoadImg;
            artwork = v;
            artwork.set('isLoaded', false);
            img = new Image;
            img.src = artwork.get(srcKey);
            onLoadImg = function() {
              var dones;
              artwork.set('isLoaded', true);
              dones = _this.c.where({
                isLoaded: true
              });
              _this.setState('done', dones.length);
              if (dones.length === total) {
                clearTimeout(timeout);
                console.log((_this.getState('done')) + " Artworks Loaded");
                _this.setState('isDone', true);
                return _this.setState('isLoading', false);
              }
            };
            return img.onload = onLoadImg;
          };
        })(this);
        return this.c.forEach(iteratee);
      };

      return ArtworkProgressVC;

    })(VC);
    return ArtworkProgressVC;
  });

}).call(this);
