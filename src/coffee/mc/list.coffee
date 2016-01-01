define [
  'found/m'
],(M)->
  class List extends M
    defaults:
      from: 'local'
      current: null
      reset: true
      willFetch: false
      didFetch: false
      willRender: false
      didRender: false
      
  return List