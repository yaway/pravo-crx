(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'found/m', 'found/c', 'found/utl'], function(Backbone, M, C, Utl) {
    var VC;
    VC = (function(superClass) {
      extend(VC, superClass);

      function VC() {
        return VC.__super__.constructor.apply(this, arguments);
      }

      VC.prototype.initialize = function(opt) {
        if (opt == null) {
          opt = {};
        }
        this.m = opt.model || new M;
        this.c = opt.collection;
        if (this.ui == null) {
          this.ui = {};
        }
        this.position = opt.position;
        this.root = opt.root || document.body;
        this.$root = opt.$root || $(this.root);
        if (opt.template) {
          return this.template = Utl.getTpl(opt.template);
        } else {
          return this.template = '';
        }
      };

      VC.prototype.update = function() {};

      VC.prototype.getUI = function(ui) {
        return this.$el.find("[data-ui='" + ui + "']");
      };

      VC.prototype.render = function(data) {
        var $el, elStr, ref, tpl, vc;
        if (data == null) {
          data = (ref = this.m) != null ? ref.attributes : void 0;
        }
        tpl = _.template(this.template);
        elStr = tpl(data);
        $el = $(elStr);
        if (this.position === 'append') {
          this.$root.append($el);
        } else if (this.position === 'prepend') {
          this.$root.prepend($el);
        } else if (this.position === 'before') {
          this.$root.before($el);
        } else if (this.position === 'after') {
          this.$root.after($el);
        } else {
          if (this.template === '') {
            $el = this.$root;
          } else {
            this.$root.replaceWith($el);
          }
        }
        vc = this;
        $el.find('[data-ui]').each(function() {
          vc.ui[this.getAttribute('data-ui')] = this;
          return vc.ui["$" + (this.getAttribute('data-ui'))] = $(this);
        });
        this.setElement($el[0]);
        return this;
      };

      VC.prototype.getState = function(k) {
        var state;
        state = this.m.get(k);
        return state;
      };

      VC.prototype.setState = function(k, v, opt) {
        var i, kk, len;
        if ((typeof k) === 'object') {
          if (v == null) {
            v = {};
          }
          for (i = 0, len = k.length; i < len; i++) {
            kk = k[i];
            if (!opt.silent) {
              this.m.trigger("willChange:" + kk, this.m, k[kk]);
              this.trigger("willChangeState:" + kk, this.m, k[kk]);
            }
            this.m.set(kk, k[kk], opt);
            if (!opt.silent) {
              this.m.trigger("didChange:" + kk, this.m, k[kk]);
              this.trigger("didChangeState:" + kk, this.m, k[kk]);
            }
          }
        } else {
          if (v == null) {
            v = true;
          }
          if (opt == null) {
            opt = {};
          }
          if (!opt.silent) {
            this.m.trigger("willChange:" + k, this.m, v);
            this.trigger("willChangeState:" + k, this.m, v);
          }
          this.m.set(k, v, opt);
          if (!opt.silent) {
            this.m.trigger("didChange:" + k, this.m, v);
            this.trigger("didChangeState:" + k, this.m, v);
          }
        }
        return this;
      };

      VC.prototype.resetState = function(k, opt) {
        var defaults, v;
        defaults = this.m.defaults || {};
        v = defaults[k];
        if (v) {
          this.m.set(k, v, opt);
        } else {
          this.m.set(k, null, opt);
        }
        return this;
      };

      VC.prototype.toggleState = function(k, opt) {
        if (this.getState(k)) {
          this.setState(k, false, opt);
        } else {
          this.setState(k, true, opt);
        }
        return this;
      };

      VC.prototype.checkState = function(k, v) {
        if (v == null) {
          v = true;
        }
        console.error(v);
        console.error(this.m.get(k));
        if ((this.m.get(k)) === v) {
          return true;
        } else {
          return false;
        }
      };

      return VC;

    })(Backbone.View);
    return VC;
  });

}).call(this);
