define [
  'lib/underscore'
  'found/c'
  'mcs/artwork'
  'found/api'
],(_,C,Artwork,API)->
  class Artworks extends C
    model: Artwork
    
    save: (opt)->
      console.debug 'Will Save Artworks'
      rawArtworks = @models.map (artwork)->
        artwork = artwork.attributes
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
        console.debug "Artworks Did Save:"
        console.log rawArtworks

    fetch: (opt)->
      console.debug 'Will Fetch Artworks'
      rawArtworks = []
      callback = opt.callback or ((data)-> return data)
      if opt.from is "local"
        console.debug "Will Fetch Local Artworks"
        chrome.storage.local.get 'artworks',(data)=>
          unless data.artworks
            console.log 'No Local Artworks to Fetch'
          else
            rawArtworks = JSON.parse (data.artworks or {})
            # for rawArtwork in rawArtworks
              # @add rawArtwork
            console.debug "Local Artworks Did Fetch:"
            console.log rawArtworks
            callback rawArtworks
            @trigger "didFetchFromLocal"
      else if opt.from is "konachan"
        console.debug "Will Fetch Server Artworks"
        API.getArtworks {},(err,data)=>
          refArtworks = []
          console.debug "Server RefArtworks:"
          console.log data
          if data?.length > 0
            refArtworks = data
            for refArtwork in refArtworks
              rawArtwork = {
                id: refArtwork.id
                url: refArtwork.file_url
              }
              rawArtworks.push rawArtwork
              # @add rawArtwork
              # @at(0).set 'isCurrent',true
            console.debug "Server Artworks Did Fetch:"
            console.log rawArtworks
            callback rawArtworks
            @trigger "didFetchFromServer"


    loop: ()->
      if @length < 2
        return
      current = @getCurrent()
      console.log @models
      next = @getNext()
      current.set 'isCurrent',false
      next.set 'isCurrent',true
    getCurrent: ()->
      current = @findWhere 'isCurrent'
      return current
    getNext: ()->
      current = @getCurrent()
      currentIndex = @indexOf current
      console.error currentIndex
      if currentIndex < @length-1
        next = @at currentIndex+1
      else
        next = @at 0
      return next

  return Artworks