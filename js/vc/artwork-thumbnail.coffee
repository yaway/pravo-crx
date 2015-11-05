define [
  'found/vc'
],(VC)->
  class ArtworkThumbnailVC extends VC
    initialize: (opt)->
      super(opt)
      @render()

    update: ()->

  return ArtworkThumbnailVC