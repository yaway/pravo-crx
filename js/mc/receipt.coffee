define [
  'found/m'
],(M)->
  class Receipt extends M
    defaults:
      "hasArtworks": false
      "isUnfolded": false

    initialize: ()->
      console.log "New Receipt"
    
  return Receipt