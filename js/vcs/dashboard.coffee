define [
  'lib/underscore'
  'found/vc'
  'vcs/gallery'
],(_,VC,GalleryVC)->
  class Dashboard extends VC
    events:
      "click [data-ui='pravo']": 'onClickPravo'

    onClickPravo: ()=>
      console.error 'Pravo!'

    initialize: (option)->
      super(option)
      @render()
      console.log @ui.$gallery
    update: ()->
      console.log 'Pravo!'
      console.log 'Dashboard'
      @gallery = new GalleryVC {root: 'gallery',template: 'gallery'}

  return Dashboard