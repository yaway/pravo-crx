define [
  'found/m'
  'found/utl'
],(M,Utl)->
  class Artwork extends M
    defaults:
      "id": undefined
      "idAttribute": "id"
      "url": ''
      "src": ''
      "thumb": ''
      "isCurrent": false
      "isFavorite": false
      "isChosen": false

    initialize: ()->
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