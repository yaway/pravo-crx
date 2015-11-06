define ['lib/backbone'],(Backbone)->
  class C extends Backbone.Collection
    initialize: ()->
      @on
        "update": @update
    allSet: (attrs)->
      for model in @models
        model.set attrs

  return C