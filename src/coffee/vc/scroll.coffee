define [
  'found/vc'
  'mc/scroll'
  'jquery-mousewheel'
],(VC,Scroll,JqMousewheel)->
  class ScrollVC extends VC

    events:
      "mousewheel": "onMousewheel"
      "click": "onClick"

    onMousewheel: (e)=>
      console.error 'Mousewheeled'

      timer = @model.get 'timer'
      easeTimer = @model.get 'easeTimer'
      delta = e.deltaY

      if timer
        clearTimeout timer
        if easeTimer
          clearTimeout easeTimer

      scroll = ()=>
        distance = @model.get 'distance'
        @model.set 'distance',distance+delta
        @scroll()

      ease = ()=>
        @$el.addClass 'is-eased'
        @model.set 'distance',(@model.get 'distance')+delta*1.8
        @scroll()

      timer = setTimeout scroll, 10

      easeTimer = setTimeout ease, 100
      @model.set 'timer',timer
      @model.set 'easeTimer',easeTimer

    onClick: (e)=>
      console.error "Scroll Clicked"


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

    scroll: ()->
      console.error 'Scrolled'
      if (@model.get 'direction') is 'v'
        @$target.css {"transform": "translateX(#{@model.get 'distance'}px)"}
      else
        @$target.css {"transform": "translateY(#{@model.get 'distance'}px)"}


  return ScrollVC