define [
  'found/vc'
  'mc/artwork'
  'mc/artworks'
  'mc/receipt'
  'vc/artwork-thumbnail'
],(VC,Artwork,Artworks,Receipt,ArtworkThumbnailVC)->
  class ReceiptVC extends VC
    events:
      "click [data-ui='btnNew']": 'onClickBtnNew'

    onClickBtnNew: (e)=>
      console.error 'BtnNew Clicked'
      e.stopPropagation()
      @model.toggle 'isUnfolded'

    initialize: (opt)->
      super(opt)
      @model = new Receipt
      @model.on
        'change:hasArtworks': @onChangeHasArtworks
        'change:isUnfolded': @onChangeIsUnfolded
      @artworks = new Artworks
      @artworks.on
        'didFetchFromServer': @onArtworksDidFetchFromServer
        'update': @onArtworksUpdate
        'change:isChosen': ()=>
          console.error 'Artworks isChosen Changed'

      @render()

    onChangeHasArtworks: ()=>
      if @model.get 'hasArtworks'
        @$el.addClass 'with-artworks'
      else
        @$el.removeClass 'with-artworks'

    onChangeIsUnfolded: ()=>
      if @model.get 'isUnfolded'
        @$el.addClass 'unfolded'
        @ui.$btnNew.text 'Close'
      else
        @$el.removeClass 'unfolded'
        @ui.$btnNew.text 'New'


    initializeArtworks: ()=>
      @artworks.fetch
        from:"unsplash"
        callback: (rawArtworks)=>
          @artworks.add rawArtworks
          console.debug @artworks.pluck 'id'

    onArtworksUpdate: ()=>
      @renderArtworks()

    onArtworksDidFetchFromServer: ()=>
      @ui.$countNew.text " (#{@artworks.length})"

    update: ()->
      console.log "Receipt Rendered"
      @initializeArtworks()

    renderArtworks: ()->
      @ui.$artworks.empty()

      if not @artworks
        console.log "No Artworks to Render"
        return

      console.error "#{@artworks.length} Artworks Rendered"

      @model.set 'hasArtworks',true

      for artwork in @artworks.models
        artworkVC = new ArtworkThumbnailVC
          $root: @ui.$artworks
          position: 'append'
          template: 'artworkThumbnail'
          model: artwork

  return ReceiptVC