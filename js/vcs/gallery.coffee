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
      @updateCurrentArtwork()

    initialize: (option)->
      super(option)
      @artworks ?= option.artworks or {}
      @artworkVCs ?= []
      @artworkRefs = []
      @currentArtworkIndex = 0
      @render()

    onArtworksAllUpdate: ()=>
      console.error 'Artworks All Updated'
      @initializeArtworks()

    update: ()->
      console.log "GalleryVC Updated"
      @initializeArtworks()

    initializeArtworks: ()=>
      if _.isEmpty @artworks
        artwork1 = new Artwork {
          path: '1.png'
          isCurrent: true
        }
        artwork2 = new Artwork {
          path: '2.png'
        }
        artwork3 = new Artwork {
          path: '3.png'
        }
        artwork4 = new Artwork {
          path: '0.png'
        }
        @artworks = new Artworks [artwork1, artwork2]
        @artworks.add [artwork3,artwork4]
        (@currentArtworkIndex = i) for artwork,i in @artworks.models when artwork.isCurrent
      @renderArtworks()
      @artworks.on {
        'allUpdate': @onArtworksAllUpdate
      }


    renderArtworks: ()->
      @ui.$artworks.empty()
      if not @artworks
        console.log "No Artworks to Render"
        return
      console.log @artworks
      for artwork in @artworks.models
        artworkVC = new ArtworkVC {root: 'artworks', position: 'append', template: 'artwork', model: artwork}
        @artworkVCs.push artworkVC

    updateCurrentArtwork: ()->
      @toggleCurrentArtwork()
      if @currentArtworkIndex < @artworks.length-1
        @currentArtworkIndex++
      else
        @currentArtworkIndex = 0
      @toggleCurrentArtwork()

    toggleCurrentArtwork: ()->
      if (@artworks.models[@currentArtworkIndex].get 'isCurrent')
        @artworks.models[@currentArtworkIndex].set 'isCurrent',false
      else
        @artworks.models[@currentArtworkIndex].set 'isCurrent',true

    downloadArtworks: ()->


  return Gallery