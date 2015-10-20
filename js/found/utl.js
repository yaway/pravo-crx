// Generated by CoffeeScript 1.9.3
define([], function() {
  var Util;
  Util = {};
  Util.resolveUrl = function() {
    var a, arg, base, head, i, len, numUrls, resolved;
    console.log(arguments);
    numUrls = arguments.length;
    if (numUrls === 0) {
      return false;
    }
    base = document.createElement('base');
    base.href = arguments[0];
    if (numUrls === 1) {
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
  Util.getDataUrl = function(src, callback) {
    var img;
    img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      var canvas, ctx, dataUrl;
      canvas = document.createElement('canvas');
      ctx = canvas.getContext('2d');
      canvas.width = this.naturalWidth;
      canvas.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0);
      dataUrl = canvas.toDataURL('image/png');
      callback(dataUrl);
      return canvas = null;
    };
    return img.src = src;
  };
  return Util;
});