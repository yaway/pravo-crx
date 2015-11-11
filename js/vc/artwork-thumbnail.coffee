define [
  'found/vc'
],(VC)->
  class ArtworkThumbnailVC extends VC
    events:
      'click': 'onClick'
    onClick: ()=>
      console.error 'ArtworkThumbnail Clicked'
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
        @$el.addClass 'chosen'
      else
        @$el.removeClass 'chosen'

    update: ()->

  return ArtworkThumbnailVC