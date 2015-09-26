define [
  'lib/underscore'
  'found/m'
],(_,M)->
  class Artwork extends M
    defaults: {
      "root": "../../img/artwork"
      "path": "0.png"
      "isCurrent": false
    }
    initialize: ()->
      console.log "New Artwork"
      @set "src","#{@get 'root'}/#{@get 'path'}"
      console.log this
  return Artwork