define [
  'jquery'
  'lib/underscore'
],($,_)->
  Utl = {}
  Utl.resolveURL = ()->
    console.log arguments
    numURLs = arguments.length

    if numURLs is 0
      return false

    base = document.createElement 'base'
    base.href = arguments[0]

    if numURLs is 1
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

  Utl.fetchDataURL = (src, callback)->
    img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = ()->
      canvas = document.createElement 'canvas'
      ctx = canvas.getContext '2d'
      canvas.width = @naturalWidth
      canvas.height = @naturalHeight
      ctx.drawImage this,0,0
      dataURL = canvas.toDataURL 'image/png'
      callback(dataURL)
      canvas = null
    img.src = src
 
  Utl.getTpl = (tpl)->
    tplStr = _.unescape $("[data-tpl='#{tpl}']").html()
    return tplStr

  return Utl