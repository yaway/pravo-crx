define [
  'core/m'
  'core/utl'
],(M,Utl)->
  class Feed extends M
    defaults:
      name: ""
      isCurrent: false

  return Feed