define [
  'found/vc'
  'vc/booth'
  'vc/receipt'
],(VC,BoothVC,ReceiptVC)->
  class GalleryVC extends VC

    initialize: (option)->
      super(option)
      @render()

    update: ()->
      console.log "Gallery Rendered"
      @boothVC = new BoothVC
        $root: @ui.$booth
      @receiptVC = new ReceiptVC
        $root: @ui.$receipt

      @boothVC.on
        "didClickArtwork": ()=>
          console.error 'Booth Artwork Clicked'
          @receiptVC.model.set 'isUnfolded',false

      @receiptVC.on
        "didChooseArtwork": (artwork)=>
          @boothVC.artworks.add artwork
        "didUpdate": ()=>
          @receiptVC.artworks.remove (@boothVC.artworks.pluck 'id')


  return GalleryVC