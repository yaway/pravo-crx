define [
  'found/vc'
  'mc/artwork'
  'mc/artworks'
  'mc/booth'
  'vc/artwork'
],(VC,Artwork,Artworks,Booth,ArtworkVC)->
  class BoothVC extends VC
    events:
      "click [data-ui='artwork']": 'onClickArtwork'
      "click [data-ui='btnFav']": 'onClickBtnFav'

    onClickArtwork: (e)=>
      console.error 'Artwork Clicked'
      e.stopPropagation()
      @artworks.loop()
      @updateStateFavorite()

    onClickBtnFav: (e)=>
      console.error 'BtnFav Clicked'
      console.error 'e'
      e.stopPropagation()
      @artworks.getCurrent().toggleFavorite()


    initialize: (opt)->
      super(opt)
      @artworks = new Artworks
      @artworks.on
        'didFetchFromLocal': @onArtworksDidFetchFromLocal
        'didFetchFromServer': @onArtworksDidFetchFromServer
        'change:isFavorite': @onArtworksChangeIsFavorite
        'change:isCurrent': @onArtworksChangeIsCurrent
        'update': @onArtworksUpdate

      @model = new Booth
      @model.on
        'change:hasArtworks': @onChangeHasArtworks
      @render()

    onChangeHasArtworks: ()=>
      if @model.get 'hasArtworks'
        @$el.addClass 'with-artworks'
      else
        @$el.removeClass 'with-artworks'


    initializeArtworks: ()=>
      @artworks.fetch
        from: "local"
        callback: (rawArtworks)=>
          limit = 5
          lack = limit - rawArtworks.length

          if rawArtworks.length > 0
            rawArtworks[0].isCurrent = true
            @artworks.add rawArtworks

      
    onArtworksUpdate: ()=>
      @renderArtworks()            

    onArtworksChangeIsFavorite: ()=>
      @updateStateFavorite()
      @artworks.save {only: "fav"}

    update: ()->
      console.log "Booth Rendered"
      @initializeArtworks()

    updateStateFavorite: ()->
      currentArtwork = @artworks.getCurrent()
      if currentArtwork.get 'isFavorite'
        @$el.addClass 'favorite'
        @ui.$btnFav.text 'Faved'
      else
        @$el.removeClass 'favorite'
        @ui.$btnFav.text 'Fav'

    renderArtworks: ()->
      @ui.$artworks.empty()
      
      if not @artworks
        console.log "No Artworks to Render"
        return

      console.error "#{@artworks.length} Artworks Rendered"

      @model.set 'hasArtworks',true
      for artwork in @artworks.models
        artworkVC = new ArtworkVC
          $root: @ui.$artworks
          position: 'append'
          template: 'artwork'
          model: artwork
      @updateStateFavorite()


  return BoothVC