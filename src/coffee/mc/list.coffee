define [
  'found/m'
],(M)->
  class List extends M
    defaults:
      from: 'local'
      current: 0
      reset: true
      willFetch: false
      didFetch: false
      willRender: false
      didRender: false
      
  return List