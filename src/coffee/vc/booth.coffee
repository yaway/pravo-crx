define [
  'found/vc'
  'mc/booth'
  'vc/artwork-list'
  'found/utl'
],(VC,Booth,ArtworkListVC,Utl)->
  class BoothVC extends VC
    events:
      "click [data-ui='artwork']": 'onClickArtwork'
      "click [data-ui='btnToggleFav']": 'onClickBtnToggleFav'

    onClickBtnToggleFav: (e)=>
      e.stopPropagation()
      console.log 'BtnFav Clicked'
      @toggleState 'isCurrentFav'

    initialize: (opt)->
      super(opt)
      @m = new Booth
      @on
        'didChangeState:isCurrentFav':(m,v)=>
          if v
            @$el.addClass 'is-favorite'
            @ui.$icoToggleFav.text 'bookmark'
          else
            @$el.removeClass 'is-favorite'
            @ui.$icoToggleFav.text 'bookmark_border'

        'didChangeState:blur':(m,v)=>
          if v
            @$el.addClass 'blur'
          else
            @$el.removeClass 'blur'
      @render()

    render: ()->
      super()
      @artworkListVC = new ArtworkListVC
        $root: @ui.$artworkList
      @setState 'isCurrentFav'
      console.log "Booth Rendered"

  return BoothVC