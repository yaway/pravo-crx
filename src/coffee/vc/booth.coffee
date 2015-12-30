define [
  'found/vc'
  'mc/booth'
  'vc/artwork-list'
  'found/utl'
],(VC,Booth,ArtworkListVC,Utl)->
  class BoothVC extends VC
    events:
      "click [data-ui='artwork']": 'onClickArtwork'

    onClickBtnToggleFav: (e)=>
      e.stopPropagation()
      console.log 'BtnFav Clicked'
      console.log currentArtwork

    initialize: (opt)->
      super(opt)
      @model = new Booth
      # @on
        # 'didChangeState:isArtworksUpdating':(m,v)=>
        #   if v
        #     @updateArtworks()
        #     @resetState 'isArtworksUpdating'

        # 'didChangeState:isArtworksUpdated':(m,v)=>
        #   if v
        #     @setState 'isArtworksRendered'
        #     @resetState 'isArtworksUpdated'

        # 'didChangeState:isArtworksRendered':(m,v)=>
        #   if v
        #     @renderArtworks()
        #     @resetState 'isArtworksRendered'

        # 'didChangeState:isCurrentArtworkFavorite':(m,v)=>
        #   if v
        #     @$el.addClass 'is-favorite'
        #     @ui.$icoToggleFav.text 'bookmark'
        #   else
        #     @$el.removeClass 'is-favorite'
        #     @ui.$icoToggleFav.text 'bookmark_border'

        # 'didChangeState:blur':(m,v)=>
        #   if v
        #     @$el.addClass 'blur'
        #   else
        #     @$el.removeClass 'blur'
      @render()

    render: ()->
      super()
      @artworkListVC = new ArtworkListVC
        $root: @ui.$artworkList
      console.log "Booth Rendered"

  return BoothVC