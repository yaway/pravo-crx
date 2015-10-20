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

  Util.getDataUrl = (src, callback)->
    img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = ()->
      canvas = document.createElement 'canvas'
      ctx = canvas.getContext '2d'
      canvas.width = @naturalWidth
      canvas.height = @naturalHeight
      ctx.drawImage this,0,0
      dataUrl = canvas.toDataURL 'image/png'
      callback(dataUrl)
      canvas = null
    img.src = src
 

  return Util