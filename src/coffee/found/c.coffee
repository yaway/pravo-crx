define [
  'backbone'
],(Backbone)->
  class C extends Backbone.Collection
    initialize: ()->
      @on
        "update": @update
    allSet: (attrs,opt)->
      opt ?= {}
      for model in @models
        model.set attrs,{silent: true}

  return C