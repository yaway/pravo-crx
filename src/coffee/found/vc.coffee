define [
  'backbone'
  'found/m'
  'found/utl'
],(Backbone,M,Utl)->
  class VC extends Backbone.View
    initialize: (opt)->
      opt ?= {}
      @model = opt.model or new M
      @ui ?= {}
      @position = opt.position
      @root = opt.root or document.body
      @$root = opt.$root or $(@root)
      if opt.template
        @template = Utl.getTpl opt.template
      else
        @template = ''
    update: ()->

    getUI: (ui)->
      return @$el.find("[data-ui='#{ui}']")

    render: (data)->
      data ?= @model?.attributes
      tpl = _.template @template
      elStr = tpl data
      $el = $(elStr)
      
      if @position is 'append'
        @$root.append $el
      else if @position is 'prepend'
        @$root.prepend $el
      else if @position is 'before'
        @$root.before $el
      else if @position is 'after'
        @$root.after $el
      else
        if @template is ''
          $el = @$root
        else
          @$root.replaceWith $el

      vc = this
      $el.find('[data-ui]').each ()->
        vc.ui[(@getAttribute 'data-ui')] = this
        vc.ui["$#{(@getAttribute 'data-ui')}"] = $(this)

      @setElement $el[0]
      @update()
      return this


    getState: (k)->
      state = @model.get k
      return state

    setState: (k,v,opt)->
      if (typeof k) is 'object'
        @model.set k,v,opt
      else
        if v and (typeof v) isnt 'boolean'
          @model.set k,v,opt
        else
          @model.set k,true,opt
      return this
    

    resetState: (k,opt)->
      defaults = @model.defaults or {}
      v = defaults[k]
      if v
        @model.set k,v,opt
      else
        @model.set k,null,opt

      return this

    toggleState: (k,opt)->
      if @model.get k
        @model.set k,false,opt
      else
        @model.set k,true,opt
      return this

    checkState: (k,v)->
      v ?= true
      console.error v
      console.error @model.get k
      if (@model.get k) is v
        return true
      else
        return false

  return VC