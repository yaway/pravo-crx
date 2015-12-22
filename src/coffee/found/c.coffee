define [
  'backbone'
],(Backbone)->
  class C extends Backbone.Collection
    initialize: ()->
      @on
        "update": @update
    allSet: (k,v,opt)->
      for model in @models
        model.set k,v,opt
      return this

  return C