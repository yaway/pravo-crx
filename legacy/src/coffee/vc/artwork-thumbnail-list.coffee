define [
  'core/vc'
  'mc/artwork-thumbnail-list'
  'mc/artwork'
  'mc/artworks'
  'vc/artwork-thumbnail'
  'core/utl'
],(VC,ArtworkThumbnailList,Artwork,Artworks,ArtworkThumbnailVC,Utl)->
  class ArtworkThumbnailListVC extends VC
    events:
      "click [data-ui='artwork']": 'onClickArtwork'

    onClickArtwork: (e)=>
      console.log 'Artwork Clicked'
      e.stopPropagation()

    initialize: (opt)->
      opt ?= {}
      opt.model ?= new ArtworkThumbnailList
      # opt.collection ?= new Artworks
      super(opt)
      @fetch()

    fetch: (c)->
      @setState 'willFetch'
      @setState 'didFetch',false

      if c
        @c = c

      callback = (rawC)=>
        if rawC.length > 0
          if @getState 'from'
            @c.reset rawC
          else
            @c.add rawC
          @setState 'willFetch',false
          @setState 'didFetch'

      callbacks = (@getState 'callbacks') or []
      callbacks.push callback
      @setState 'callbacks',callbacks

      @c.fetch
        from: @getState 'from'
        callback: (rawC)=>
          cbs = @getState 'callbacks'
          lastCb = (cbs.slice -1)[0]
          if callback is lastCb
            callback(rawC)

    checkContained: (c)->
      c.map (artwork,i)=>
        artworkId = artwork.get 'id'
        filter =
          id: artworkId
        isContained = (@c.where filter).length > 0
        if isContained
          console.error c

    render: ()->
      super()
      @setState 'didRender',false
      @setState 'willRender'
      if @c.length is 0
        console.log "No Artworks to Render"
        @setState 'willRender',false
        @setState 'didRender'
        return

      @$el.empty()
      @vc = []

      @c.map (v,i,l)=>
        m = v
        artworkVC = new ArtworkThumbnailVC
          $root: @$el
          position: 'append'
          template: 'artworkThumbnail'
          model: m
        @vc.push artworkVC
        
      console.log "#{@c.length} Artwork Thumbnails Rendered"

      @setState 'willRender',false
      @setState 'didRender'

  return ArtworkThumbnailListVC