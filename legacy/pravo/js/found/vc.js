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
        this.pos = opt.position;
        this.root = opt.root || document.body;
        this.$root = opt.$root || $(this.root);
        this.initVCofM(opt);
        return this.initTemplate(opt);
      };

      VC.prototype.getTemplate = function(tpl) {
        var tplStr;
        tplStr = _.unescape($("[data-tpl='" + tpl + "']").html());
        return tplStr;
      };

      VC.prototype.getUI = function(ui) {
        return this.$el.find("[data-ui='" + ui + "']");
      };

      VC.prototype.initVCofM = function(opt) {
        var base, vcName;
        if ((base = this.m).vc == null) {
          base.vc = {};
        }
        vcName = this.constructor.name;
        vcName = Utl.capToCamel(vcName);
        return this.m.vc[vcName] = this;
      };

      VC.prototype.initTemplate = function(opt) {
        if (opt.template) {
          return this.template = this.getTemplate(opt.template);
        } else {
          return this.template = '';
        }
      };

      VC.prototype.initUI = function() {
        var vc;
        vc = this;
        return this.$el.find('[data-ui]').each(function() {
          vc.ui[this.getAttribute('data-ui')] = this;
          return vc.ui["$" + (this.getAttribute('data-ui'))] = $(this);
        });
      };

      VC.prototype.initEl = function(data) {
        var $el, elStr, ref, tpl;
        if (data == null) {
          data = (ref = this.m) != null ? ref.attributes : void 0;
        }
        tpl = _.template(this.template);
        elStr = tpl(data);
        $el = $(elStr);
        if (this.pos === 'append') {
          this.$root.append($el);
        } else if (this.pos === 'prepend') {
          this.$root.prepend($el);
        } else if (this.pos === 'before') {
          this.$root.before($el);
        } else if (this.pos === 'after') {
          this.$root.after($el);
        } else {
          if (this.template === '') {
            $el = this.$root;
          } else {
            this.$root.replaceWith($el);
          }
        }
        return this.setElement($el[0]);
      };

      VC.prototype.render = function(data) {
        this.initEl(data);
        this.initUI();
        return this;
      };

      VC.prototype.getState = function(k) {
        var state;
        state = this.m.get(k);
        return state;
      };

      VC.prototype.setState = function(k, v, opt) {
        var kk, kv;
        if ((typeof k) === 'object') {
          if (v == null) {
            v = {};
          }
          opt = v;
          for (kk in k) {
            kv = k[kk];
            if (!opt.silent) {
              this.m.trigger("willChange:" + kk, this.m, kv);
              this.trigger("willChangeState:" + kk, this, kv);
            }
            this.m.set(kk, k[kk], opt);
            if (!opt.silent) {
              this.m.trigger("didChange:" + kk, this.m, kv);
              this.trigger("didChangeState:" + kk, this, kv);
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
            this.trigger("willChangeState:" + k, this, v);
          }
          this.m.set(k, v, opt);
          if (!opt.silent) {
            this.m.trigger("didChange:" + k, this.m, v);
            this.trigger("didChangeState:" + k, this, v);
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

      VC.prototype.dispatch = function(events) {
        var k, results, v;
        results = [];
        for (k in events) {
          v = events[k];
          results.push(console.error(k));
        }
        return results;
      };

      return VC;

    })(Backbone.View);
    return VC;
  });

}).call(this);
