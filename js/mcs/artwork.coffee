define [
  'lib/underscore'
  'found/utl'
  'found/m'
],(_,Utl,M)->
  class Artwork extends M
    defaults: {
      "id": undefined
      "idAttribute": "id"
      "url": ''
      "base64": ''
      "root": "../../img/artwork"
      "path": "0.png"
      "src": ''
      "isCurrent": false
      "isFavorite": false
    }
    initialize: ()->
      console.log "New Artwork"
      if (@get 'url') is ''
        @set "src","#{@get 'root'}/#{@get 'path'}"
      else
        @set "src",(@get 'url')
        console.log @get 'src'
        Utl.getDataUrl (@get 'src'),(dataUrl)=>
          console.debug "Data URL:"
          console.log dataUrl
          @set 'src',dataUrl
    getFav: ()->
      fav = @get 'isFavorite'
      return fav
    setFav: ()->
      @set 'isFavorite',true
    unsetFav: ()->
      @set 'isFavorite',false
    toggleFav: ()->
      if (@get 'isFavorite')
        @unsetFav()
      else
        @setFav()

  return Artwork