define [
  'found/vc'
],(VC)->
  class ArtworkFeed extends VC
    events:
      'click': 'onClick'
    onClick: ()=>
      @model.trigger 'willChangeIsCurrent'
      @setState 'isCurrent'
    initialize: (opt)->
      super(opt)
      @model.on
        'change:isCurrent': ()=>
          @update()
      @render()
    update: ()->
      if @getState 'isCurrent'
        @$el.addClass 'is-current'

  return ArtworkFeed