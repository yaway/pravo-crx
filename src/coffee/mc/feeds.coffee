define [
  'found/c'
  'mc/feed'
  'found/utl'
],(C,Feed,Utl)->
  class Feeds extends C
    model: Feed
    
    initialize: ()->
      super()
      @on
        'change:isCurrent': (m,v)=>
          if v
            @save()

    save: (opt)->
      opt ?= {}
      raw = Utl.cloneObj @models
      if opt.only is 'nil'
        rawFeeds = []
      data =
        feeds: raw
      chrome.storage.local.set data,()=>
        console.debug "Did Save Feeds"

    fetch: (opt)->
      callback = opt.callback or ((data)-> return data)
      chrome.storage.local.get 'feeds',(data)=>
        raw = data.feeds or []
        console.debug "#{raw.length} Local Feeds Fetched"
        callback raw

  return Feeds