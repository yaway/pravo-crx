define [
  'lib/underscore'
  'found/c'
  'mcs/Artwork'
],(_,C,Artwork)->
  class Artworks extends C
    model: Artwork
    update: ()->
      console.log "Updated to #{@length} Artworks"
      console.log @models
  return Artworks