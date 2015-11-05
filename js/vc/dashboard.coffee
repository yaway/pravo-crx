define [
  'found/vc'
  'vc/gallery'
],(VC,GalleryVC)->
  class DashboardVC extends VC

    initialize: (opt)->
      super(opt)
      @render()
    update: ()->
      console.log 'Dashboard Rendered'
      @galleryVC = new GalleryVC
        $root: @ui.$gallery
        template: 'gallery'

  return DashboardVC