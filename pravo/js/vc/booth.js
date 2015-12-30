(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/booth', 'vc/artwork-list', 'found/utl'], function(VC, Booth, ArtworkListVC, Utl) {
    var BoothVC;
    BoothVC = (function(superClass) {
      extend(BoothVC, superClass);

      function BoothVC() {
        this.onClickBtnToggleFav = bind(this.onClickBtnToggleFav, this);
        return BoothVC.__super__.constructor.apply(this, arguments);
      }

      BoothVC.prototype.events = {
        "click [data-ui='artwork']": 'onClickArtwork'
      };

      BoothVC.prototype.onClickBtnToggleFav = function(e) {
        e.stopPropagation();
        console.log('BtnFav Clicked');
        return console.log(currentArtwork);
      };

      BoothVC.prototype.initialize = function(opt) {
        BoothVC.__super__.initialize.call(this, opt);
        this.model = new Booth;
        return this.render();
      };

      BoothVC.prototype.render = function() {
        BoothVC.__super__.render.call(this);
        this.artworkListVC = new ArtworkListVC({
          $root: this.ui.$artworkList
        });
        return console.log("Booth Rendered");
      };

      return BoothVC;

    })(VC);
    return BoothVC;
  });

}).call(this);
