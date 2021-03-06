(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/m'], function(M) {
    var List;
    List = (function(superClass) {
      extend(List, superClass);

      function List() {
        return List.__super__.constructor.apply(this, arguments);
      }

      List.prototype.defaults = {
        from: 'local',
        current: null,
        reset: true,
        willFetch: false,
        didFetch: false,
        willRender: false,
        didRender: false
      };

      return List;

    })(M);
    return List;
  });

}).call(this);
