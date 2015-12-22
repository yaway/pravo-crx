(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/m'], function(M) {
    var Receipt;
    Receipt = (function(superClass) {
      extend(Receipt, superClass);

      function Receipt() {
        return Receipt.__super__.constructor.apply(this, arguments);
      }

      Receipt.prototype.defaults = {
        "isFeedsUpdating": false,
        "isFeedsUpdated": false,
        "isFeedsRendered": false,
        "isArtworksUpdating": false,
        "isArtworksUpdated": false,
        "isArtworksLoading": false,
        "isArtworksLoaded": false,
        "isArtworksRendered": false,
        "isDrawerUnfolded": false,
        "isFeedListUnfolded": false
      };

      Receipt.prototype.initialize = function() {
        return console.log("New Receipt");
      };

      return Receipt;

    })(M);
    return Receipt;
  });

}).call(this);
