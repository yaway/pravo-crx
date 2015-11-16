define [
  'found/vc'
  'mc/artwork'
  'mc/artworks'
  'mc/feed'
  'mc/feeds'
  'mc/receipt'
  'vc/artwork-thumbnail'
  'vc/artwork-feed'
],(VC,Artwork,Artworks,Feed,Feeds,Receipt,ArtworkThumbnailVC,ArtworkFeedVC)->
  class ReceiptVC extends VC
    events:
      "click [data-ui='btnNew']": 'onClickBtnNew'
      "click [data-ui='btnMenu']": 'onClickBtnMenu'

    onClickBtnNew: (e)=>
      console.error 'BtnNew Clicked'
      e.stopPropagation()
      @model.toggle 'isUnfolded'

    onClickBtnMenu: (e)=>
      console.error 'BtnMenu Clicked'
      e.stopPropagation()
      @model.toggle 'isFeedListUnfolded'

    initialize: (opt)->
      super(opt)
      @model = new Receipt
      @model.on
        'change:hasArtworks': @onChangeHasArtworks
        'change:isUnfolded': @onChangeIsUnfolded
        'change:isFeedListUnfolded': @onChangeIsFeedListUnfolded

      @initializeFeeds()

      @render()

    update: ()->
      console.log "Receipt Rendered"
      @renderFeeds()

    onChangeHasArtworks: ()=>
      if @model.get 'hasArtworks'
        @$el.addClass 'with-artworks'
      else
        @$el.removeClass 'with-artworks'

    onChangeIsUnfolded: ()=>
      if @model.get 'isUnfolded'
        @$el.addClass 'unfolded'
        @ui.$btnNew.text 'Close'
        @model.set 'isFeedListUnfolded',false
      else
        @$el.removeClass 'unfolded'
        @ui.$btnNew.text 'New'

    onChangeIsFeedListUnfolded: ()=>
      if @model.get 'isFeedListUnfolded'
        @$el.addClass 'feed-list-unfolded'
      else
        @$el.removeClass 'feed-list-unfolded'


    initializeArtworks: ()->

      chosenFeed = @feeds.findWhere({'isChosen':true}).get 'name'
      console.error chosenFeed

      @artworks = new Artworks

      @artworks.on
        'didFetchFromServer': ()=>
          @ui.$countNew.text " (#{@artworks.length})"
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
      @ui.$artworks.empty()

      if not @artworks
        console.log "No Artworks to Render"
        return

      console.error "#{@artworks.length} Artworks Rendered"

      @model.set 'hasArtworks',true

      @artworks.each (artwork)=>
        artworkVC = new ArtworkThumbnailVC
          $root: @ui.$artworks
          position: 'append'
          template: 'artworkThumbnail'
          model: artwork

      @model.set 'isFeedListUnfolded',false

    initializeFeeds: ()=>
      alterFeeds = [{name: "unsplash",isChosen: true},{name: "konachan"}]
      @feeds = new Feeds
      @feeds.fetch
        callback: (rawFeeds)=>
          console.error rawFeeds
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
      @ui.$feeds.empty()
      console.debug "New Feeds:"
      console.log @feeds.models
      @feeds.each (feed)=>
        feedVC = new ArtworkFeedVC
          $root: @ui.$feeds
          position: 'append'
          template: 'artworkFeed'
          model: feed

  return ReceiptVC