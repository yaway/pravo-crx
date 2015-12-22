define [
  'found/m'
],(M)->
  class Receipt extends M
    defaults:
      "isFeedsUpdating": false
      "isFeedsUpdated": false
      "isFeedsRendered": false
      "isArtworksUpdating": false
      "isArtworksUpdated": false
      "isArtworksLoading": false
      "isArtworksLoaded": false
      "isArtworksRendered": false
      "isDrawerUnfolded": false
      "isFeedListUnfolded": false

    initialize: ()->
      console.log "New Receipt"
    
  return Receipt