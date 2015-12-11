define [
  'found/vc'
],(VC)->
  class ArtworkFeedVC extends VC
    events:
      'click': 'onClick'
    onClick: ()=>
      @model.trigger 'willChangeIsCurrent'
      @model.set 'isCurrent',true
    initialize: (opt)->
      super(opt)
      @model.on
        'change:isCurrent': @onChangeIsCurrent
      @render()

    onChangeIsChosen: ()=>
      @updateStateChosen()

    updateStateChosen: ()->
      if (@model.get 'isChosen')
        @$el.addClass 'is-chosen'
      else
        @$el.removeClass 'is-chosen'

    update: ()->
      @updateStateChosen()

  return ArtworkFeedVC