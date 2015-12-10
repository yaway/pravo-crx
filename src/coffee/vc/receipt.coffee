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
      "click [data-ui='btnUnfoldPanel']": "onClickBtnUnfoldPanel"
      "click [data-ui='btnFoldPanel']": "onClickBtnFoldPanel"
      "click [data-ui='btnToggleFeedList']": "onClickBtnToggleFeedList"

    onClickBtnFoldPanel: (e)=>
      console.log 'BtnFoldPanel Clicked'
      e.stopPropagation()
      @model.set 'isUnfolded',false

    onClickBtnUnfoldPanel: (e)=>
      console.log 'BtnUnfoldPanel Clicked'
      e.stopPropagation()
      @model.set 'isUnfolded',true

    onClickBtnTogglePanel: (e)=>
      console.log 'BtnTogglePanel Clicked'
      e.stopPropagation()
      @model.toggle 'isUnfolded'
    onClickBtnTogglePanel: (e)=>
      console.log 'BtnTogglePanel Clicked'
      e.stopPropagation()
      @model.toggle 'isUnfolded'

    onClickBtnToggleFeedList: (e)=>
      console.log 'BtnToggleFeedList Clicked'
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
            @$el.addClass 'is-unfolded'
            # @ui.$btnNew.text 'Close'
            @model.set 'isFeedListUnfolded',false
          else
            @$el.removeClass 'is-unfolded'
        'change:isFeedListUnfolded': ()=>
          if @model.get 'isFeedListUnfolded'
            @$el.addClass 'is-feed-list-unfolded'
          else
            @$el.removeClass 'is-feed-list-unfolded'
      @initializeFeeds()
      @render()

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

      chosenFeed = @feeds.findWhere({'isChosen':true}).get 'name'
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
      alterFeeds = [{name: "unsplash",isChosen: true},{name: "konachan"}]
      @feeds = new Feeds
      @feeds.fetch
        callback: (rawFeeds)=>
          console.log rawFeeds
          if rawFeeds.length is 0
            @feeds.add alterFeeds
          else
            @feeds.add rawFeeds

      @feeds.on
        'update': ()=>
          @initializeArtworks()
          @renderFeeds()
        'change:isChosen': (artwork)=>
          if artwork.get 'isChosen'
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

    updateBC: ()->
      for className in ['is-dark','is-light','is-complex']
        if @ui.$btnTogglePanel.hasClass className
          @$el.addClass className
  return ReceiptVC