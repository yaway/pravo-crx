(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['found/vc', 'mc/scroll', 'jquery-mousewheel'], function(VC, Scroll, JqMousewheel) {
    var ScrollVC;
    ScrollVC = (function(superClass) {
      extend(ScrollVC, superClass);

      function ScrollVC() {
        this.move = bind(this.move, this);
        this.onMousewheel = bind(this.onMousewheel, this);
        return ScrollVC.__super__.constructor.apply(this, arguments);
      }

      ScrollVC.prototype.events = {
        "mousewheel": "onMousewheel"
      };

      ScrollVC.prototype.onMousewheel = function(e) {
        var delta;
        delta = e.deltaY;
        return this.scroll(delta);
      };

      ScrollVC.prototype.initialize = function(opt) {
        ScrollVC.__super__.initialize.call(this, opt);
        if (this.model == null) {
          this.model = new Scroll;
        }
        if (opt.direction) {
          this.model.set('direction', opt.direction);
        }
        if (opt.$scrollee) {
          this.$scrollee = opt.$scrollee;
        } else if (this.ui.$scrollee) {
          this.$scrollee = this.ui.$scrollee;
        } else {
          console.error('No Scrollee');
        }
        return this.render();
      };

      ScrollVC.prototype.render = function() {
        ScrollVC.__super__.render.call(this);
        console.log('Scroll Rendered');
        return this.resize();
      };

      ScrollVC.prototype.reset = function() {
        this.setState('distance', 0);
        this.move();
        return this.resize();
      };

      ScrollVC.prototype.resize = function() {
        var direction, scrollSize, scrolleeSize;
        direction = this.model.get('direction');
        scrollSize = 0;
        scrolleeSize = 0;
        if (direction === 'h') {
          scrollSize = this.$el.height();
          scrolleeSize = this.$scrollee.height();
        } else {
          scrollSize = this.$el.width();
          scrolleeSize = this.$scrollee.width() + 56;
        }
        this.model.set('scrollSize', scrollSize);
        return this.model.set('scrolleeSize', scrolleeSize);
      };

      ScrollVC.prototype.move = function() {
        if ((this.model.get('direction')) === 'v') {
          return this.$scrollee.css({
            "transform": "translateX(" + (this.model.get('distance')) + "px)"
          });
        } else {
          return this.$scrollee.css({
            "transform": "translateY(" + (this.model.get('distance')) + "px)"
          });
        }
      };

      ScrollVC.prototype.scroll = function(delta) {
        var ease, easeTimer, scroll, timer;
        timer = this.model.get('timer');
        easeTimer = this.model.get('easeTimer');
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
            _this.model.trigger('willChangeDisance');
            _this.model.set('distance', distance + delta);
            return _this.move();
          };
        })(this);
        ease = (function(_this) {
          return function() {
            _this.$el.addClass('is-eased');
            _this.model.trigger('willChangeDisance');
            _this.model.set('distance', (_this.model.get('distance')) + delta * 4);
            return _this.move();
          };
        })(this);
        if (this.model.get('isScrollable')) {
          this.resize();
          timer = setTimeout(scroll, 10);
          easeTimer = setTimeout(ease, 100);
          this.model.set('timer', timer);
          return this.model.set('easeTimer', easeTimer);
        } else {
          return scroll();
        }
      };

      return ScrollVC;

    })(VC);
    return ScrollVC;
  });

}).call(this);
