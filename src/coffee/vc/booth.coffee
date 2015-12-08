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
      "click [data-ui='btnToggleFav']": 'onClickBtnToggleFav'

    onClickArtwork: (e)=>
      console.log 'Artwork Clicked'
      e.stopPropagation()
      if @model.get 'ableToLoop'
        @artworks.loop()
        @updateStateFavorite()
      @trigger 'didClickArtwork'

    onClickBtnToggleFav: (e)=>
      e.stopPropagation()
      console.log 'BtnFav Clicked'
      currentArtwork = @artworks.getCurrent()
      console.log currentArtwork

      currentArtwork.toggle 'isFavorite'


    initialize: (opt)->
      super(opt)
      @artworks = new Artworks
      @artworks.on
        'didFetchFromLocal': @onArtworksDidFetchFromLocal
        'didFetchFromServer': @onArtworksDidFetchFromServer
        'change:isFavorite': @onArtworksChangeIsFavorite
        'change:isCurrent': @onArtworksChangeIsCurrent
        'add': @onArtworksAdd
        'update': @onArtworksUpdate

      @model = new Booth
      @model.on
        'change:hasArtworks': @onChangeHasArtworks
      @render()

    update: ()->
      console.log "Booth Rendered"
      @initializeArtworks()

    onChangeHasArtworks: ()=>
      if @model.get 'hasArtworks'
        @$el.addClass 'has-artworks'
      else
        @$el.removeClass 'has-artworks'


    initializeArtworks: ()=>
      @artworks.fetch
        from: "local"
        callback: (rawArtworks)=>
          # limit = 5
          # lack = limit - rawArtworks.length
          if rawArtworks.length > 0
            index = Math.floor Math.random()*rawArtworks.length
            rawArtworks[index].isCurrent = true
            @artworks.add rawArtworks

      
    onArtworksUpdate: ()=>
      console.log "Artwork Updated"
      @renderArtworks()

    onArtworksAdd: (artwork)=>
      if artwork.get 'isCurrent'
        artwork.trigger 'willChangeIsCurrent'
        artwork.set 'isCurrent',true

    onArtworksChangeIsFavorite: ()=>
      @updateStateFavorite()
      @artworks.save {only: "fav"}

    onArtworksChangeIsCurrent: ()=>
      @updateStateFavorite()
      @trigger 'didChangeCurrentArtwork'

    updateStateFavorite: ()->
      if @artworks.length is 0
        return

      currentArtwork = @artworks.getCurrent()
      if currentArtwork?.get 'isFavorite'
        @$el.addClass 'is-favorite'
        @ui.$icoToggleFav.text 'bookmark'
      else
        @$el.removeClass 'is-favorite'
        @ui.$icoToggleFav.text 'bookmark_border'

    renderArtworks: ()->
      @ui.$artworkList.empty()

      if @artworks.length is 0
        console.log "No Artworks to Render"
        return

      console.log "#{@artworks.length} Artworks Rendered"

      @model.set 'hasArtworks',true
      for artwork in @artworks.models
        artworkVC = new ArtworkVC
          $root: @ui.$artworkList
          position: 'append'
          template: 'artwork'
          model: artwork
      @updateStateFavorite()
      @trigger 'didRenderArtworks'


  return BoothVC