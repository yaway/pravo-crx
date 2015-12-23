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

  require(['jquery', 'underscore', 'vc/dashboard', 'found/utl'], function($, _, DashboardVC, UTL) {
    return $(function() {
      var dashboard;
      console.debug('Pravo!');
      UTL.rebindContextMenu();
      window.Pravo = {};
      Pravo.cleanArtworks = function() {
        var opt;
        opt = {
          only: 'nil'
        };
        return dashboard.galleryVC.boothVC.artworkListVC.c.save(opt);
      };
      Pravo.cleanFeeds = function() {
        var opt;
        opt = {
          only: 'nil'
        };
        return dashboard.galleryVC.receiptVC.feeds.save(opt);
      };
      return dashboard = new DashboardVC({
        $root: $('[data-ui="dashboard"]')
      });
    });
  });

}).call(this);
