(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['core/vc', 'mc/scroll', 'jquery-mousewheel'], function(VC, Scroll, JqMousewheel) {
    var ScrollVC;
    ScrollVC = (function(superClass) {
      extend(ScrollVC, superClass);

      function ScrollVC() {
        this.move = bind(this.move, this);
        this.onMove = bind(this.onMove, this);
        this.onMousewheel = bind(this.onMousewheel, this);
        return ScrollVC.__super__.constructor.apply(this, arguments);
      }

      ScrollVC.prototype.events = {
        "mousewheel": 'onMousewheel',
        "transitionend": 'onMove'
      };

      ScrollVC.prototype.onMousewheel = function(e) {
        var delta;
        delta = e.deltaY;
        return this.scroll(delta);
      };

      ScrollVC.prototype.onMove = function(e) {
        if (e.target === this.$scrollee[0]) {
          e.stopPropagation();
          if (this.getState('isScrollingToEnd')) {
            return this.setState('didScrollToEnd');
          } else {
            return this.setState('didScrollToEnd', false);
          }
        }
      };

      ScrollVC.prototype.initialize = function(opt) {
        this.M = Scroll;
        ScrollVC.__super__.initialize.call(this, opt);
        this.opt = opt;
        return this.render();
      };

      ScrollVC.prototype.render = function() {
        ScrollVC.__super__.render.call(this);
        console.log('Scroll Rendered');
        this.initScrollee();
        return this.resize();
      };

      ScrollVC.prototype.initScrollee = function() {
        if (this.opt == null) {
          this.opt = {};
        }
        if (this.opt.$scrollee) {
          return this.$scrollee = this.opt.$scrollee;
        } else if (this.opt.scrolleeUI) {
          return this.$scrollee = this.getUI(this.opt.scrolleeUI);
        } else if (this.ui.$scrollee) {
          return this.$scrollee = this.ui.$scrollee;
        } else {
          return console.debug('No Scrollee');
        }
      };

      ScrollVC.prototype.refresh = function() {
        this.setState('distance', 0);
        this.move();
        return this.resize();
      };

      ScrollVC.prototype.resize = function() {
        var direction, scrollSize, scrolleeSize;
        direction = this.getState('direction');
        scrollSize = 0;
        scrolleeSize = 0;
        if (direction === 'h') {
          scrollSize = this.$el.height();
          scrolleeSize = this.$scrollee.height();
        } else {
          scrollSize = this.$el.width();
          scrolleeSize = this.$scrollee.width();
        }
        this.setState('scrollSize', scrollSize);
        return this.setState('scrolleeSize', scrolleeSize);
      };

      ScrollVC.prototype.move = function() {
        this.validateDistance();
        if ((this.getState('direction')) === 'v') {
          return this.$scrollee.css({
            "transform": "translateX(" + (this.getState('distance')) + "px)"
          });
        } else {
          return this.$scrollee.css({
            "transform": "translateY(" + (this.getState('distance')) + "px)"
          });
        }
      };

      ScrollVC.prototype.scroll = function(delta) {
        var ease, easeTimer, move, timer;
        timer = this.getState('timer');
        easeTimer = this.getState('easeTimer');
        if (timer) {
          clearTimeout(timer);
          if (easeTimer) {
            clearTimeout(easeTimer);
          }
        }
        move = (function(_this) {
          return function() {
            var distance;
            distance = _this.getState('distance');
            _this.setState('distance', distance + delta);
            return _this.move();
          };
        })(this);
        ease = (function(_this) {
          return function() {
            _this.$el.addClass('is-eased');
            _this.setState('distance', (_this.getState('distance')) + delta * 4);
            return _this.move();
          };
        })(this);
        if (this.getState('isScrollable')) {
          this.resize();
          timer = setTimeout(move, 8);
          easeTimer = setTimeout(ease, 80);
          this.setState('timer', timer);
          return this.setState('easeTimer', easeTimer);
        } else {
          return move();
        }
      };

      ScrollVC.prototype.validateDistance = function() {
        var distance, isScrollingToEnd, isValid, limit, opt;
        distance = this.getState('distance');
        limit = (this.getState('scrolleeSize')) - (this.getState('scrollSize'));
        isValid = false;
        opt = {
          silent: true
        };
        if (distance > 0) {
          this.setState('distance', 0, opt);
        } else if (distance < -limit) {
          this.setState('distance', -limit, opt);
          isScrollingToEnd = true;
        } else {
          isValid = true;
        }
        this.setState('isScrollingToEnd', isScrollingToEnd || false);
        return this.setState("isScrollable", isValid);
      };

      return ScrollVC;

    })(VC);
    return ScrollVC;
  });

}).call(this);
