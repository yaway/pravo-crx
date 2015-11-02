require.config
  paths:
    'jquery': 'lib/jquery'
  shim:
    'lib/underscore': 
      exports: '_'
    'lib/backbone':
      deps: ['lib/underscore','jquery']
      exports: 'Backbone'

require [
  'jquery'
  'lib/underscore'
  'vcs/dashboard'
], ($,_,Dashboard)->
  $ ()->
    dashboard = new Dashboard {root: 'dashboard',template: 'dashboard'}

    window.Pravo = {}
    Pravo.cleanLocalArtworks = ()->
      dashboard.gallery.artworks.save {only: 'nil'}
  # $ ()->
  #   console.log 'pravo!'
    
  #   App.artworkUrl = ''

  #   API = App.API

  #   API.signIn {
  #       email: 'yaway.v@gamil.com'
  #       password: '848301'
  #     },(err,data)->
  #       console.log data

  # API.getArtworks {
  #     email: 'yaway.v@gamil.com'
  #     password: '848301'
  #   },(err,data)=>
  #     data = data.data
  #     console.log data

  #     artworkUrl = data[0].src

  #     console.log artworkUrl

  #     artworkUrlResolved = App.Util.resolveUrl API.root,artworkUrl

  #     $artwork = $("<img src='#{artworkUrlResolved}' alt=''>")
  #     $('body').append $artwork