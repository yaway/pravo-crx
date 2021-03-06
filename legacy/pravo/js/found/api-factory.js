(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define(['found/error'], function(Errors) {
    var APIFactory;
    APIFactory = (function() {
      function APIFactory(opt) {
        this.create = bind(this.create, this);
        if (opt == null) {
          opt = {};
        }
        this.root = opt.root || '';
        this.timeout = opt.timeout || 1000 * 60;
      }

      APIFactory.prototype.request = function(opt) {
        return $.ajax(opt);
      };

      APIFactory.prototype.create = function(opt) {
        if (opt == null) {
          opt = {};
        }
        return (function(_this) {
          return function(data, callback) {
            var contentType, method, timeout, url;
            if (!data) {
              data = {};
            }
            method = opt.method || 'GET';
            url = '';
            if (opt.url) {
              url = opt.url;
            } else {
              url = "" + (opt.root || _this.root || '') + opt.path;
            }
            timeout = _this.timeout;
            if (method.toUpperCase() === 'GET') {
              contentType = 'application/x-www-form-urlencoded';
              data = data;
            } else {
              contentType = 'application/json';
              data = JSON.stringify(data);
            }
            return _this.request({
              type: method,
              data: data,
              url: url,
              success: function(data) {
                if (data && data.error) {
                  return callback(data, null);
                } else {
                  return callback(null, data);
                }
              },
              error: function(xhr, state) {
                return callback(state);
              }
            });
          };
        })(this);
      };

      return APIFactory;

    })();
    return APIFactory;
  });

}).call(this);
