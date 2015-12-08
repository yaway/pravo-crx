define [
  'found/m'
],(M)->
  class Booth extends M
    defaults:
      "hasArtworks": false
      "ableToLoop": true

    initialize: ()->
      console.log "New Booth"
      
  return Booth