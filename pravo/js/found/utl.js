(function() {
  define([], function() {
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
    Utl.cloneObj = function(obj) {
      var newObj;
      newObj = JSON.parse(JSON.stringify(obj));
      return newObj;
    };
    Utl.getRandomInt = function(max) {
      var randomInt;
      randomInt = Math.floor(Math.random() * max);
      return randomInt;
    };
    Utl.getNextInt = function(current, max) {
      var next;
      if (current < max - 1) {
        next = current + 1;
      } else {
        next = 0;
      }
      return next;
    };
    Utl.capStr = function(str) {
      var newStr;
      newStr = "" + (str.charAt(0).toUpperCase()) + (str.slice(1));
      return newStr;
    };
    Utl.capToCamel = function(str) {
      var newStr;
      newStr = "" + (str.charAt(0).toLowerCase()) + (str.slice(1));
      return newStr;
    };
    Utl.slugToCamel = function(str) {
      var newStr;
      newStr = str.replace(/-[a-z]/ig, function(match) {
        return match.substring(1).toUpperCase();
      });
      return newStr;
    };
    Utl.camelToSlug = function(str) {
      var newStr;
      newStr = str.replace(/[a-z][A-Z]/g, function(match) {
        var res;
        res = match[0] + "-" + (match[1].toLowerCase());
        return res;
      });
      newStr = newStr.toLowerCase();
      return newStr;
    };
    return Utl;
  });

}).call(this);
