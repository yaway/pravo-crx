define [
  'mc/progress'
],(Progress)->
  class ArtworkProgress extends Progress
    defaults:
      artworkType: 'src'
      indicatorType: 'linear'
  return ArtworkProgress