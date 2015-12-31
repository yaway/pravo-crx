define [
  'found/vc'
  'mc/scroll'
  'jquery-mousewheel'
],(VC,Scroll,JqMousewheel)->
  class ScrollVC extends VC
    events:
      "mousewheel": 'onMousewheel'
      "transitionend": 'onMove'
    onMousewheel: (e)=>
      delta = e.deltaY
      @scroll(delta)
    onMove: (e)=>
      if e.target is @$scrollee[0]
        e.stopPropagation()
        if @getState 'isScrollingToEnd'
          @setState 'didScrollToEnd'
        else
          @setState 'didScrollToEnd',false

    initialize: (opt)->
      @m = opt.model or new Scroll
      super(opt)
      if opt.$scrollee
        @$scrollee = opt.$scrollee
      else if @ui.$scrollee
        @$scrollee = @ui.$scrollee
      else
        console.debug 'No Scrollee'

      @render()

    render: ()->
      super()
      console.log 'Scroll Rendered'
      @resize()

    refresh: ()->
      @setState 'distance',0
      @move()
      @resize()

    resize: ()->
      direction = @getState 'direction'
      scrollSize = 0
      scrolleeSize = 0
      if direction is 'h'
        scrollSize = @$el.height()
        scrolleeSize = @$scrollee.height()
      else
        scrollSize = @$el.width()
        scrolleeSize = @$scrollee.width()+56
      @setState 'scrollSize',scrollSize
      @setState 'scrolleeSize',scrolleeSize

    move: ()=>
      @validateDistance()
      if (@getState 'direction') is 'v'
        @$scrollee.css {"transform": "translateX(#{@getState 'distance'}px)"}
      else
        @$scrollee.css {"transform": "translateY(#{@getState 'distance'}px)"}

    scroll: (delta)->
      timer = @getState 'timer'
      easeTimer = @getState 'easeTimer'
      if timer
        clearTimeout timer
        if easeTimer
          clearTimeout easeTimer
      move = ()=>
        distance = @getState 'distance'
        @setState 'distance',distance+delta
        @move()
      ease = ()=>
        @$el.addClass 'is-eased'
        @setState 'distance',(@getState 'distance')+delta*4
        @move()
      if @getState 'isScrollable'
        @resize()
        timer = setTimeout move, 8
        easeTimer = setTimeout ease, 80
        @setState 'timer',timer
        @setState 'easeTimer',easeTimer
      else
        move()

    validateDistance: ()->
      distance = @getState 'distance'
      limit = (@getState 'scrolleeSize') - (@getState 'scrollSize')
      isValid = false
      opt =
        silent: true
      if distance > 0 
        @setState 'distance',0,opt
      else if distance < -limit
        @setState 'distance',-limit,opt
        isScrollingToEnd = true
      else
        isValid = true
      @setState 'isScrollingToEnd',(isScrollingToEnd or false)
      @setState "isScrollable",isValid

  return ScrollVC