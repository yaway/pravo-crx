define [
  'mc/list'
],(List)->
  class ArtworkThumbnailList extends List
    defaults:
      from: 'unsplash'

  return ArtworkThumbnailList