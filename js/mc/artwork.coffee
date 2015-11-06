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
      "willBeCurrent": false
      "isCurrent": false
      "isFavorite": false
      "willBeChosen": false
      "isChosen": false

    initialize: ()->
      console.log "New Artwork"
      @on
        'change:willBeCurrent': @onChangeWillBeCurrent
        'change:isCurrent': @onChangeIsCurrent

      if (@get 'url') is ''
        @set "src","#{@get 'root'}/#{@get 'path'}"
      else
        @set "src",(@get 'url')

    saveDataURL: ()->
      console.log @get 'src'
      Utl.fetchDataURL (@get 'src'),(dataURL)=>
        console.debug "Data URL:"
        console.log dataURL
        @set 'src',dataURL


  return Artwork