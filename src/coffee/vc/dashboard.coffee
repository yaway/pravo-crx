define [
  'found/vc'
  'vc/gallery'
  'vc/clock'
  'background-check'
],(VC,GalleryVC,ClockVC,BC)->
  class DashboardVC extends VC

    initialize: (opt)->
      super(opt)
      @render()
      
    render: ()->
      super()
      console.log 'Dashboard Rendered'
      @galleryVC = new GalleryVC
        $root: @ui.$gallery
        template: 'gallery'

      @clockVC = new ClockVC
        $root: @ui.$clock
        template: 'clock'


      @galleryVC.on 
        'didRenderArtworks': ()=>
          @initBC()
        'didChangeCurrentArtwork': ()=>
          @updateBC()
        'didUpdateGallery': ()=>
          @initBC()
          @updateBC()


    initBC: ()->
      BC.init
        targets: '[data-ui="time"],[data-ui="btnFav"],[data-ui="btnTogglePanel"]'
        images: '[data-ui="img"]'
        classes:
          dark: 'is-dark'
          light: 'is-light'
          complex: 'is-complex'
        threshold: 70
        minComplexity: 20
        windowEvents: false
        maxDuration: 1000*30

    updateBC: ()->
      BC.refresh()


  return DashboardVC