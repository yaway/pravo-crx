define ['jquery','lib/underscore'],($,_)->
  TPL = {}
  TPL.getTpl = (tpl)->
    tplStr = _.unescape $("[data-tpl='#{tpl}']").html()
    return tplStr
  return TPL