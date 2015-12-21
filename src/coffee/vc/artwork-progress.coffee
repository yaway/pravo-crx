define [
  'found/vc'
  'mc/progress'
  'vc/m-circular-progress'
],(VC,Progress,MCircularProgressVC)->
  class ArtworkProgress extends VC
    initialize: (opt)->
      opt ?= {}
      super(opt)

      if not opt.artworks
        console.log "No Artwork to Load"
        return

      @artworks = opt.artworks

      @model ?= new Progress
      @model.on
        'change:isDone': (m,v)=>
          if v
            @$el.addClass 'is-done'
          else
            @$el.removeClass 'is-done'

      @render()

    update: ()->
      console.log 'Artwork Progress Rendered'

    load: ()->
      if (@model.get 'artworkType') is 'src'
        srcKey = 'src'
      else if (@model.get 'artworkType') is 'thumb'
        srcKey = 'thumb'
      else
        return

      total = @artworks.length
      @model.set 'total',total


      iteratee = (artwork,i)=>
        artwork.set 'isLoaded',false
        img = new Image
        img.src = artwork.get srcKey

        onLoadImg = ()=>
          artwork.set 'isLoaded',true
          dones = @artworks.where
            isLoaded: true

          @model.set 'done',dones.length

          if dones.length is total
            console.log 'All Artworks Loaded'
            @model.set 'isDone',true

        img.onload = onLoadImg

      @artworks.forEach iteratee


  return ArtworkProgress