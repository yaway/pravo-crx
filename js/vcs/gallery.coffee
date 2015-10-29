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
    onClickArtwork: ()=>
      console.error 'Artwork Clicked'
      @artworks.loop()
      # if @artworks.isSettingLocal
      #   console.error 'Is Setting Local Artworks'
      #   @artworks.once 'setLocal',@artworks.setLocal
      # else
      #   @artworks.setLocal()

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

    update: ()->
      console.log "Gallery Rendered"
      @initializeArtworks()

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