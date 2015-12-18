define [
  'found/vc'
],(VC)->
  class ArtworkFeed extends VC
    events:
      'click': 'onClick'
    onClick: ()=>
      @model.trigger 'willChangeIsCurrent'
      @model.set 'isCurrent',true
    initialize: (opt)->
      super(opt)
      @render()

  return ArtworkFeed