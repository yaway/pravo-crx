define [
  'found/m'
  'found/utl'
],(M,Utl)->
  class Feed extends M
    defaults:
      name: ""
      isChosen: false

    initialize: ()->
      console.log "New Feed"

  return Feed