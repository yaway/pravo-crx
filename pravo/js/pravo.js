(function() {
  var bcRoot;

  bcRoot = "../../bower_components/";

  require.config({
    baseUrl: "../../pravo/js",
    paths: {
      'jquery': bcRoot + "jquery/dist/jquery",
      'underscore': bcRoot + "underscore/underscore-1.8.3/underscore",
      'backbone': bcRoot + "backbone/backbone",
      'moment': bcRoot + "moment/moment",
      'background-check': bcRoot + "background-check/background-check",
      'jquery-mousewheel': bcRoot + "jquery-mousewheel/jquery.mousewheel"
    }
  });

  require(['jquery', 'underscore', 'vc/dashboard'], function($, _, DashboardVC) {
    return $(function() {
      var dashboard;
      console.debug('Pravo!');
      window.Pravo = {};
      Pravo.clearLocalStore = function() {
        var callback;
        callback = function() {
          return console.debug('Local Store Cleared');
        };
        return chrome.storage.local.clear(callback);
      };
      return dashboard = new DashboardVC({
        $root: $('[data-ui="dashboard"]')
      });
    });
  });

}).call(this);
