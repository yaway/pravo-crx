define [
  'found/c'
  'mc/feed'
  'found/utl'
],(C,Feed,Utl)->
  class Feeds extends C
    model: Feed
    
    initialize: ()->
      console.log "New Feeds"
      @on
        'willChangeIsCurrent': ()=>
          @allSet {isCurrent:false},{silent:true}

        'change:isCurrent': (m,v)=>
          if v
            @save()

    save: (opt)->
      data = JSON.stringify @models
      chrome.storage.local.set {'feeds':data},()=>
        @trigger "didSave"

    fetch: (opt)->
      callback = opt.callback or ((data)-> return data)
      chrome.storage.local.get 'feeds',(data)=>
        if data.feeds
          rawData = JSON.parse data.feeds
        else
          rawData = []
        console.debug "#{rawData.length} Local Feeds Fetched"
        callback rawData
        @trigger "didFetch"

  return Feeds