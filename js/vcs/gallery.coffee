define [
  'lib/underscore'
  'found/vc'
  'mcs/artwork'
  'mcs/artworks'
  'vcs/artwork'
],(_,VC,Artwork,Artworks,ArtworkVC)->
  class Gallery extends VC
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
    initialize: (option)->
      super(option)
      @artworks = new Artworks
      @artworks.on {
        'didFetchFromLocal': @onArtworksDidFetchFromLocal
        'didFetchFromServer': @onArtworksDidFetchFromServer
        'change:isFavorite': @onArtworksChangeIsFavorite
        'change:isCurrent': @onArtworksChangeIsCurrent
        'update': @onArtworksUpdate
      }
      @render()

    initializeArtworks: ()=>
      @artworks.fetch
        from:"local"
        callback:(rawArtworks)=>
          limit = 5
          lack = limit - rawArtworks.length

          if lack < 5
            rawArtworks[0].isCurrent = true
            @artworks.add rawArtworks
          if lack > 0
            @artworks.fetch
              from:"konachan"
              callback:(rawArtworks)=>
                if lack = limit
                  rawArtworks[0].isCurrent = true
                else
                  rawArtworks = _.first rawArtworks,lack
                @artworks.add rawArtworks


      
    onArtworksUpdate: ()=>
      @renderArtworks()            

    onArtworksDidFetchFromLocal: ()=>
      if @artworks.length > 0
        @renderArtworks()
    onArtworksDidFetchFromServer: ()=>
      if @artworks.length > 0
        @renderArtworks()
    onArtworksChangeIsFavorite: ()=>
      @updateStateFavorite()
      @artworks.save {only: "fav"}

    update: ()->
      console.log "Gallery Rendered"
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
      @$el.addClass 'with-artworks'
      @ui.$artworks.empty()
      if not @artworks
        console.log "No Artworks to Render"
        return
      console.log @artworks
      for artwork in @artworks.models
        artworkVC = new ArtworkVC {root: 'artworks', position: 'append', template: 'artwork', model: artwork}
      @updateStateFavorite()

    downloadArtworks: ()->


  return Gallery