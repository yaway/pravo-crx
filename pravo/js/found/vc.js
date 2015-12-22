(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['backbone', 'found/m', 'found/utl'], function(Backbone, M, Utl) {
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
        this.model = opt.model || new M;
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
          data = (ref = this.model) != null ? ref.attributes : void 0;
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
        this.update();
        return this;
      };

      VC.prototype.getState = function(k) {
        var state;
        state = this.model.get(k);
        return state;
      };

      VC.prototype.setState = function(k, v, opt) {
        if ((typeof k) === 'object') {
          this.model.set(k, v, opt);
        } else {
          if (v && (typeof v) !== 'boolean') {
            this.model.set(k, v, opt);
          } else {
            this.model.set(k, true, opt);
          }
        }
        return this;
      };

      VC.prototype.resetState = function(k, opt) {
        var defaults, v;
        defaults = this.model.defaults || {};
        v = defaults[k];
        if (v) {
          this.model.set(k, v, opt);
        } else {
          this.model.set(k, null, opt);
        }
        return this;
      };

      VC.prototype.toggleState = function(k, opt) {
        if (this.model.get(k)) {
          this.model.set(k, false, opt);
        } else {
          this.model.set(k, true, opt);
        }
        return this;
      };

      VC.prototype.checkState = function(k, v) {
        if (v == null) {
          v = true;
        }
        console.error(v);
        console.error(this.model.get(k));
        if ((this.model.get(k)) === v) {
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
