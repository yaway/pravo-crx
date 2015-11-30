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
    update: ()->
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
    initBC: ()->
      BC.init
        targets: "[data-ui='time'],[data-ui='btnFav']"
        images: "[data-ui='img']"
        # targets: ".layer-dashboard"
        # images: ".img"
        classes:
          dark: 'is-dark'
          light: 'is-light'
          complex: 'is-complex'
        threshold: 80
        minComplexity: 20
        windowEvents: false
        maxDuration: 10000

    updateBC: ()->
      BC.refresh()


  return DashboardVC