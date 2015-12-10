define [
  'found/m'
],(M)->
  class Scroll extends M
    defaults:
      "direction": "h"
      "distance": 0

    initialize: ()->
      console.log "New Scroll"
    
  return Scroll