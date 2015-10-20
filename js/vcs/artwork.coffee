define [
  'lib/underscore'
  'found/vc'
],(_,VC)->
  class Artwork extends VC
    initialize: (option)->
      super(option)
      @render()
      @on {
        "willSetCurrent": @onWillSetCurrent
        "willUnSetCurrent": @onWillUnsetCurrent
      }
      @model.on {
        "change:isCurrent": @onChangeIsCurrent
        "change:src": @onChangeSrc
      }
    onChangeSrc: ()=>
      @ui.$img.attr 'src',(@model.get 'src')

    onChangeIsCurrent: ()=>
      console.log 'Artwork Changed: isCurrent'
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
        @setCurrent()
      else
        @unsetCurrent()

    setCurrent: ()->
      @$el.addClass 'current'
      @model.set 'isCurrent',true
    unsetCurrent: ()->
      @$el.removeClass 'current'
      @model.set 'isCurrent',false
  return Artwork