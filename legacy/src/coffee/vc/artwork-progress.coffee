define [
  'core/vc'
  'mc/artwork-progress'
],(VC,ArtworkProgress)->
  class ArtworkProgressVC extends VC
    initialize: (opt)->
      opt ?= {}
      opt.model ?= new ArtworkProgress

      if (opt.model.get 'indicatorType') is 'linear'
        opt.template = 'mLinearProgress'
      else if (opt.model.get 'indicatorType') is 'circular'
        opt.template = 'mCircularProgress'
      super(opt)

      @on
        'didChangeState:isLoading': (m,v)=>
          if v
            @$el.addClass 'is-loading'
          else
            @$el.removeClass 'is-loading'

      @render()

    render: ()->
      super()
      console.log "Artwork Progress Rendered:#{@getState 'indicatorType'}"

    load: (c)->
      @setState 'isLoading',true
      @setState 'isDone',false

      timeout = ()=>
        console.log 'Artworks Failed to Load:timeout'
        @setState 'isLoading',false

      setTimeout timeout,1000*10

      if @getState 'infinite'
        return

      if (@getState 'artworkType') is 'src'
        srcKey = 'src'
      else if (@getState 'artworkType') is 'thumb'
        srcKey = 'thumb'
      else
        return

      total = @c.length
      @setState 'total',total

      iteratee = (v,i)=>
        artwork = v
        artwork.set 'isLoaded',false
        img = new Image
        img.src = artwork.get srcKey

        onLoadImg = ()=>
          artwork.set 'isLoaded',true
          dones = @c.where
            isLoaded: true

          @setState 'done',dones.length

          if dones.length is total
            clearTimeout timeout
            console.log "#{@getState 'done'} Artworks Loaded"
            @setState 'isDone',true
            @setState 'isLoading',false

        img.onload = onLoadImg

      @c.forEach iteratee

  return ArtworkProgressVC