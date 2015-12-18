define [
  'found/vc'
  'vc/booth'
  'vc/receipt'
],(VC,BoothVC,ReceiptVC)->
  class GalleryVC extends VC

    initialize: (opt)->
      super(opt)
      @render()

    update: ()->
      console.log "Gallery Rendered"
      @boothVC = new BoothVC
        $root: @ui.$booth
      @receiptVC = new ReceiptVC
        $root: @ui.$receipt

      @boothVC.on
        "didClickArtwork": ()=>
          console.log 'Booth Artwork Clicked'

      @receiptVC.on
        "didChooseArtwork": (artwork)=>
          @boothVC.artworks.add artwork
        "didUnfoldDrawer": ()=>
          @boothVC.$el.addClass 'blur'
        "didFoldDrawer": ()=>
          @boothVC.$el.removeClass 'blur'

      @trigger 'didUpdateGallery'


  return GalleryVC