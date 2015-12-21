define [
  'found/m'
],(M)->
  class Progress extends M
    defaults:
      isDone: false
      done: 0
      total: 0
    initialize: ()->
      console.log 'New Progress'
  return Progress