define [
  'found/m'
],(M)->
  class Receipt extends M
    defaults:
      hasArtworks: false
      isDrawerUnfolded: false
    
  return Receipt