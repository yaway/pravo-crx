define [
  'found/m'
],(M)->
  class Booth extends M
    defaults:
      "hasArtworks": false

    initialize: ()->
      console.log "New Booth"
      
  return Booth