define [
  'lib/underscore'
  'found/c'
  'mcs/Artwork'
  'found/api'
],(_,C,Artwork,API)->
  class Artworks extends C
    model: Artwork

    initialize: ()->
      @on {
        "gotLocal": @onGotLocal
        "gotServer": @onGotServer
      }
      @getLocal()
      @getServer()

    onGotServer: ()=>
      @trigger 'allUpdate'

    onGotLocal: ()=>
      @trigger 'allUpdate'

    update: ()->
      console.log "Updated to #{@length} Artworks"
      console.log @models

    getLocal: ()->
      console.debug "Getting Local Artworks"
      chrome.storage.sync.get 'artworks',(data)=>
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
        console.debug "Local Artworks Get:"
        console.log @models
    setLocal: ()->
      console.debug 'Setting LocalArtworks'
      artworksJSON = JSON.stringify @models
      console.log artworksJSON
      chrome.storage.sync.set {'artworks':artworksJSON},()=>
        @trigger "setLocal"
        console.log "Local Artworks Set:"
        console.log @models

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



  return Artworks