define [
  'found/vc'
],(VC)->
  class ArtworkThumbnailVC extends VC
    events:
      'click': 'onClick'
    onClick: ()=>
      @model.trigger 'willChangeIsCurrent'
      @model.set 'isCurrent',true
      @model.trigger 'willChangeIsChosen'
      # @model.toggle 'isChosen'
      @model.set 'isChosen',true
    initialize: (opt)->
      super(opt)
      @model.on
        'change:isChosen': @onChangeIsChosen
        'change:isCurrent': @onChangeIsCurrent
      @render()


    onChangeIsChosen: ()=>
      if @model.get 'isChosen'
        @$el.addClass 'is-chosen'
      else
        @$el.removeClass 'is-chosen'

    update: ()->

  return ArtworkThumbnailVC