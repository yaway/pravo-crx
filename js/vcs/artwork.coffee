define [
  'lib/underscore'
  'found/vc'
],(_,VC)->
  class Artwork extends VC
    initialize: (option)->
      super(option)
      @render()
      @on {
        "setCurrent": @onSetCurrent
        "unsetCurrent": @onUnsetCurrent
      }
      @model.on {
        "change:isCurrent": @onChangeIsCurrent
      }

    onChangeIsCurrent: ()=>
      console.log 'Artwork Changed: isCurrent'
      @updateStateCurrent()

    update: ()->
      console.log "ArtworkVC Updated"
      @updateStateCurrent()

    onSetCurrent: ()=>
      console.debug "onSetCurrent"
      @setCurrent()
    onUnsetCurrent: ()=>
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