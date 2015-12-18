(function() {
  define(['jquery', 'underscore'], function($, _) {
    var Utl;
    Utl = {};
    Utl.resolveURL = function() {
      var a, arg, base, head, i, len, numURLs, resolved;
      console.log(arguments);
      numURLs = arguments.length;
      if (numURLs === 0) {
        return false;
      }
      base = document.createElement('base');
      base.href = arguments[0];
      if (numURLs === 1) {
        return base.href;
      }
      head = (document.getElementsByTagName('head'))[0];
      head.insertBefore(base, head.firstChild);
      a = document.createElement('a');
      for (i = 0, len = arguments.length; i < len; i++) {
        arg = arguments[i];
        a.href = arg;
        resolved = a.href;
        base.href = resolved;
      }
      head.removeChild(base);
      return resolved;
    };
    Utl.fetchDataURL = function(src, callback) {
      var img;
      img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        var canvas, ctx, dataURL;
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = this.naturalWidth;
        canvas.height = this.naturalHeight;
        ctx.drawImage(this, 0, 0);
        dataURL = canvas.toDataURL('image/png');
        callback(dataURL);
        return canvas = null;
      };
      return img.src = src;
    };
    Utl.deepCopy = function(obj) {
      var newObj;
      newObj = JSON.parse(JSON.stringify(obj));
      return newObj;
    };
    Utl.getTpl = function(tpl) {
      var tplStr;
      tplStr = _.unescape($("[data-tpl='" + tpl + "']").html());
      return tplStr;
    };
    Utl.rebindContextMenu = function() {
      return $(document).on('contextmenu', function(e) {
        return e.preventDefault();
      });
    };
    return Utl;
  });

}).call(this);
