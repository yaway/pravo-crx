define [
  'found/vc'
  'moment'
],(VC,moment)->
  class ClockVC extends VC
    initialize: (opt)->
      super(opt)
      @render()
    render: ()->
      super()
      console.log 'Clock Rendered'
      @renderTime()
      setInterval ()=>
        @renderTime()
      , 1000
    renderTime: ()->
      @ui.$time.text moment().format('hh:mm:ss')


  return ClockVC