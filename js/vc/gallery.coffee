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
        "change:isChosen": ()=>
          chosenArtwork = @receiptVC.artworks.findWhere {'isChosen': true}
          if chosenArtwork
            console.error chosenArtwork
            @boothVC.artworks.add chosenArtwork
            chosenArtwork.trigger 'willChangeIsCurrent'
            chosenArtwork.set 'isCurrent',true

        "didFetchFromServer": ()=>
          @receiptVC.artworks.remove (@boothVC.artworks.pluck 'id')
          # for receiptArtwork in @receiptVC.artworks.models
          #   for boothArtwork in @boothVC.artworks.models
          #     if (receiptArtwork.get 'id') is (boothArtwork.get 'id')
          #       # receiptArtwork.set 'isChosen',true
          #       @receiptVC.artworks.remove receiptArtwork


  return GalleryVC