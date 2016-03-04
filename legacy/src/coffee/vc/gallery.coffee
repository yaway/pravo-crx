define [
  'underscore'
  'core/vc'
  'mc/artworks'
  'vc/booth'
  'vc/receipt'
  'core/utl'
],(_,VC,Artworks,BoothVC,ReceiptVC,Utl)->
  class GalleryVC extends VC

    initialize: (opt)->
      super(opt)
      @render()

    getComponents: ()->
      components =
        booth:
          class: BoothVC
          options:
            rootUI: 'booth'
        receipt:
          class: ReceiptVC
          options:
            rootUI: 'receipt'
      return components
    getActions: ()->

    render: ()->
      super()
      console.log "Gallery Rendered"

      @listenTo @receiptVC.c,'didChange:isChosen',(m,v)=>
        if v
          @boothVC.artworkListVC.add m
          @boothVC.artworkListVC.setCurrent m

      @listenTo @receiptVC,'didChangeState:hasArtworks',(vc,v)=>
        if @boothVC.getState 'hasArtworks'
          return

        predicate = (m,i)->
          return true

        rawArtworks = @receiptVC.c.filter predicate
        artworks = new Artworks rawArtworks
        @boothVC.artworkListVC.add artworks

        if artworks.length > 0
          @boothVC.setState 'hasArtworks'
          @boothVC.artworkListVC.random()

      @listenTo @receiptVC,'didChangeState:isDrawerUnfolded',(vc,v)=>
          if v
            @boothVC.setState 'blur'
          else
            @boothVC.setState 'blur',false

    receipt: (artworks)->
      @boothVC.c.add arr[0]

  return GalleryVC