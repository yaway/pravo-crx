(function() {
  var slice = [].slice,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define([], function() {
    var ErrorFactory, Errors, createError;
    createError = function() {
      var BaseError, CustomError, args, meta, name;
      name = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      args = args.filter(function(item) {
        return item;
      });
      if (args.length === 0) {
        BaseError = Error;
        meta = {};
      } else if (args.length === 1) {
        if (args[0] instanceof Error) {
          BaseError = args[0];
          meta = {};
        } else {
          BaseError = Error;
          meta = args[0];
        }
      } else if (args.length === 2) {
        if (args[0] instanceof Error) {
          BaseError = args[0];
          meta = args[1];
        } else {
          BaseError = args[1];
          meta = args[0];
        }
      } else {
        BaseError = Error;
      }
      CustomError = (function(superClass) {
        extend(CustomError, superClass);

        CustomError.name = name;

        function CustomError(message, props) {
          var prop;
          CustomError.__super__.constructor.call(this);
          this.name = name;
          this.message = message || meta.message || prop.message || name;
          for (prop in meta) {
            if (meta.hasOwnProperty(prop)) {
              this[prop] = meta[prop];
            }
          }
          for (prop in props) {
            if (props.hasOwnProperty(prop)) {
              this[prop] = props[prop];
            }
          }
        }

        CustomError.prototype.name = name;

        return CustomError;

      })(BaseError);
      return CustomError;
    };
    ErrorFactory = (function() {
      function ErrorFactory() {
        this.errors = {};
      }

      ErrorFactory.prototype.define = function(name, base, meta) {
        this.errors[name] = createError(name, base, meta);
        return this;
      };

      ErrorFactory.prototype.generate = function() {
        return this.errors;
      };

      ErrorFactory.create = function() {
        return new ErrorFactory();
      };

      return ErrorFactory;

    })();
    Errors = ErrorFactory.create().define("Timeout", {
      code: 100
    }).define("NetworkError", {
      code: 101
    }).define("NotFound", {
      code: 102
    }).define("PermissionDenied", {
      code: 103
    }).define("Abort", {
      code: 104
    }).define("UnkownError", {
      code: 105
    }).define("ServerError", {
      code: 106
    }).generate();
    Errors.createBackendError = function(message, code) {
      return new Errors.ServerError(message, {
        backendCode: code
      });
    };
    return Errors;
  });

}).call(this);
