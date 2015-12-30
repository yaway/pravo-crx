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
            @scrollVC.reset()
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
      @renderArtworkProgress()

      @listenTo @feedListVC,'didChangeState:current',(vc,v)=>
        @ui.$feedName.text v
        @artworkListVC.setState 'from',v
        @artworkListVC.fetch()

      @listenTo @artworkListVC,'didChangeState:willFetch',(vc,v)=>
        if v
          @artworkProgressVC.setState 'infinite'
          @artworkProgressVC.load()

      @listenTo @artworkListVC,'didChangeState:didFetch',(vc,v)=>
        if v
          @setState 'hasArtworks'
          @artworkProgressVC.setState 'infinite',false
          @artworkProgressVC.load()

      @listenTo @artworkListVC,'didChangeState:willRender',(vc,v)=>
        if v
          @$el.addClass 'is-artwork-list-rendering'
        
      @listenTo @artworkListVC,'didChangeState:didRender',(vc,v)=>
        if v
          timeout = ()=>
            @$el.removeClass 'is-artwork-list-rendering'
          setTimeout timeout,200

          @scrollVC.reset()

      @listenTo @artworkProgressVC,'didChangeState:isDone',(vc,v)=>
        if v
          @artworkListVC.render()

      @listenTo @scrollVC,'didChangeState:isScrolledToEnd',(vc,v)=>
        console.log v
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

    renderScroll: (scroll)->
      scroll ?= new Scroll
        direction: 'v'
      @scrollVC = new ScrollVC
        $root: @ui.$scroll
        $scrollee: @ui.$artworkList
        model: scroll

    renderArtworkProgress: (progress)->
      progress ?= new ArtworkProgress
      @artworkProgressVC ?= new ArtworkProgressVC
        $root: @ui.$drawer
        model: progress
        collection: @c
        position: 'prepend'

      @artworkProgressVC.$el.addClass 'top'
      @artworkProgressVC.load()

  return ReceiptVC