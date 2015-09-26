define [
  'lib/underscore'
  'found/vc'
  'vcs/gallery'
],(_,VC,GalleryVC)->
  class Pravo extends VC
    initialize: (option)->
      super(option)
      @render()
    update: ()->
      console.log 'Pravo!'
      new GalleryVC {root: 'gallery',template: 'gallery'}

  return Pravo