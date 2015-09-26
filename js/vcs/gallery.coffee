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
      @updateCurrentArtwork()
      @setLocalArtworks()

    initialize: (option)->
      super(option)
      @artworks ?= option.artworks or {}
      @artworkVCs ?= []
      @currentArtworkIndex = 0
      @render()
      @on {
        "gotLocalArtworks": @onGotLocalArtworks
        "settedLocalArtworks": @onSettedLocalArtworks
      }

    update: ()->
      console.log "GalleryVC Updated"
      @getLocalArtworks()

    onGotLocalArtworks: ()=>
      console.log 'Got LocalArtworks'
      if _.isEmpty @artworks
        artwork1 = new Artwork {
          path: '1.png'
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
        @artworks.models[@currentArtworkIndex].set 'isCurrent', true
      else
        for artwork,i in @artworks.models
          if (artwork.get 'isCurrent')
            @currentArtworkIndex = i
            console.log "Current Index is #{i}"

      @setLocalArtworks()
      @renderArtworks()

    onSettedLocalArtworks: ()=>
      console.log 'Setted LocalArtworks'

    setLocalArtworks: ()->
      console.log 'Setting LocalArtworks'
      artworksJSON = JSON.stringify @artworks.models
      console.log artworksJSON
      chrome.storage.sync.set {'artworks':artworksJSON},()=>
        @trigger "settedLocalArtworks"
        console.log "Local Data Setted:"
        console.log @artworks

    getLocalArtworks: ()->
      @artworks = {}
      console.log 'Getting LocalArtworks'
      chrome.storage.sync.get 'artworks',(data)=>
        console.log "Local Data Got:"
        console.log data
        unless data.artworks
          console.log 'No Local Artworks'
        else
          rawArtworks = JSON.parse (data.artworks or {})
          @artworks = new Artworks
          for rawArtwork in rawArtworks
            console.log "New Artwork from Local"
            artwork = new Artwork rawArtwork
            @artworks.add artwork
        @trigger "gotLocalArtworks"


    renderArtworks: ()->
      if not @artworks
        console.log "No Artworks to Render"
        return
      console.log @artworks
      for artwork in @artworks.models
        artworkVC = new ArtworkVC {root: 'artworks', position: 'append', template: 'artwork', model: artwork}
        @artworkVCs.push artworkVC

    updateCurrentArtwork: (index)->
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


  return Gallery