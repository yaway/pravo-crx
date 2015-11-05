define [
  'found/m'
  'found/utl'
],(M,Utl)->
  class Artwork extends M
    defaults:
      "id": undefined
      "idAttribute": "id"
      "url": ''
      "root": "../../img/artwork"
      "path": "0.png"
      "src": ''
      "thumb": ''
      "isCurrent": false
      "isFavorite": false

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
    toggleFavorite: ()->
      if @get 'isFavorite'
        @set 'isFavorite',false
      else
        @set 'isFavorite',true
      @set 'isCurrent',true

  return Artwork