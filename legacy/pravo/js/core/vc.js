(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'core/m', 'core/c', 'core/utl'], function(Backbone, M, C, Utl) {
    var VC;
    VC = (function(superClass) {
      extend(VC, superClass);

      function VC() {
        return VC.__super__.constructor.apply(this, arguments);
      }

      VC.prototype.initialize = function(opt) {
        var defaults;
        if (opt == null) {
          opt = {};
        }
        defaults = opt.defaults || {};
        if (this.M == null) {
          this.M = M;
        }
        if (this.m == null) {
          this.m = opt.model || (new this.M(defaults));
        }
        if (this.c == null) {
          this.c = opt.collection;
        }
        if (this.ui == null) {
          this.ui = {};
        }
        if (this.pos == null) {
          this.pos = opt.position;
        }
        if (this.root == null) {
          this.root = opt.root || document.body;
        }
        if (this.$root == null) {
          this.$root = opt.$root || $(this.root);
        }
        this.root = this.$root[0];
        if (this.cpn == null) {
          this.cpn = {};
        }
        this.initM(opt);
        return this.initTpl(opt);
      };

      VC.prototype.render = function() {
        this.initEl();
        this.initUI();
        this.initCpn();
        return this.dispatch();
      };

      VC.prototype.getTpl = function(tpl) {
        var tplStr;
        tplStr = _.unescape($("[data-tpl='" + tpl + "']").html());
        return tplStr;
      };

      VC.prototype.getUI = function(ui) {
        return this.$el.find("[data-ui='" + ui + "']");
      };

      VC.prototype.initM = function(opt) {
        var base, vcName;
        if ((base = this.m).vc == null) {
          base.vc = {};
        }
        vcName = this.constructor.name;
        vcName = Utl.capToCamel(vcName);
        return this.m.vc[vcName] = this;
      };

      VC.prototype.initTpl = function(opt) {
        if (opt.template) {
          return this.tpl = this.getTpl(opt.template);
        } else {
          return this.tpl = '';
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

      VC.prototype.initEl = function() {
        var $el, data, elStr, tpl;
        data = this.m.attributes || {};
        tpl = _.template(this.tpl);
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
          if (this.tpl === '') {
            $el = this.$root;
          } else {
            this.$root.replaceWith($el);
          }
        }
        return this.setElement($el[0]);
      };

      VC.prototype.initCpn = function() {
        var components, k, opt, results, v;
        components = this.getComponents();
        if (_.isEmpty(components)) {
          return;
        }
        results = [];
        for (k in components) {
          v = components[k];
          opt = v.options || {};
          if (opt.rootUI) {
            opt.$root = this.getUI(opt.rootUI);
          }
          results.push(this.cpn[k] = new v["class"](opt));
        }
        return results;
      };

      VC.prototype.dispatch = function() {
        var actions, k, match, obj, results, splitter, v;
        actions = this.getActions();
        if (_.isEmpty(actions)) {
          return;
        }
        splitter = /^(\S+)\s*(.*)$/;
        results = [];
        for (k in actions) {
          v = actions[k];
          match = k.match(splitter);
          if (match[2] === '') {
            results.push(this.on((
              obj = {},
              obj["" + k] = v,
              obj
            )));
          } else {
            results.push(this.listenTo(this.cpn[match[1]], match[2], v));
          }
        }
        return results;
      };

      VC.prototype.getComponents = function() {
        return {};
      };

      VC.prototype.getActions = function() {
        return {};
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
