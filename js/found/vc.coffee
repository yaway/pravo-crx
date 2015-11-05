define [
  'lib/backbone'
  'found/tpl'
],(Backbone,TPL)->
  class VC extends Backbone.View
    initialize: (opt)->
      opt ?= {}
      @model = opt.model
      @ui ?= {}
      @position = opt.position
      @root = opt.root or document.body
      @$root = opt.$root or $(@root)
      if opt.template
        @template = TPL.getTpl opt.template
      else
        @template = @$root[0].outerHTML
    update: ()->
    getUI: (ui)->
      return @$el.find("[data-ui='#{ui}']")
    render: (data)->
      data ?= @model?.attributes
      tpl = _.template @template
      elStr = tpl data
      $el = $(elStr)
      vc = this
      $el.find('[data-ui]').each ()->
        vc.ui[(@getAttribute 'data-ui')] = this
        vc.ui["$#{(@getAttribute 'data-ui')}"] = $(this)
      @setElement $el[0]
      if @position is 'append'
        @$root.append $el
      else if @position is 'prepend'
        @$root.prepend $el
      else if @position is 'before'
        @$root.before $el
      else if @position is 'after'
        @$root.after $el
      else
        @$root.replaceWith $el
      @update()
      return $el[0]
  return VC