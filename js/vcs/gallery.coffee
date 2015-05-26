define [
  'lib/underscore'
  'found/vc'
  'vcs/artwork'
],(_,VC,Artwork)->
  class Gallery extends VC
    constructor: (option)->
      super(option)
      @render()
    update: ()->
      console.log "Gallery updated"
      @renderArtwork()
    renderArtwork: ()->
      artwork = new Artwork {root: 'artworkCollection', block: 'ap', template: 'artwork'}
  return Gallery