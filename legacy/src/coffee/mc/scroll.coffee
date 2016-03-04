define [
  'core/m'
],(M)->
  class Scroll extends M
    defaults:
      "direction": "h"
      "distance": 0
      "validDistance": 0
      "scrollSize": 0
      "scrolleeSize": 0
      "isScrollable": false

  return Scroll