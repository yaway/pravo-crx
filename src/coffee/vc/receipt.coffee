define [
  'found/vc'
  'mc/artworks'
  'mc/feeds'
  'mc/receipt'
  'mc/scroll'
  'mc/artwork-progress'
  'vc/feed-list'
  'vc/artwork-thumbnail-list'
  'vc/scroll'
  'vc/artwork-progress'
],(
  VC,
  Artworks,
  Feeds,
  Receipt,
  Scroll,
  ArtworkProgress,
  FeedListVC,
  ArtworkThumbnailListVC,
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
      if @getState 'isDrawerUnfolded'
        @$el.addClass 'is-morphing'
      else
        @$el.removeClass 'is-morphing'

    onClickToolbarTitle: (e)=>
      console.log 'Toolbar Title Clicked'
      e.stopPropagation()
      @feedListVC.setState 'isUnfolded'

    initialize: (opt)->
      super(opt)

      @m = new Receipt
      @c = new Artworks

      @on
        'didChangeState:hasArtworks': (vc,v)=>
          if v
            @$el.addClass 'has-artworks'
          else
            @$el.removeClass 'has-artworks'
        'didChangeState:isDrawerUnfolded': (mv,v)=>
          if v
            @scrollVC.refresh()
            @$el.addClass 'is-drawer-unfolded'
          else
            @$el.removeClass 'is-drawer-unfolded'

      @render()

    render: ()->
      super()
      console.log "Receipt Rendered"

      @renderFeedList()
      @renderArtworkList()
      @renderScroll()
      @renderRefreshProgress()
      @renderFetchProgress()

      @listenTo @feedListVC,'didChangeState:current',(vc,v)=>
        @ui.$feedName.text v
        @artworkListVC.setState 'from',v
        @artworkListVC.fetch()

      @listenTo @artworkListVC,'didChangeState:willFetch',(vc,v)=>
        if v
          @refreshProgressVC.setState 'infinite'
          @refreshProgressVC.load()

      @listenTo @artworkListVC,'didChangeState:didFetch',(vc,v)=>
        if v
          @setState 'hasArtworks'
          @refreshProgressVC.setState 'infinite',false
          @refreshProgressVC.load()

      @listenTo @artworkListVC,'didChangeState:willRender',(vc,v)=>
        if v
          @$el.addClass 'is-artwork-list-rendering'
        
      @listenTo @artworkListVC,'didChangeState:didRender',(vc,v)=>
        if v
          timeout = ()=>
            @$el.removeClass 'is-artwork-list-rendering'
          setTimeout timeout,4

          @scrollVC.refresh()
          @fetchProgressVC.setState 'isLoading',false

      @listenTo @refreshProgressVC,'didChangeState:isDone',(vc,v)=>
        if v
          @artworkListVC.render()

      @listenTo @scrollVC,'didChangeState:didScrollToEnd',(vc,v)=>
          if v
            @fetchProgressVC.load()

      # @model.set 'isDrawerUnfolded',true

    renderFeedList: ()->
      @feedListVC = new FeedListVC
        $root: @ui.$feedList

    renderArtworkList: ()->
      if not @c
        console.log "No Artworks to Render"
        return

      @artworkListVC = new ArtworkThumbnailListVC
        $root: @ui.$artworkList
        collection: @c

    renderScroll: ()->
      scroll = new Scroll
        direction: 'v'
      @scrollVC = new ScrollVC
        $root: @ui.$scroll
        $scrollee: @ui.$artworkList
        model: scroll

    renderRefreshProgress: ()->
      progress = new ArtworkProgress
        artworkType: 'thumb'
        indicatorType: 'linear'
      @refreshProgressVC = new ArtworkProgressVC
        $root: @ui.$drawer
        model: progress
        collection: @c
        position: 'prepend'

      @refreshProgressVC.$el.addClass 'top'
      @refreshProgressVC.load()

    renderFetchProgress: ()->
      progress = new ArtworkProgress
        artworkType: 'thumb'
        indicatorType: 'circular'
        infinite: true
      @fetchProgressVC = new ArtworkProgressVC
        $root: @ui.$scroll
        model: progress
        collection: @c
        position: 'append'

      @fetchProgressVC.$el.addClass 'right'

  return ReceiptVC