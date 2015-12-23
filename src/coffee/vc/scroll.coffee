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
      @model ?= new Scroll
      if opt.direction
        @model.set 'direction',opt.direction
      if opt.$scrollee
        @$scrollee = opt.$scrollee
      else if @ui.$scrollee
        @$scrollee = @ui.$scrollee
      else
        console.error 'No Scrollee'
      @render()
    render: ()->
      super()
      console.log 'Scroll Rendered'
      @resize()

    resize: ()->
      direction = @model.get 'direction'
      scrollSize = 0
      scrolleeSize = 0
      if direction is 'h'
        scrollSize = @$el.height()
        scrolleeSize = @$scrollee.height()
      else
        scrollSize = @$el.width()
        scrolleeSize = @$scrollee.width()+56
      @model.set 'scrollSize',scrollSize
      @model.set 'scrolleeSize',scrolleeSize

    scroll: (delta)->
      timer = @model.get 'timer'
      easeTimer = @model.get 'easeTimer'
      if timer
        clearTimeout timer
        if easeTimer
          clearTimeout easeTimer
      scroll = ()=>
        distance = @model.get 'distance'
        @model.trigger 'willChangeDisance'
        @model.set 'distance',distance+delta
        move()
      ease = ()=>
        @$el.addClass 'is-eased'
        @model.trigger 'willChangeDisance'
        @model.set 'distance',(@model.get 'distance')+delta*4
        move()
      move = ()=>
        if (@model.get 'direction') is 'v'
          @$scrollee.css {"transform": "translateX(#{@model.get 'distance'}px)"}
        else
          @$scrollee.css {"transform": "translateY(#{@model.get 'distance'}px)"}
      if @model.get 'isScrollable'
        @resize()
        timer = setTimeout scroll, 10
        easeTimer = setTimeout ease, 100
        @model.set 'timer',timer
        @model.set 'easeTimer',easeTimer
      else
        scroll()

  return ScrollVC