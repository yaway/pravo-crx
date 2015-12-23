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
        'change:isCurrent': (m,v)=>
          # if v
            # @save()

    save: (opt)->
      opt ?= {}
      data = JSON.stringify @models
      if opt.only is 'nil'
        data = JSON.stringify []
      chrome.storage.local.set {'feeds':data},()=>

    fetch: (opt)->
      callback = opt.callback or ((data)-> return data)
      chrome.storage.local.get 'feeds',(data)=>
        if data.feeds and data.feeds.length > 0
          rawData = JSON.parse data.feeds
        else
          rawData = []
        console.debug "#{rawData.length} Local Feeds Fetched"
        callback rawData
        @trigger "didFetch"

  return Feeds