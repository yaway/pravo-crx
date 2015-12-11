define [
  'found/vc'
  'mc/scroll'
  'jquery-mousewheel'
],(VC,Scroll,JqMousewheel)->
  class ScrollVC extends VC

    events:
      "mousewheel": "onMousewheel"

    onMousewheel: (e)=>
      delta = e.deltaY
      @scroll(delta)

    initialize: (opt)->
      super(opt)
      @model = new Scroll
      if opt.direction
        @model.set 'direction',opt.direction
      if opt.$target
        @$target = opt.$target
      else
        @$target = @$el.children(':first')

      @render()

    update: ()->
      console.log "Scroll Rendered"

    scroll: (delta)->
      timer = @model.get 'timer'
      easeTimer = @model.get 'easeTimer'

      if timer
        clearTimeout timer
        if easeTimer
          clearTimeout easeTimer

      scroll = ()=>
        distance = @model.get 'distance'
        @model.set 'distance',distance+delta
        move()

      ease = ()=>
        @$el.addClass 'is-eased'
        @model.set 'distance',(@model.get 'distance')+delta*2
        move()

      move = ()=>
        if (@model.get 'direction') is 'v'
          @$target.css {"transform": "translateX(#{@model.get 'distance'}px)"}
        else
          @$target.css {"transform": "translateY(#{@model.get 'distance'}px)"}


      timer = setTimeout scroll, 10

      easeTimer = setTimeout ease, 100
      @model.set 'timer',timer
      @model.set 'easeTimer',easeTimer

  return ScrollVC