define ['jquery','lib/underscore'],()->
  TPL = {}
  TPL.getTpl = (tpl)->
    return $("[data-tpl='#{tpl}']").html()
  return TPL