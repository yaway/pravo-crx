define [
  'found/vc'
],(VC)->
  class Artwork extends VC
    initialize: (opt)->
      super(opt)
      @on
        'didChangeState:isCurrent': (m,v)=>
          if v
            @$el.addClass 'is-current'
          else
            @$el.removeClass 'is-current'
      @render()

  return Artwork