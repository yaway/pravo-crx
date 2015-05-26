define [
  'lib/backbone'
  'found/tpl'
],(Backbone,TPL)->
  class VC extends Backbone.View
    constructor: (option)->
      option ?= {}
      @ui ?= {}
      @block = option.block
      @$root = $("[data-root='#{option.root or ''}']")
      if option.template
        @template = TPL.getTpl option.template
      else
        @template = @template or '<div></div>'
    update: ()->
    getUi: (ui)->
      return @$el.find("[data-ui='#{ui}']")
    getRenderData: ()->
      if @model
        return @model.toJSON()
      return {}
    render: (data)->
      data ?= @getRenderData()
      tpl = _.template @template
      elStr = tpl data
      $el = $(elStr)
      vc = this
      $el.find('[data-ui]').each ()->
        vc.ui[(@getAttribute 'data-ui')] = this
        vc.ui["$#{(@getAttribute 'data-ui')}"] = $(this)
      @setElement $el[0]
      if @block is 'ap'
        @$root.append $el
      else if @block is 'pre'
        @$root.prepend $el
      else
        @$root.replaceWith $el
      @update()
      return $el[0]
  return VC