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
      @vc = []

      @on
        'didChangeState:current':(vc,v)=>
          artworkVC = @vc[v]
          artworkVC.setState 'isCurrent'
          if artworkVC.getState 'isFavorite'
            @setState 'isCurrentFavorite'
          else
            @setState 'isCurrentFavorite',false

        'didChangeState:isCurrentFavorite':(vc,v)=>
          current = @getState 'current'
          if v
            @vc[current].setState 'isFavorite'
          else
            @vc[current].setState 'isFavorite',false

        'didChangeState:didFetch':(vc,v)=>
          @render()

      @c.on
        'willChange:isCurrent':(m,v)=>
          if v
            @vc.map (v,i,l)=>
              v.setState 'isCurrent',false
      @fetch()

    fetch: ()->
      @setState 'didFetch',false
      @c.fetch
        from: "local"
        callback: (rawArtworks)=>
          # limit = 5
          # lack = limit - rawArtworks.length
          if rawArtworks.length > 0
            @c.add rawArtworks
          @setState 'didFetch'


    render: ()->
      @setState 'didRender',false
      super()
      if @c.length is 0
        console.log "No Artworks to Render"
        @setState 'didRender'
        return

      @vc = []
      @$el.empty()
      
      @add @c

      current = @getState 'current'
      if not current
        @random()

      console.log "#{@c.length} Artworks Rendered"
      @setState 'didRender'

    add: (mc)->
      console.error mc
      if mc instanceof Artwork
        artworks = new Artworks mc
      else if mc instanceof Artworks
        artworks = mc
      artworks.map (artwork,i,artworks)=>
        unless @c.contains artwork
          @c.add artwork
          artworkVC = new ArtworkVC
            $root: @$el
            position: 'append'
            template: 'artwork'
            model: artwork
          @vc.push artworkVC
        if artwork.get 'isCurrent'
          @setCurrent artwork

    setCurrent: (artwork)->
      index = @c.models.indexOf artwork
      @setState 'current',index

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