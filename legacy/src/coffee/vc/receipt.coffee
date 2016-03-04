define [
  'core/vc'
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

    initialize: (opt)->
      @m = new Receipt
      @c = new Artworks
      super(opt)

      @render()

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
      @cpn.feedList.setState 'isUnfolded'

    getComponents: ()->
      components =
        feedList:
          class: FeedListVC
          options:
            rootUI: 'feedList'
        artworkList:
          class: ArtworkThumbnailListVC
          options:
            rootUI: 'artworkList'
            collection: @c
        scroll:
          class: ScrollVC
          options:
            rootUI: 'scroll'
            scrolleeUI: 'artworkList'
            defaults:
              direction: 'v'
        refreshProgress:
          class: ArtworkProgressVC
          options:
            rootUI: 'drawer'
            collection: @c
            position: 'prepend'
            defaults:
              artworkType: 'thumb'
              indicatorType: 'linear'
        fetchProgress:
          class: ArtworkProgressVC
          options:
            rootUI: 'scroll'
            collection: @c
            position: 'append'
            defaults:
              artworkType: 'thumb'
              indicatorType: 'circular'
              infinite: true
      return components

    getActions: ()->
      actions =
        'didChangeState:hasArtworks': (vc,v)=>
          if v
            @$el.addClass 'has-artworks'
          else
            @$el.removeClass 'has-artworks'
        'didChangeState:isDrawerUnfolded': (mv,v)=>
          if v
            @cpn.scroll.refresh()
            @$el.addClass 'is-drawer-unfolded'
          else
            @$el.removeClass 'is-drawer-unfolded'
        'feedList didChangeState:current': (vc,v)=>
          @ui.$feedName.text v
          @cpn.artworkList.setState 'from',v
          @cpn.artworkList.fetch()
        'artworkList didChangeState:willFetch': (vc,v)=>
          if v
            @cpn.refreshProgress.setState 'infinite'
            @cpn.refreshProgress.load()
        'artworkList didChangeState:didFetch': (vc,v)=>
          if v
            @setState 'hasArtworks'
            @cpn.refreshProgress.setState 'infinite',false
            @cpn.refreshProgress.load()
        'artworkList didChangeState:willRender': (vc,v)=>
          if v
            @$el.addClass 'is-artwork-list-rendering'
        'artworkList didChangeState:didRender': (vc,v)=>
          if v
            timeout = ()=>
              @$el.removeClass 'is-artwork-list-rendering'
            setTimeout timeout,4
        'refreshProgress didChangeState:isDone': (vc,v)=>
            if v
              @cpn.artworkList.render()
        'scroll didChangeState:didScrollToEnd': (vc,v)=>
            if v
              @cpn.fetchProgress.load()
      return actions

    render: ()->
      super()
      @cpn.refreshProgress.$el.addClass 'top'
      @cpn.refreshProgress.load()


  return ReceiptVC