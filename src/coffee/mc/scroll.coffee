define [
  'found/m'
],(M)->
  class Scroll extends M
    defaults:
      "direction": "h"
      "distance": 0
      "lastDistence": 0
      "scrollSize": 0
      "scrolleeSize": 0
      "isScrollable": false

    initialize: ()->
      console.log "New Scroll"
      super()
      @on
        "willChangeDisance": ()=>
          @set 'lastDistence',(@get 'distance')
        'change:distance': ()=>
          if (@get 'distance') is (@get 'lastDistence')
            return
          else
            @trigger 'didChangeDistance'
        'didChangeDistance': ()=>
          @validateDistance()
          
    validateDistance: ()->
      distance = @get 'distance'
      limit = (@get 'scrolleeSize') - (@get 'scrollSize')
      isValid = false
      if distance > 0 
        @set 'distance',0
      else if distance < -limit
        @set 'distance',-limit
      else
        isValid = true
      @set "isScrollable",isValid

  return Scroll