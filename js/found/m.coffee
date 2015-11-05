define ['lib/backbone'],(Backbone)->
  class M extends Backbone.Model

    toggle: (attr)->
      if @get attr
        @set attr,false
      else
        @set attr,true
        
  return M