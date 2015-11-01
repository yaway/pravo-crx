define [
  'lib/underscore'
  'found/vc'
],(_,VC)->
  class Artwork extends VC
    initialize: (option)->
      super(option)
      @render()
      @on
        "willSetCurrent": @onWillSetCurrent
        "willUnSetCurrent": @onWillUnsetCurrent
      @model.on
        "change:src": @onChangeSrc
        "change:isCurrent": @onChangeIsCurrent
        "change:isFavorite": @onChangeIsFavorite

    onChangeSrc: ()=>
      @ui.$img.attr 'src',(@model.get 'src')

    onChangeIsCurrent: ()=>
      console.log 'Artwork Changed: isCurrent'
      @updateStateCurrent()

    onChangeIsFavorite: ()=>
      console.log 'Artwork Changed: isFavorite'
      @updateStateCurrent()

    update: ()->
      console.log "ArtworkVC Updated"
      @updateStateCurrent()

    onWillSetCurrent: ()=>
      console.debug "onSetCurrent"
      @setCurrent()
    onWillUnsetCurrent: ()=>
      console.debug "onUnsetCurrent"
      @unsetCurrent()

    updateStateCurrent: ()->
      if (@model.get 'isCurrent')
        @$el.addClass 'current'
        @model.set 'isCurrent',true
      else
        @$el.removeClass 'current'
        @model.set 'isCurrent',false



  return Artwork