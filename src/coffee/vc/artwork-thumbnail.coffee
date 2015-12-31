define [
  'found/vc'
],(VC)->
  class ArtworkThumbnailVC extends VC
    events:
      'click': 'onClick'
    onClick: ()=>
      @setState 'isChosen'
      @setState 'isCurrent'
    initialize: (opt)->
      super(opt)
      @on
        'didChangeState:isChosen':(vc,v)=>
          if v
            @$el.addClass 'is-chosen'
          else
            @$el.removeClass 'is-chosen'
      @lazyRender()

    lazyRender: ()->
      img = new Image
      img.src = @model.get 'thumb'
      img.onload = ()=>
        @render()



  return ArtworkThumbnailVC