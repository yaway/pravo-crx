define [
  'backbone'
  'core/m'
  'core/c'
  'core/utl'
],(Backbone,M,C,Utl)->
  class VC extends Backbone.View
    initialize: (opt)->
      opt ?= {}
      defaults = opt.defaults or {}
      @M ?= M
      @m ?= opt.model or (new @M defaults)
      @c ?= opt.collection
      @ui ?= {}
      @pos ?= opt.position
      @root ?= opt.root or document.body
      @$root ?= opt.$root or $(@root)
      @root = @$root[0]
      @cpn ?= {}

      @initM opt
      @initTpl opt

    render: ()->
      @initEl()
      @initUI()
      @initCpn()

      @dispatch()

    getTpl: (tpl)->
      tplStr = _.unescape $("[data-tpl='#{tpl}']").html()
      return tplStr

    getUI: (ui)->
      return @$el.find("[data-ui='#{ui}']")

    initM: (opt)->
      @m.vc ?= {}
      vcName = @constructor.name
      vcName = Utl.capToCamel vcName
      @m.vc[vcName] = this

    initTpl: (opt)->
      if opt.template
        @tpl = @getTpl opt.template
      else
        @tpl = ''

    initUI: ()->
      vc = this
      @$el.find('[data-ui]').each ()->
        vc.ui[(@getAttribute 'data-ui')] = this
        vc.ui["$#{(@getAttribute 'data-ui')}"] = $(this)
      
    initEl: ()->
      data = @m.attributes or {}
      tpl = _.template @tpl
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
        if @tpl is ''
          $el = @$root
        else
          @$root.replaceWith $el

      @setElement $el[0]

    initCpn: ()->
      components = @getComponents()
      if _.isEmpty components
        return
      for k,v of components
        opt = v.options or {}
        if opt.rootUI
          opt.$root = @getUI opt.rootUI
        @cpn[k] = new v.class opt

    dispatch: ()->
      actions = @getActions()
      if _.isEmpty actions
        return
      splitter = /^(\S+)\s*(.*)$/
      for k,v of actions
        match = k.match splitter
        if match[2] is ''
          @on
            "#{k}": v
        else
          @listenTo @cpn[match[1]],match[2],v
        # console.error match
        # console.error match.length
          # console.error @cpn[match[1]]

    getComponents: ()->
      return {}
    getActions: ()->
      return {}

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
      if (@m.get k) is v
        return true
      else
        return false


  return VC