define ['found/error'],(Errors)->
  class ApiFactory
    constructor: (option)->
      option ?= {}
      @root = option.root or ''
      # 1 min timeout
      @timeout = option.timeout or 1000*60
    request: (option)->
      $.ajax option
    create: (option)=>
      option ?= {}
      return (data,callback)=>
        console.log data
        if not data 
          data = {}
        method = option.method or 'GET'
        url = ''
        if option.url
          url = option.url
        else
          url = (@root or '') + option.path
        timeout = @timeout
        if (method.toUpperCase() is 'GET')
          contentType = 'application/x-www-form-urlencoded'
          data = data
        else
          contentType = 'application/json'
          data = JSON.stringify data

        @request {
          type:method
          data:data
          url:url
          timeout:timeout
          dataType:'json'
          contentType:contentType
          success:(data) ->
            if data and data.error
              callback data,null
            else
              callback null,data
          error:(xhr,state) ->
            console.debug 'fail'
            if (state is 'timeout')
              callback new Errors.Timeout
            else if (state is 'abort')
              callback new Errors.Abort
            else
              try
                data = (JSON.parse xhr.responseText)
              catch e
                callback new Errors.UnkownError,xhr.responseText
              return
              callback {
                code:data.code
                message:data.error
              }
            }
  return ApiFactory