(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/m', 'found/utl'], function(M, Utl) {
    var Feed;
    Feed = (function(superClass) {
      extend(Feed, superClass);

      function Feed() {
        return Feed.__super__.constructor.apply(this, arguments);
      }

      Feed.prototype.defaults = {
        name: "",
        isCurrent: false
      };

      Feed.prototype.initialize = function() {
        return console.log("New Feed");
      };

      return Feed;

    })(M);
    return Feed;
  });

}).call(this);
