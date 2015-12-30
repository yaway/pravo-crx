define [
  'found/vc'
  'mc/feed-list'
  'mc/feed'
  'mc/feeds'
  'vc/artwork-feed'
  'found/utl'
],(VC,FeedList,Feed,Feeds,ArtworkFeedVC,Utl)->
  class FeedListVC extends VC
    initialize: (opt)->
      opt ?= {}
      opt.model ?= new FeedList
      opt.collection ?= new Feeds
      super(opt)

      @on
        'didChangeState:current':(vc,v)=>
          if v
            @render()
            @setState 'isUnfolded',false
        'didChangeState:isUnfolded':(vc,v)=>
          if v
            @$el.addClass 'is-unfolded'
          else
            @$el.removeClass 'is-unfolded'


      @listenTo @c,'willChange:isCurrent',(m,v)=>
        if v
          @vc.map (v,i,l)=>
            v.setState 'isCurrent',false
      @listenTo @c,'didChange:isCurrent': (m,v)=>
        if v
          current = m.get 'name'
          @setState 'current',current
          @render()

      @fetch()

    fetch: ()->
      @setState 'didFetch',false
      defaults = [{name: "unsplash",isCurrent: true},{name: "konachan"}]
      from = @getState 'from'
      @c.fetch
        from: from
        callback: (rawC)=>
          if rawC.length > 0
            @c.add rawC
          else
            @c.add defaults
          attrs =
            isCurrent: true
          m = @c.find attrs
          current = m.get 'name'
          @setState 'current',current
          @setState 'didFetch'


    render: ()->
      @setState 'didRender',false
      super()
      if @c.length is 0
        console.log "No Feeds to Render"
        return
      @vc = []
      @$el.empty()
      @c.map (v,i,l)=>
        m = v
        vc = new ArtworkFeedVC
          $root: @$el
          position: 'append'
          template: 'artworkFeed'
          model: m
        @vc.push vc
        @setState 'didRender'

  return FeedListVC