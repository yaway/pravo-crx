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
    onClickArtwork: ()=>
      console.error 'Artwork Clicked'
      @artworks.loop()
      # if @artworks.isSettingLocal
      #   console.error 'Is Setting Local Artworks'
      #   @artworks.once 'setLocal',@artworks.setLocal
      # else
      #   @artworks.setLocal()
      @updateStateFavorite()
    onClickBtnFav: ()=>
      console.error 'BtnFav Clicked'
      @favCurrentArtwork()

    initialize: (option)->
      super(option)
      @artworks = new Artworks
      @artworks.currentIndex = 0
      @isArtworksSetLocal = false
      @render()        

    initializeArtworks: ()=>
      # @artworks.getLocal()
      @artworks.getServer()
      # newArtworks = new Artworks
      # newArtworks.getServer()
      @renderArtworks()
      @artworks.on {
        'gotLocal': @onArtworksGotLocal
        'setLocal': @onArtworksSetLocal
        'gotServer': @onArtworksGotServer
        'changeIsFavorite': @onArtworksChangeIsFavorite
      }
    onArtworksGotServer: ()=>
      console.error 'Artworks Got Server'
      @artworks.setLocal()
      @renderArtworks()
    onArtworksGotLocal: ()=>
      console.error 'Artworks Got Local'
      if @artworks.length > 0
        @renderArtworks()
      else
        @artworks.getServer()
    onArtworksSetLocal: ()=>
      console.error 'Artworks Set Local'
      @isArtworksSetLocal = true
    onArtworksChangeIsFavorite: ()=>
      @updateStateFavorite()


    update: ()->
      console.log "Gallery Rendered"
      @initializeArtworks()

    updateStateFavorite: ()->
      currentArtwork = @artworks.getCurrentArtwork()
      if currentArtwork.getFav()
        @$el.addClass 'favorite'
        @ui.$btnFav.text 'Faved'
      else
        @$el.removeClass 'favorite'
        @ui.$btnFav.text 'Fav'

    favCurrentArtwork: ()->
      @artworks.getCurrentArtwork().setFav()

    renderArtworks: ()->
      @ui.$artworks.empty()
      if not @artworks
        console.log "No Artworks to Render"
        return
      console.log @artworks
      for artwork in @artworks.models
        artworkVC = new ArtworkVC {root: 'artworks', position: 'append', template: 'artwork', model: artwork}

    downloadArtworks: ()->


  return Gallery