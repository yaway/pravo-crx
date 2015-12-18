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
      @model.set 'isUnfolded',false

    onClickBtnUnfoldDrawer: (e)=>
      console.log 'BtnUnfoldDrawer Clicked'
      e.stopPropagation()
      @model.set 'isUnfolded',true

    onMorphBtnUnfoldDrawer: (e)=>
      console.log 'BtnUnfoldDrawer Morphed'
      if @$el.hasClass 'is-unfolded'
        return
      @$el.addClass 'is-morphed'

    onClickToolbarTitle: (e)=>
      console.log 'ToolbarTitle Clicked'
      e.stopPropagation()
      @model.toggle 'isFeedListUnfolded'

    initialize: (opt)->
      super(opt)

      @model = new Receipt
      @model.on
        'change:hasArtworks': (m,v)=>
          if v
            @$el.addClass 'has-artworks'
          else
            @$el.removeClass 'has-artworks'

        'change:isUnfolded': (m,v)=>
          if v
            @unfoldDrawer()
            @scrollVC.setSize()
            @model.set 'isFeedListUnfolded',false
          else
            @foldDrawer()

        'change:isFeedListUnfolded': (m,v)=>
          if v
            @$el.addClass 'is-feed-list-unfolded'
          else
            @$el.removeClass 'is-feed-list-unfolded'

        'change:isFeedsUpdated': (m,v)=>
          if v
            @renderFeeds()
            @initializeArtworks()
            @model.set 'isFeedListUnfolded',false
            @model.set 'isFeedsUpdated',false

        'change:isArtworksUpdated': (m,v)=>
          if v
            @model.set 'hasArtworks',true
            @renderArtworkProgress()
            @model.set 'isArtworksUpdated',false

        'change:isArtworksLoaded': (m,v)=>
          if v
            @renderArtworks()
            @scrollVC.setSize()
            @model.set 'isArtworksLoaded',false

      @initializeFeeds()

      @render()

    unfoldDrawer: ()->
      @$el.addClass 'is-unfolded'
      @$el.removeClass 'is-morphed'
    foldDrawer: ()->
      @$el.removeClass 'is-unfolded'

    update: ()->
      console.log "Receipt Rendered"

      @renderScroll()

      # @updateBC()
      # @model.set 'isUnfolded',true

    initializeFeeds: ()=>
      alterFeeds = [{name: "unsplash",isCurrent: true},{name: "konachan"}]
      @feeds = new Feeds
      @feeds.on
        'didChangeIsCurrent': (v)=>
          @model.set "isFeedsUpdated",true

      @feeds.fetch
        callback: (rawFeeds)=>
          if rawFeeds.length is 0
            @feeds.reset alterFeeds
          else
            @feeds.reset rawFeeds
          @model.set "isFeedsUpdated",true

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

    initializeArtworks: (opt)->
      opt ?= {}
      feed = opt.feed or @feeds.findWhere({'isCurrent':true})
      feedName = feed.get 'name'

      @artworks = new Artworks
      @artworks.on
        'update': ()=>
          @model.set 'isArtworksUpdated',true

      @artworks.fetch
        from: feedName
        callback: (rawArtworks)=>
          @artworks.add rawArtworks

    renderArtworks: ()->
      if not @artworks
        console.log "No Artworks to Render"
        return

      console.log "#{@artworks.length} Receipt Artworks Rendered"

      @ui.$artworkList.empty()
      @artworks.each (artwork)=>
        artworkVC = new ArtworkThumbnailVC
          $root: @ui.$artworkList
          position: 'append'
          template: 'artworkThumbnail'
          model: artwork

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

      @progress = new Progress
        artworkType: 'thumb'
        indicatorType: opt.indicatorType

      @progress.on
        'change:isDone': (m,v)=>
          if v
            @model.set 'isArtworksLoaded',true
            @progress.set 'isDone',false
      @artworkProgressVC = new ArtworkProgressVC
        $root: @ui.$drawer
        model: @progress
        artworks: @artworks
        template: template
        position: 'prepend'
      @artworkProgressVC.$el.addClass 'top'
    updateBC: ()->
      for className in ['is-dark','is-light','is-complex']
        if @ui.$btnTogglePanel.hasClass className
          @$el.addClass className
  return ReceiptVC