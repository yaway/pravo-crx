(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/scroll', 'jquery-mousewheel'], function(VC, Scroll, JqMousewheel) {
    var ScrollVC;
    ScrollVC = (function(superClass) {
      extend(ScrollVC, superClass);

      function ScrollVC() {
        this.onClick = bind(this.onClick, this);
        this.onMousewheel = bind(this.onMousewheel, this);
        return ScrollVC.__super__.constructor.apply(this, arguments);
      }

      ScrollVC.prototype.events = {
        "mousewheel": "onMousewheel",
        "click": "onClick"
      };

      ScrollVC.prototype.onMousewheel = function(e) {
        var delta, ease, easeTimer, scroll, timer;
        console.error('Mousewheeled');
        timer = this.model.get('timer');
        easeTimer = this.model.get('easeTimer');
        delta = e.deltaY;
        if (timer) {
          clearTimeout(timer);
          if (easeTimer) {
            clearTimeout(easeTimer);
          }
        }
        scroll = (function(_this) {
          return function() {
            var distance;
            distance = _this.model.get('distance');
            _this.model.set('distance', distance + delta);
            return _this.scroll();
          };
        })(this);
        ease = (function(_this) {
          return function() {
            _this.$el.addClass('is-eased');
            _this.model.set('distance', (_this.model.get('distance')) + delta * 1.8);
            return _this.scroll();
          };
        })(this);
        timer = setTimeout(scroll, 10);
        easeTimer = setTimeout(ease, 100);
        this.model.set('timer', timer);
        return this.model.set('easeTimer', easeTimer);
      };

      ScrollVC.prototype.onClick = function(e) {
        return console.error("Scroll Clicked");
      };

      ScrollVC.prototype.initialize = function(opt) {
        ScrollVC.__super__.initialize.call(this, opt);
        this.model = new Scroll;
        if (opt.direction) {
          this.model.set('direction', opt.direction);
        }
        if (opt.$target) {
          this.$target = opt.$target;
        } else {
          this.$target = this.$el.children(':first');
        }
        return this.render();
      };

      ScrollVC.prototype.update = function() {
        return console.log("Scroll Rendered");
      };

      ScrollVC.prototype.scroll = function() {
        console.error('Scrolled');
        if ((this.model.get('direction')) === 'v') {
          return this.$target.css({
            "transform": "translateX(" + (this.model.get('distance')) + "px)"
          });
        } else {
          return this.$target.css({
            "transform": "translateY(" + (this.model.get('distance')) + "px)"
          });
        }
      };

      return ScrollVC;

    })(VC);
    return ScrollVC;
  });

}).call(this);
