define [
  'found/vc'
  'mc/list'
  'mc/artwork'
  'mc/artworks'
  'vc/artwork'
  'found/utl'
],(VC,List,Artwork,Artworks,ArtworkVC,Utl)->
  class ArtworkListVC extends VC
    events:
      "click [data-ui='artwork']": 'onClickArtwork'

    onClickArtwork: (e)=>
      console.log 'Artwork Clicked'
      e.stopPropagation()
      @loop()

    initialize: (opt)->
      opt ?= {}
      super(opt)
      @m = new List
      @c = opt.artworks or new Artworks
      @c.on
        'willChange:isCurrent':(m,v)=>
          if v
            @vc.map (v,i,l)=>
              artworkVC = v
              artworkVC.setState 'isCurrent',false

      @on
        'didChangeState:isFetched':(m,v)=>
          if v
            @setState 'isRendered'
            @resetState 'isFetched'
        'didChangeState:isRendered':(m,v)=>
          if v
            @render()
            @resetState 'isRendered'

      @fetch()

    fetch: ()->
      @c.fetch
        from: "local"
        callback: (rawArtworks)=>
          # limit = 5
          # lack = limit - rawArtworks.length
          if rawArtworks.length > 0
            @c.add rawArtworks
            @setState 'isFetched'

    render: ()->
      super()
      if @c.length is 0
        console.log "No Artworks to Render"
        return
      @vc = []
      @$el.empty()

      @c.map (v,i,l)=>
        artwork = v
        artworkVC = new ArtworkVC
          $root: @$el
          position: 'append'
          template: 'artwork'
          model: artwork
        if artwork.get 'isCurrent'
          @setState 'current',i
        @vc.push artworkVC

      current = @getState 'current'
      if not current
        @setState 'current',(Utl.getRandomInt @vc.length)
        current = @getState 'current'
        @vc[current].setState 'isCurrent'
      console.debug "#{@c.length} Artworks Rendered"

    loop: ()->
      length = @vc.length
      if length < 2
        return
      current = @getState 'current'
      next = Utl.getNextInt current,length
      @vc[next].setState 'isCurrent'
      @setState 'current',next

  return ArtworkListVC