define [
  'underscore'
  'found/vc'
  'vc/booth'
  'vc/receipt'
  'found/utl'
],(_,VC,BoothVC,ReceiptVC,Utl)->
  class GalleryVC extends VC

    initialize: (opt)->
      super(opt)
      @render()

    render: ()->
      super()
      console.log "Gallery Rendered"
      @boothVC = new BoothVC
        $root: @ui.$booth

      @receiptVC = new ReceiptVC
        $root: @ui.$receipt

      @listenTo @receiptVC.c,'didChange:isCurrent',(m,v)=>
        @boothVC.c.add m


      @listenTo @receiptVC,'didChangeState:hasArtworks',(vc,v)=>
        if @boothVC.getState 'hasArtworks'
          return

        predicate = (m,i)->
          return true
        artworks = @receiptVC.c.filter predicate
        @boothVC.c.add artworks

      @listenTo @receiptVC,'didChangeState:isDrawerUnfolded',(vc,v)=>
          if v
            @boothVC.setState 'blur'
          else
            @boothVC.setState 'blur',false

    receipt: (artworks)->
      @boothVC.c.add arr[0]

  return GalleryVC