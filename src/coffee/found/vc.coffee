define [
  'backbone'
  'found/m'
  'found/c'
  'found/utl'
],(Backbone,M,C,Utl)->
  class VC extends Backbone.View
    initialize: (opt)->
      opt ?= {}
      @m = opt.model or new M
      @c = opt.collection
      @ui ?= {}
      @pos = opt.position
      @root = opt.root or document.body
      @$root = opt.$root or $(@root)
      @initVCofM opt
      @initTemplate opt

    getTemplate: (tpl)->
      tplStr = _.unescape $("[data-tpl='#{tpl}']").html()
      return tplStr

    getUI: (ui)->
      return @$el.find("[data-ui='#{ui}']")

    initVCofM: (opt)->
      @m.vc ?= {}
      vcName = @constructor.name
      vcName = Utl.capToCamel vcName
      @m.vc[vcName] = this

    initTemplate: (opt)->
      if opt.template
        @template = @getTemplate opt.template
      else
        @template = ''

    initUI: ()->
      vc = this
      @$el.find('[data-ui]').each ()->
        vc.ui[(@getAttribute 'data-ui')] = this
        vc.ui["$#{(@getAttribute 'data-ui')}"] = $(this)
      
    initEl: (data)->
      data ?= @m?.attributes
      tpl = _.template @template
      elStr = tpl data
      $el = $(elStr)
      
      if @pos is 'append'
        @$root.append $el
      else if @pos is 'prepend'
        @$root.prepend $el
      else if @pos is 'before'
        @$root.before $el
      else if @pos is 'after'
        @$root.after $el
      else
        if @template is ''
          $el = @$root
        else
          @$root.replaceWith $el

      @setElement $el[0]

    render: (data)->
      @initEl data
      @initUI()
      return this

    getState: (k)->
      state = @m.get k
      return state

    setState: (k,v,opt)->
      if (typeof k) is 'object'
        v ?= {}
        opt = v
        for kk,kv of k
          if not opt.silent
            @m.trigger "willChange:#{kk}",@m,kv
            @trigger "willChangeState:#{kk}",this,kv
          @m.set kk,k[kk],opt
          if not opt.silent
            @m.trigger "didChange:#{kk}",@m,kv
            @trigger "didChangeState:#{kk}",this,kv
      else
        v ?= true
        opt ?= {}
        if not opt.silent
          @m.trigger "willChange:#{k}",@m,v
          @trigger "willChangeState:#{k}",this,v
        @m.set k,v,opt
        if not opt.silent
          @m.trigger "didChange:#{k}",@m,v
          @trigger "didChangeState:#{k}",this,v
      return this
    

    resetState: (k,opt)->
      defaults = @m.defaults or {}
      v = defaults[k]
      if v
        @m.set k,v,opt
      else
        @m.set k,null,opt
      return this

    toggleState: (k,opt)->
      if @getState k
        @setState k,false,opt
      else
        @setState k,true,opt
      return this

    checkState: (k,v)->
      v ?= true
      console.error v
      console.error @m.get k
      if (@m.get k) is v
        return true
      else
        return false

    dispatch: (events)->
      for k,v of events
        console.error k

  return VC