define [
  'found/api-factory'
],(APIFactory)->
  
  # flickr = new Flickr {api_key: "a745b3049b6cc2550348561bb53619df"}

  # API = new ApiFactory {root: 'http://211.155.86.150:9999/'}
  API = new APIFactory

  roots =
    unsplash: 'https://api.unsplash.com/'
    konachan: 'https://konachan.com/'
    yandere: 'https://yande.re/'

  create = API.create.bind API

  # GET = "GET"
  # POST = "POST"

  # API.signUp = create
  #   method: POST
  #   path: 'me/register'

  # API.signIn = create
  #   method: POST
  #   path: 'me/session'


  API.fetchArtworks = (data,callback,opt)=>
    if opt.from is 'konachan'
      api = create
        root: roots.konachan
        path: 'post.json?limit=10&tags=hatsune_miku'
    else if opt.from is 'unsplash'
      api = create
        root: roots.unsplash
        path: 'photos/?client_id=b913958e7c261416a76d50da89193b5b7eccd8694fd94b3f274c970d2a6c833d'
    api(data,callback)


  return API