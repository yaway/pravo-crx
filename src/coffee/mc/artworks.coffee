define [
  'found/c'
  'mc/artwork'
  'found/api'
  'found/utl'
],(C,Artwork,API,Utl)->
  class Artworks extends C
    model: Artwork
    
    initialize: ()->
      console.log "New Artworks"

    save: (opt)->
      console.debug 'Will Save Artworks'

      rawArtworks = Utl.deepCopy @models
      _.map rawArtworks,(artwork)=>
        artwork.isCurrent = false
        return artwork
      if opt.only is "fav"
        rawArtworks = _.where rawArtworks,{isFavorite: true}
      else if opt.only is "nil"
        rawArtworks = []
      artworksJSON = JSON.stringify rawArtworks
      console.log artworksJSON
      chrome.storage.local.set {'artworks':artworksJSON},()=>
        @trigger "didSaveToLocal"
        console.debug "Artworks Did Save"

    fetch: (opt)->
      rawArtworks = []
      callback = opt.callback or ((data)-> return data)

      if opt.from is "local"
        console.log "Will Fetch Local Artworks"
        chrome.storage.local.get 'artworks',(data)=>
          unless data.artworks
            console.log 'No Local Artworks Fetched'
          else
            rawArtworks = JSON.parse (data.artworks or {})
            # for rawArtwork in rawArtworks
              # @add rawArtwork
            console.debug "#{rawArtworks.length} Local Artworks Fetched"
            callback rawArtworks
            @trigger "didFetchFromLocal"
      else 
        console.log "Will Fetch Server Artworks"
        resetProtocol = (artwork)->
          url = artwork.url 
          thumb = artwork.thumb
          artwork.url = url.replace /http\:/,"https:"
          artwork.thumb = thumb.replace /http\:/,"https:"
          return artwork
          
        if opt.from is "konachan"
          parseRawArtwork = (refArtwork)->
            artwork =
              id: refArtwork.id
              url: refArtwork.file_url
              thumb: refArtwork.preview_url
            artwork = resetProtocol artwork
            return artwork
        else if opt.from is "unsplash"
          parseRawArtwork = (refArtwork)->
            artwork =
              id: refArtwork.id
              url: refArtwork.urls.full
              thumb: refArtwork.urls.thumb
            return artwork

        apiCallback = (err,data)=>
          refArtworks = []
          rawArtworks = []
          if data?.length > 0
            refArtworks = data
            for refArtwork in refArtworks
              rawArtwork = parseRawArtwork refArtwork
              rawArtworks.push rawArtwork

            console.debug "#{rawArtworks.length} Server Artworks Fetched"
            callback rawArtworks
            @trigger "didFetchFromServer"
              
        do (parseRawArtwork)=>
          API.fetchArtworks {},apiCallback,{from:opt.from}

  return Artworks