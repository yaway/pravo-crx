define [
  'found/vc'
  'mc/booth'
  'mc/artworks'
  'vc/artwork-list'
  'found/utl'
],(VC,Booth,Artworks,ArtworkListVC,Utl)->
  class BoothVC extends VC
    events:
      "click [data-ui='artwork']": 'onClickArtwork'
      "click [data-ui='btnToggleFav']": 'onClickBtnToggleFav'

    onClickBtnToggleFav: (e)=>
      e.stopPropagation()
      console.log 'BtnFav Clicked'
      @artworkListVC.toggleState 'isCurrentFavorite'
      saveOpt =
        only: 'fav'
      @c.save saveOpt

    initialize: (opt)->
      super(opt)
      @m = new Booth
      @c = new Artworks
      @on
        'didChangeState:hasArtworks': (vc,v)=>
          if v
            @$el.addClass 'has-artworks'
          else
            @$el.removeClass 'has-artworks'
        'didChangeState:blur': (vc,v)=>
          if v
            @$el.addClass 'blur'
          else
            @$el.removeClass 'blur'
      @render()

    render: ()->
      super()
      @artworkListVC = new ArtworkListVC
        $root: @ui.$artworkList
        collection: @c

      @listenTo @artworkListVC,'didChangeState:didAdd',(vc,v)=>
        if v
          if vc.c.length > 0
            @setState 'hasArtworks',true
          else
            @setState 'hasArtworks',false

      @listenTo @artworkListVC,'didChangeState:isCurrentFavorite',(vc,v)=>
        if v
          @$el.addClass 'is-favorite'
          @ui.$icoToggleFav.text 'bookmark'
        else
          @$el.removeClass 'is-favorite'
          @ui.$icoToggleFav.text 'bookmark_border'


  return BoothVC