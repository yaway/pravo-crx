(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc'], function(VC) {
    var MCircularProgressVC;
    MCircularProgressVC = (function(superClass) {
      extend(MCircularProgressVC, superClass);

      function MCircularProgressVC() {
        return MCircularProgressVC.__super__.constructor.apply(this, arguments);
      }

      MCircularProgressVC.prototype.initialize = function(opt) {
        MCircularProgressVC.__super__.initialize.call(this, opt);
        return this.render();
      };

      MCircularProgressVC.prototype.update = function() {
        return console.log('Circular Progress Rendered');
      };

      return MCircularProgressVC;

    })(VC);
    return MCircularProgressVC;
  });

}).call(this);
