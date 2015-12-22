define [
  'backbone'
],(Backbone)->
  class M extends Backbone.Model
    toggle: (k,opt)->
      if @get k
        @set k,false,opt
      else
        @set k,true,opt
      return this

        
  return M