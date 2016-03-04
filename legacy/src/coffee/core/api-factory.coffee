define [],()->
  class APIFactory
    constructor: (opt)->
      opt ?= {}
      @root = opt.root or ''
      # 1 min timeout
      @timeout = opt.timeout or 1000*60
    request: (opt)->
      $.ajax opt
    create: (opt)=>
      opt ?= {}
      return (data,callback)=>
        if not data 
          data = {}
        method = opt.method or 'GET'
        url = ''
        if opt.url
          url = opt.url
        else
          url = "#{opt.root or @root or ''}#{opt.path}"
        timeout = @timeout
        if (method.toUpperCase() is 'GET')
          contentType = 'application/x-www-form-urlencoded'
          data = data
        else
          contentType = 'application/json'
          data = JSON.stringify data

        @request
          type:method
          data:data
          url:url
          # timeout:timeout
          # dataType:'json'
          # contentType:contentType
          success:(data) ->
            if data and data.error
              callback data,null
            else
              callback null,data
          error:(xhr,state) ->
            callback state
  return APIFactory