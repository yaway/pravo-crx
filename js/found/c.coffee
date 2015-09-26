define ['lib/backbone'],(Backbone)->
  class C extends Backbone.Collection
    initialize: ()->
      @on {
        "update": @update
      }
  return C