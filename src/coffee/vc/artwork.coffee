define [
  'found/vc'
],(VC)->
  class Artwork extends VC
    initialize: (opt)->
      super(opt)
      @m.on
        'change:isCurrent': (m,v)=>
          if v
            @$el.addClass 'is-current'
          else
            @$el.removeClass 'is-current'
      @render()

  return Artwork