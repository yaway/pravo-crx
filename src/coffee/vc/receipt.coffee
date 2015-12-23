define [
  'found/vc'
  'mc/artwork'
  'mc/artworks'
  'mc/feed'
  'mc/feeds'
  'mc/receipt'
  'mc/scroll'
  'mc/progress'
  'vc/artwork-thumbnail'
  'vc/artwork-feed'
  'vc/scroll'
  'vc/artwork-progress'
],(
  VC,
  Artwork,
  Artworks,
  Feed,
  Feeds,
  Receipt,
  Scroll,
  Progress,
  ArtworkThumbnailVC,
  ArtworkFeedVC,
  ScrollVC,
  ArtworkProgressVC
)->
  class ReceiptVC extends VC

    events:
      "click [data-ui='btnUnfoldDrawer']": "onClickBtnUnfoldDrawer"
      "click [data-ui='btnFoldDrawer']": "onClickBtnFoldDrawer"
      "transitionend [data-ui='btnUnfoldDrawer']": "onMorphBtnUnfoldDrawer"

      "click [data-ui='toobarTitle']": "onClickToolbarTitle"

    onClickBtnFoldDrawer: (e)=>
      e.stopPropagation()
      @setState 'isDrawerUnfolded',false

    onClickBtnUnfoldDrawer: (e)=>
      e.stopPropagation()
      @setState 'isDrawerUnfolded'

    onMorphBtnUnfoldDrawer: (e)=>
      if @$el.hasClass 'is-drawer-unfolded'
        @$el.addClass 'is-morphing'
      else
        @$el.removeClass 'is-morphing'

    onClickToolbarTitle: (e)=>
      console.log 'Toolbar Title Clicked'
      e.stopPropagation()
      @toggleState 'isFeedListUnfolded'

    initialize: (opt)->
      super(opt)

      @model = new Receipt

      @on
        'didChangeState:isDrawerUnfolded': (m,v)=>
          if v
            @scrollVC.resize()
            @$el.addClass 'is-drawer-unfolded'
          else
            @$el.removeClass 'is-drawer-unfolded'

        'didChangeState:isFeedListUnfolded': (m,v)=>
          if v
            console.debug 'Receipt: isFeedListUnfolded'
            @$el.addClass 'is-feed-list-unfolded'
          else
            @$el.removeClass 'is-feed-list-unfolded'

        'didChangeState:isFeedsUpdating': (m,v)=>
          if v
            console.debug 'Receipt: isFeedsUpdating'
            @updateFeeds()
            @resetState 'isFeedsUpdating'

        'didChangeState:isFeedsUpdated': (m,v)=>
          if v
            console.debug 'Receipt: isFeedsUpdated'
            @setState 'isArtworksUpdating'
            @setState 'isFeedsRendered'
            @resetState 'isFeedsUpdated'

        'didChangeState:isFeedsRendered': (m,v)=>
          if v
            console.debug 'Receipt: isFeedsRendered'

            @renderFeeds()
            @resetState 'isFeedsRendered'

        'didChangeState:isArtworksUpdating': (m,v)=>
          if v
            console.debug 'Receipt: isArtworksUpdating'

            @setState 'isFeedListUnfolded',false

            @updateArtworks {reset:true}

            @artworkProgressVC.load {infinite:true}

            @$el.addClass 'has-artworks'
            @resetState 'isArtworksUpdating'

        'didChangeState:isArtworksUpdated': (m,v)=>
          if v
            console.debug 'Receipt: isArtworksUpdated'
            @artworkProgressVC.load()
            @resetState 'isArtworksUpdated'

        'didChangeState:isArtworksLoading': (m,v)=>
          if v
            console.debug 'Receipt: isArtworksLoading'
            @artworkProgressVC.load()
            @resetState 'isArtworksLoading'

        'didChangeState:isArtworksLoaded': (m,v)=>
          if v
            console.debug 'Receipt: isArtworksLoaded'
            @setState 'isArtworksRendered'
            @resetState 'isArtworksLoaded'

        'didChangeState:isArtworksRendered': (m,v)=>
          if v
            console.debug 'Receipt: isArtworksRendered'
            @renderArtworks()
            @scrollVC.resize()
            @resetState 'isArtworksRendered'


      @initializeFeeds()
      @initializeArtworks()

      @render()

    render: ()->
      super()
      console.log "Receipt Rendered"

      @renderScroll()
      @renderArtworkProgress()
      # @updateBC()
      # @model.set 'isDrawerUnfolded',true

    initializeFeeds: ()->
      @feeds = new Feeds
      @feeds.on
        'update': ()=>
          @setState "isFeedsUpdated"
        'change:isCurrent': (m,v)=>
          if v
            @setState "isFeedsUpdated"
        'willChange:isCurrent': (m,v)=>
          console.error v
          if v
            @feeds.map (v,i,l)=>
              feed = v
              feed.set 'isCurrent',false

      @setState 'isFeedsUpdating'

    updateFeeds: ()->
      alterFeeds = [{name: "unsplash",isCurrent: true},{name: "konachan"}]
      @feeds.fetch
        callback: (rawFeeds)=>
          if rawFeeds.length is 0
            @feeds.add alterFeeds
          else
            @feeds.add rawFeeds

    renderFeeds: ()->
      @ui.$feedList.empty()

      console.error @feeds.length
      @feeds.each (feed)=>
        feedVC = new ArtworkFeedVC
          $root: @ui.$feedList
          position: 'append'
          template: 'artworkFeed'
          model: feed

      currentFeed = @feeds.findWhere
        isCurrent: true

      if currentFeed
        @ui.$feedName.text (currentFeed.get 'name')
      console.log "Feeds Rendered"

    initializeArtworks: ()->
      @artworks = new Artworks
      @artworks.on
        'update': ()=>
          @setState 'isArtworksUpdated'
        'reset': (m,v,opt)=>
          @setState 'isArtworksUpdated'

    updateArtworks: (opt)->
      opt ?= {}
      feed = opt.feed or @feeds.findWhere({isCurrent:true})
      feedName = feed.get 'name'
      @artworks.fetch
        from: feedName
        callback: (rawArtworks)=>
          if rawArtworks.length > 0
            if opt.reset
              @artworks.reset rawArtworks
            else
              @artworks.add rawArtworks

    renderArtworks: ()->
      if not @artworks
        console.log "No Artworks to Render"
        return

      @$el.addClass 'is-artworks-rendering'

      @ui.$artworkList.empty()

      @artworks.each (artwork)=>
        artworkVC = new ArtworkThumbnailVC
          $root: @ui.$artworkList
          position: 'append'
          template: 'artworkThumbnail'
          model: artwork

      console.debug "#{@artworks.length} Receipt Artworks Rendered"

      timeout = ()=>
        @$el.removeClass 'is-artworks-rendering'
      setTimeout timeout,100

      @model.set 'isArtworksRendered',true

    renderScroll: ()->
      @scroll = new Scroll
        direction: 'v'
      @scrollVC = new ScrollVC
        $root: @ui.$scroll
        $scrollee: @ui.$artworkList
        model: @scroll

    renderArtworkProgress: (opt)->
      opt ?= {}
      opt.indicatorType ?= 'linear'

      if opt.indicatorType is 'linear'
        template = 'mLinearProgress'
      else if opt.indicatorType is 'circular'
        template = 'mCircularProgress'

      @progress ?= new Progress
        artworkType: 'thumb'
        indicatorType: opt.indicatorType


      @artworkProgressVC ?= new ArtworkProgressVC
        $root: @ui.$drawer
        model: @progress
        artworks: @artworks
        template: template
        position: 'prepend'

      @artworkProgressVC.on
        'didChangeState:isDone': (m,v)=>
          if v
            @setState 'isArtworksLoaded',true

      @artworkProgressVC.setState 'isDone',false

      @artworkProgressVC.$el.addClass 'top'
      @artworkProgressVC.load()  

    updateBC: ()->
      for className in ['is-dark','is-light','is-complex']
        if @ui.$btnTogglePanel.hasClass className
          @$el.addClass className

  return ReceiptVC