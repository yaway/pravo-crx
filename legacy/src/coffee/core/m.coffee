define [
  'backbone'
],(Backbone)->
  class M extends Backbone.Model
    # initialize: ()->
    #   defaults = @getDefaults()
    #   opt =
    #     silent: true
    #   @set defaults,opt
    #   super()
    # getDefaults: ()->
    #   superDefaults = @__proto__.__proto__.defaults
    #   defaults = @defaults
    #   return _.extend superDefaults,defaults
    toggle: (k,opt)->
      if @get k
        @set k,false,opt
      else
        @set k,true,opt
      return this
  return M