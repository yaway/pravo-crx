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
      console.log 'BtnFoldDrawer Clicked'
      e.stopPropagation()
      @model.set 'isDrawerUnfolded',false

    onClickBtnUnfoldDrawer: (e)=>
      console.log 'BtnUnfoldDrawer Clicked'
      e.stopPropagation()
      @model.set 'isDrawerUnfolded',true

    onMorphBtnUnfoldDrawer: (e)=>
      console.log 'BtnUnfoldDrawer Morphed'
      if @$el.hasClass 'is-unfolded'
        @$el.addClass 'is-morphing'
      else
        @$el.removeClass 'is-morphing'

    onClickToolbarTitle: (e)=>
      console.log 'ToolbarTitle Clicked'
      e.stopPropagation()
      @model.toggle 'isFeedListUnfolded'

    initialize: (opt)->
      super(opt)

      @model = new Receipt

      @model.on
        'change:isFeedsUpdated': (m,v)=>
          if v
            @renderFeeds()
            @updateArtworks()
            @model.set 'isFeedListUnfolded',false
            @model.set 'isFeedsUpdated',false

        'change:isRendered': (m,v)=>
          if v
            if @model.get 'isArtworksInitialized'
              @$el.addClass 'has-artworks'
            else@$el.removeClass 'has-artworks'

        'change:isArtworksUpdated': (m,v)=>
          if v
            @artworkProgressVC.load()
            @model.set 'hasArtworks',true
            @model.set 'isArtworksUpdated',false

        'change:isArtworksLoaded': (m,v)=>
          if v
            @renderArtworks()
            @scrollVC.resize()
            @model.set 'isArtworksLoaded',false

        'change:isDrawerUnfolded': (m,v)=>
          if v
            @$el.addClass 'is-unfolded'
            @artworkProgressVC.load()
            @scrollVC.resize()
            @model.set 'isFeedListUnfolded',false
          else
            @$el.removeClass 'is-unfolded'

        'change:isFeedListUnfolded': (m,v)=>
          if v
            @$el.addClass 'is-feed-list-unfolded'
          else
            @$el.removeClass 'is-feed-list-unfolded'

      @initializeFeeds()
      @initializeArtworks()

      @render()

    update: ()->
      console.log "Receipt Rendered"

      @renderScroll()
      @renderArtworkProgress()

      @model.set 'isRendered',true

      # @updateBC()
      # @model.set 'isDrawerUnfolded',true

    initializeFeeds: ()=>
      alterFeeds = [{name: "unsplash",isCurrent: true},{name: "konachan"}]
      @feeds = new Feeds
      # @feeds.on
      #   'update': ()=>
      #     @model.set "isFeedsUpdated",true
        # 'change': ()=>
        #   @model.set "isFeedsUpdated",true

      @feeds.fetch
        callback: (rawFeeds)=>
          if rawFeeds.length is 0
            @feeds.add alterFeeds
          else
            @feeds.add rawFeeds

    renderFeeds: ()->
      @ui.$feedList.empty()
      console.log "Feeds Rendered"

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

    initializeArtworks: ()->
      @artworks = new Artworks
      @artworks.on
        'update': ()=>
          @model.set 'isArtworksUpdated',true
      @model.set 'isArtworksInitialized',true

    updateArtworks: (opt)->
      opt ?= {}
      feed = opt.feed or @feeds.findWhere({isCurrent:true})
      console.error feed
      feedName = feed.get 'name'
      @artworks.fetch
        from: feedName
        callback: (rawArtworks)=>
          @artworks.add rawArtworks

    renderArtworks: ()->
      if not @artworks
        console.log "No Artworks to Render"
        return

      @ui.$artworkList.empty()
      @artworks.each (artwork)=>
        artworkVC = new ArtworkThumbnailVC
          $root: @ui.$artworkList
          position: 'append'
          template: 'artworkThumbnail'
          model: artwork

      console.debug "#{@artworks.length} Receipt Artworks Rendered"

    renderScroll: ()->
      @scroll = new Scroll
        direction: 'v'
      @scrollVC = new ScrollVC
        $root: @ui.$scroll
        $scrollee: @ui.$artworkList
        model: @scroll

    renderArtworkProgress: (opt)->
      console.log 'Artwork Progress Rendered'
      opt ?= {}
      opt.indicatorType ?= 'linear'

      if opt.indicatorType is 'linear'
        template = 'mLinearProgress'
      else if opt.indicatorType is 'circular'
        template = 'mCircularProgress'

      @progress ?= new Progress
        artworkType: 'thumb'
        indicatorType: opt.indicatorType
      @progress.on
        'change:isDone': (m,v)=>
          if v
            console.error v
            @model.set 'isArtworksLoaded',true
            # @progress.set 'isDone',false

      @progress.set 'isDone',false

      @artworkProgressVC ?= new ArtworkProgressVC
        $root: @ui.$drawer
        model: @progress
        artworks: @artworks
        template: template
        position: 'prepend'

      @artworkProgressVC.$el.addClass 'top'
      @artworkProgressVC.load()  

    updateBC: ()->
      for className in ['is-dark','is-light','is-complex']
        if @ui.$btnTogglePanel.hasClass className
          @$el.addClass className

  return ReceiptVC