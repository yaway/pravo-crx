define [],()->
    createError = (name,args...)->
        args = args.filter (item)->item
        if args.length is 0
            BaseError = Error
            meta = {}
        else if args.length is 1
            if args[0] instanceof Error
                BaseError = args[0]
                meta = {}
            else
                BaseError = Error
                meta = args[0]
        else if args.length is 2
            if args[0] instanceof Error
                BaseError = args[0]
                meta = args[1]
            else
                BaseError = args[1]
                meta = args[0]
        else
            BaseError = Error
        console.debug BaseError,Error
        class CustomError extends BaseError
            @name = name
            constructor:(message,props)->
                super()
                @name = name
                @message = message or meta.message or prop.message or name
                for prop of meta
                    if meta.hasOwnProperty prop
                        @[prop] = meta[prop]
                for prop of props
                    if props.hasOwnProperty prop
                        @[prop] = props[prop]
            name:name
        return CustomError
        
    class ErrorFactory
        constructor:()->
            @errors = {}
        define:(name,base,meta)->
            @errors[name] = createError(name,base,meta)
            return this
        generate:()->
            return @errors
        @create = ()->
            return new ErrorFactory()

    Errors = ErrorFactory.create()
        .define("Timeout",{code:100})
        .define("NetworkError",{code:101})
        .define("NotFound",{code:102})
        .define("PermissionDenied",{code:103})
        .define("Abort",{code:104})
        .define("UnkownError",{code:105})
        .define("ServerError",{code:106})
        .generate()
        
    Errors.createBackendError = (message,code)->
        return new Errors.ServerError(message,{backendCode:code})

    return Errors
