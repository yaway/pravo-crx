define [
  'found/vc'
  'vc/booth'
  'vc/receipt'
],(VC,BoothVC,ReceiptVC)->
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
      @receiptVC.on
        'didChangeState:isDrawerUnfolded':(m,v)=>
          if v
            @boothVC.setState 'blur'
          else
            @boothVC.setState 'blur',false


  return GalleryVC