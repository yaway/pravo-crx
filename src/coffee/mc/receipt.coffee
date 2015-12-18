define [
  'found/m'
],(M)->
  class Receipt extends M
    defaults:
      "isUnfolded": false
      "isFeedListUnfolded": false
      "isArtworksUpdated": false
      "isArtworksLoaded": false
      "isArtworksRendered": false
      "isFeedsUpdated": false
      "hasArtworks": false

    initialize: ()->
      console.log "New Receipt"
    
  return Receipt