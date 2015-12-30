define [
  'found/vc'
  'mc/artwork-thumbnail-list'
  'mc/artwork'
  'mc/artworks'
  'vc/artwork-thumbnail'
  'found/utl'
],(VC,ArtworkThumbnailList,Artwork,Artworks,ArtworkThumbnailVC,Utl)->
  class ArtworkThumbnailListVC extends VC
    events:
      "click [data-ui='artwork']": 'onClickArtwork'

    onClickArtwork: (e)=>
      console.log 'Artwork Clicked'
      e.stopPropagation()
      @loop()

    initialize: (opt)->
      opt ?= {}
      opt.model ?= new ArtworkThumbnailList
      opt.collection ?= new Artworks
      super(opt)
      @c.on
        'willChange:isCurrent':(m,v)=>
          if v
            @vc.map (v,i,l)=>
              artworkVC = v
              artworkVC.setState 'isCurrent',false
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

    render: ()->
      @setState 'didRender',false
      @setState 'willRender'
      super()
      if @c.length is 0
        console.log "No Artworks to Render"
        return
      @vc = []
      @$el.empty()

      @c.map (v,i,l)=>
        m = v
        artworkVC = new ArtworkThumbnailVC
          $root: @$el
          position: 'append'
          template: 'artworkThumbnail'
          model: m
        if m.get 'isCurrent'
          @setState 'current',i
        @vc.push artworkVC

      current = @getState 'current'
      if not current
        @setState 'current',(Utl.getRandomInt @vc.length)
        current = @getState 'current'
        @vc[current].setState 'isCurrent'
      console.debug "#{@c.length} Artwork Thumbnails Rendered"

      @setState 'willRender',false
      @setState 'didRender'

  return ArtworkThumbnailListVC