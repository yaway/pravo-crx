define [
  'backbone'
],(Backbone)->
  class M extends Backbone.Model
    toggle: (attr,opt)->
      opt ?= {}
      if @get attr
        @set attr,false,opt
      else
        @set attr,true,opt
        
  return M