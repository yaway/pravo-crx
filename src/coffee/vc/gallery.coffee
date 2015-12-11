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
          # @receiptVC.model.set 'isUnfolded',false
        "didChangeCurrentArtwork": ()=>
          @trigger 'didChangeCurrentArtwork'
        "didRenderArtworks": ()=>
          @trigger 'didRenderArtworks'

      @receiptVC.on
        "didChooseArtwork": (artwork)=>
          @boothVC.artworks.add artwork
        "didUpdate": ()=>
          @receiptVC.artworks.remove (@boothVC.artworks.pluck 'id')
        "didUnfoldDrawer": ()=>
          @boothVC.$el.addClass 'blur'

      @trigger 'didUpdateGallery'


  return GalleryVC