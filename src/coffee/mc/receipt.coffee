define [
  'found/m'
],(M)->
  class Receipt extends M
    defaults:
      "isRendered": false
      "isArtworksInitialized": false
      "isArtworksUpdated": false
      "isArtworksLoaded": false
      "isArtworksRendered": false
      "isFeedsUpdated": false
      "isUnfolded": false
      "isFeedListUnfolded": false

    initialize: ()->
      console.log "New Receipt"
    
  return Receipt