(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['mc/list'], function(List) {
    var FeedList;
    FeedList = (function(superClass) {
      extend(FeedList, superClass);

      function FeedList() {
        return FeedList.__super__.constructor.apply(this, arguments);
      }

      FeedList.prototype.defaults = {
        isUnfolded: false
      };

      return FeedList;

    })(List);
    return FeedList;
  });

}).call(this);
