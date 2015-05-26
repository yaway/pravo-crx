define [],()->
  Util = {}
  Util.resolveUrl = ()->
    console.log arguments
    numUrls = arguments.length

    if numUrls is 0
      return false

    base = document.createElement 'base'
    base.href = arguments[0]

    if numUrls is 1
      return base.href

    head = (document.getElementsByTagName 'head')[0]
    head.insertBefore base, head.firstChild

    a = document.createElement 'a'

    for arg in arguments
      a.href = arg
      resolved = a.href
      base.href = resolved

    head.removeChild base

    return resolved

  return Util