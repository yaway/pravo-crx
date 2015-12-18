define [
  'found/m'
  'found/utl'
],(M,Utl)->
  class Feed extends M
    defaults:
      name: ""
      isCurrent: false

  return Feed