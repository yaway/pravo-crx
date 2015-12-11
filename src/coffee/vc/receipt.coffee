define [
  'found/vc'
  'mc/artwork'
  'mc/artworks'
  'mc/feed'
  'mc/feeds'
  'mc/receipt'
  'vc/artwork-thumbnail'
  'vc/artwork-feed'
  'vc/scroll'
],(VC,Artwork,Artworks,Feed,Feeds,Receipt,ArtworkThumbnailVC,ArtworkFeedVC,ScrollVC)->
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
        'change:hasArtworks': ()=>
          if @model.get 'hasArtworks'
            @$el.addClass 'has-artworks'
          else
            @$el.removeClass 'has-artworks'
        'change:isUnfolded': ()=>
          if @model.get 'isUnfolded'
            @unfoldDrawer()
            @model.set 'isFeedListUnfolded',false
          else
            @foldDrawer()
        'change:isFeedListUnfolded': ()=>
          if @model.get 'isFeedListUnfolded'
            @$el.addClass 'is-feed-list-unfolded'
          else
            @$el.removeClass 'is-feed-list-unfolded'
      @initializeFeeds()
      @render()

    unfoldDrawer: ()->
      @$el.addClass 'is-unfolded'
      @$el.removeClass 'is-morphed'
      @trigger 'didUnfoldDrawer'
    foldDrawer: ()->
      @$el.removeClass 'is-unfolded'
      @trigger 'didFoldDrawer'

    update: ()->
      console.log "Receipt Rendered"
      
      @scrollVC = new ScrollVC
        $root: @ui.$scroll
        direction: 'v'
        $target: @ui.$artworkList
        
      @renderFeeds()
      
      # @updateBC()
      # @model.set 'isUnfolded',true

    initializeArtworks: ()->
      chosenFeed = @feeds.findWhere({'isCurrent':true}).get 'name'
      console.log chosenFeed

      @artworks = new Artworks

      @artworks.on
        'didFetchFromServer': ()=>
          # @ui.$countNew.text " (#{@artworks.length})" 
        'update': ()=>
          @renderArtworks()
          @trigger 'didUpdate'
        'change:isChosen': (artwork)=>
          if artwork.get 'isChosen'
            @trigger 'didChooseArtwork',artwork

      @artworks.fetch
        from: chosenFeed
        callback: (rawArtworks)=>
          @artworks.add rawArtworks
          console.debug @artworks.pluck 'id'

    renderArtworks: ()->
      @ui.$artworkList.empty()

      if not @artworks
        console.log "No Artworks to Render"
        return

      console.log "#{@artworks.length} Receipt Artworks Rendered"

      @model.set 'hasArtworks',true

      @artworks.each (artwork)=>
        artworkVC = new ArtworkThumbnailVC
          $root: @ui.$artworkList
          position: 'append'
          template: 'artworkThumbnail'
          model: artwork


    initializeFeeds: ()=>
      alterFeeds = [{name: "unsplash",isCurrent: true},{name: "konachan"}]
      @feeds = new Feeds
      @feeds.fetch
        callback: (rawFeeds)=>
          console.log rawFeeds
          if rawFeeds.length is 0
            @feeds.add alterFeeds
          else
            @feeds.add alterFeeds

      @feeds.on
        'update': ()=>
          @initializeArtworks()
          @renderFeeds()
        'change:isCurrent': (feed)=>
          if feed.get 'isCurrent'
            @ui.$feedName.text (feed.get 'name')
            @initializeArtworks()
        'didFetch': ()=>
          @renderFeeds()

    renderFeeds: ()->
      @ui.$feedList.empty()
      console.debug "New Feeds:"
      console.log @feeds.models
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

    updateBC: ()->
      for className in ['is-dark','is-light','is-complex']
        if @ui.$btnTogglePanel.hasClass className
          @$el.addClass className
  return ReceiptVC