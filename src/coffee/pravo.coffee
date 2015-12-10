bcRoot = "../../bower_components/"


require.config
  baseUrl: "../../pravo/js"
  paths:
    'jquery': "#{bcRoot}jquery/dist/jquery"
    'underscore': "#{bcRoot}underscore/underscore-1.8.3/underscore"
    'backbone': "#{bcRoot}backbone/backbone"
    'moment': "#{bcRoot}moment/moment"
    'background-check': "#{bcRoot}background-check/background-check"
    'jquery-mousewheel': "#{bcRoot}jquery-mousewheel/jquery.mousewheel"

require [
  'jquery'
  'underscore'
  'vc/dashboard'
], ($,_,DashboardVC)->
  $ ()->
    console.debug 'Pravo!'
    dashboard = new DashboardVC
      template: 'dashboard'
      position: 'append'

    window.Pravo = {}
    Pravo.cleanLocalArtworks = ()->
      dashboard.gallery.artworks.save {only: 'nil'}