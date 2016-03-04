define [
  'mc/list'
],(List)->
  class FeedList extends List
    defaults:
      isUnfolded: false
      
  return FeedList