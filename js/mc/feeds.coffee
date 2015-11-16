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
        'willChangeIsChosen': ()=>
          @allSet 'isChosen',false
        'change': (feed)=>
          if feed.get 'isChosen'
            @save()

    save: (opt)->
      data = JSON.stringify @models
      chrome.storage.local.set {'feeds':data},()=>
        @trigger "didSave"

    fetch: (opt)->
      callback = opt.callback or ((data)-> return data)
      chrome.storage.local.get 'feeds',(data)=>
        if data.feeds
          console.error data.feeds
          rawData = JSON.parse data.feeds
        else
          rawData = []
        console.debug "Local Artworks Did Fetch:"
        console.log rawData
        callback rawData
        @trigger "didFetch"

  return Feeds