define [
  'found/vc'
],(VC)->
  class ArtworkFeed extends VC
    events:
      'click': 'onClick'
    onClick: ()=>
      @setState 'isCurrent'
    initialize: (opt)->
      super(opt)
      @on
        'didChangeState:isCurrent': (m,v)=>
          if v
            @update()
      @render()
    render: ()->
      super()
      @update()
    update: ()->
      if @getState 'isCurrent'
        @$el.addClass 'is-current'

  return ArtworkFeed