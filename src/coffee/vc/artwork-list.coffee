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
      "contextmenu [data-ui='artwork']": 'onRightClickArtwork'

    onClickArtwork: (e)=>
      console.log 'Artwork Clicked'
      e.stopPropagation()
      @loop()

    onRightClickArtwork: (e)=>
      console.log 'Artwork Clicked'
      e.stopPropagation()
      e.preventDefault()
      @random()

    initialize: (opt)->
      opt ?= {}
      opt.model ?= new List
      opt.collection ?= new Artworks
      super(opt)
      @c.on
        'willChange:isCurrent':(m,v)=>
          if v
            @vc.map (v,i,l)=>
              v.setState 'isCurrent',false

      @on
        'didChangeState:isFetched':(vc,v)=>
          if v
            @setState 'isRendered'
            @resetState 'isFetched'
        'didChangeState:isRendered':(vc,v)=>
          if v
            @render()
            @resetState 'isRendered'
        'didChangeState:current':(vc,v)=>
          @vc[v].setState 'isCurrent'
        'didChangeState:isCurrentFav':(vc,v)=>
          current = @getState 'current'
          if v
            @vc[current].setState 'isFavorite'
          else
            @vc[current].setState 'isFavorite',false
          @c.save()


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
        @random()
      console.debug "#{@c.length} Artworks Rendered"

    loop: ()->
      length = @vc.length
      if length < 2
        return
      current = @getState 'current'
      next = Utl.getNextInt current,length
      @setState 'current',next

    random: ()->
      @setState 'current',(Utl.getRandomInt @vc.length)

  return ArtworkListVC