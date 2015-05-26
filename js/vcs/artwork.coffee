define [
  'lib/underscore'
  'found/tpl'
  'found/vc'
],(_,TPL,VC)->
  class Artwork extends VC
    constructor: (option)->
      option ?= {}
      @collection = option.collection or {}
      super(option)
      @render()
    update: ()->
      console.log "Artwork updated"
      console.log @$root
      console.log @block
  return Artwork