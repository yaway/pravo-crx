define [
  'lib/underscore'
  'found/c'
  'mcs/Artwork'
  'found/api'
],(_,C,Artwork,API)->
  class Artworks extends C
    model: Artwork

    initialize: ()->
      @currentIndex = 0
      @isSettingLocal = false
      @on {
        "change:isCurrent": @onChangeIsCurrent
      }

    onChangeIsCurrent: ()=>
      @updateCurrentIndex()

    update: ()->
      console.log "Updated to #{@length} Artworks"
      console.log @models


    getAlter: ()->
      if @length is 0
        @add [
          {
            path: '1.png'
            isCurrent: true
          }
          {
            path: '2.png'
          }
          {
            path: '3.png'
          }
          {
            path: '0.png'
          }
        ]

    getLocal: ()->
      console.debug "Getting Local Artworks"
      chrome.storage.local.get 'artworks',(data)=>
        unless data.artworks
          console.log 'No Local Artworks'
        else
          @reset()
          rawArtworks = JSON.parse (data.artworks or {})
          for rawArtwork in rawArtworks
            console.log "New Artwork from Local"
            # artwork = new Artwork rawArtwork
            @add rawArtwork
        @trigger "gotLocal"
        console.debug "Local Artworks Got:"
        console.log @models
    setLocal: ()->
      @isSettingLocal = true
      console.debug 'Setting LocalArtworks'
      artworksJSON = JSON.stringify @models
      console.log artworksJSON
      chrome.storage.local.set {'artworks':artworksJSON},()=>
        @trigger "setLocal"
        console.debug "Local Artworks Set:"
        console.log @models
      @isSettingLocal = false

    getServer: ()->
      console.debug "Getting Server Artworks"
      API.getArtworks {},(err,data)=>
        refArtworks = []
        console.debug "Server Data:"
        console.log data
        if data?.length > 0
          @reset()
          refArtworks = data
          for refArtwork in refArtworks
            # artwork = new Artwork {
            rawArtwork = {
              id: refArtwork.id
              url: refArtwork.file_url
            }
            @add rawArtwork
            @at(0).set 'isCurrent',true
          @trigger "gotServer"
          console.debug "Server Artworks Get:"
          console.log @models

    loop: ()->
      @toggleCurrent()
      if @currentIndex < @length-1
        @currentIndex++
      else
        @currentIndex = 0
      @toggleCurrent()

    toggleCurrent: ()->
      console.debug 'Is Artworks C:'
      console.log this
      if (@at @currentIndex).get 'isCurrent'
        (@at @currentIndex).set 'isCurrent',false
      else
        (@at @currentIndex).set 'isCurrent',true

    updateCurrentIndex: ()->
      for artwork,i in @models
        if artwork.get 'isCurrent'
          @currentIndex = i
          console.error i



  return Artworks