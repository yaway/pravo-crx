define [
  'found/vc'
],(VC)->
  class ArtworkVC extends VC
    initialize: (opt)->
      super(opt)
      @render()
      @model.on
        "change:src": @onChangeSrc
        "change:isCurrent": @onChangeIsCurrent
        "change:isFavorite": @onChangeIsFavorite

    onChangeSrc: ()=>
      @ui.$img.attr 'src',(@model.get 'src')

    onChangeIsCurrent: ()=>
      console.log 'Artwork Changed: isCurrent'
      @updateStateCurrent()

    update: ()->
      @updateStateCurrent()

    updateStateCurrent: ()->
      if (@model.get 'isCurrent')
        @$el.addClass 'current'
        @model.set 'isCurrent',true
      else
        @$el.removeClass 'current'
        @model.set 'isCurrent',false



  return ArtworkVC