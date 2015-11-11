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

      @receiptVC.artworks.on
        "change:isChosen": (a)=>
          console.error a
          chosenArtwork = @receiptVC.artworks.findWhere
            isChosen: true
            isCurrent: true
          console.error chosenArtwork
          if chosenArtwork
            @boothVC.artworks.add chosenArtwork

        "didFetchFromServer": ()=>
          @receiptVC.artworks.remove (@boothVC.artworks.pluck 'id')


  return GalleryVC