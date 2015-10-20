define [
  'lib/underscore'
  'found/m'
],(_,M)->
  class Gallery extends M
    defaults: {
    }
    initialize: ()->
      console.log "New Gallery"
  return Gallery