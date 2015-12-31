define [
  'found/c'
  'mc/artwork'
  'found/api'
  'found/utl'
],(C,Artwork,API,Utl)->
  class Artworks extends C
    model: Artwork

    save: (opt)->
      opt ?= {}
      console.debug 'Will Save Artworks'

      rawArtworks = Utl.cloneObj @models
      # _.map rawArtworks,(artwork)=>
      #   artwork.isCurrent = false
      #   return artwork
      if opt.only is "fav"
        props =
          isFavorite: true
        rawArtworks = _.where rawArtworks,props
      else if opt.only is "nil"
        rawArtworks = []
      # artworksJSON = JSON.stringify rawArtworks
      data =
        artworks:rawArtworks
      chrome.storage.local.set data,()=>
        console.debug "Did Save Artworks"

    fetch: (opt)->
      opt ?= {}
      rawArtworks = []
      callback = opt.callback or ((data)-> return data)

      if opt.from is "local"
        console.debug "Will Fetch Local Artworks"
        chrome.storage.local.get 'artworks',(data)=>
          raw = data.artworks or []
          console.debug "#{raw.length} Local Artworks Fetched"
          callback raw
      else
        console.debug "Will Fetch Server Artworks"
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
              
        API.fetchArtworks {},apiCallback,{from:opt.from}

  return Artworks