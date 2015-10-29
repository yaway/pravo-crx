define [
  'found/api-factory'
],(ApiFactory)->
  
  # flickr = new Flickr {api_key: "a745b3049b6cc2550348561bb53619df"}

  # API = new ApiFactory {root: 'http://211.155.86.150:9999/'}
  API = new ApiFactory {root: 'https://konachan.com/'}

  create = API.create.bind API

  GET = "GET"
  POST = "POST"

  API.signUp = create {
    method: POST
    path: 'me/register'
  }

  API.signIn = create {
    method: POST
    path: 'me/session'
  }

  API.getArtworks = create {
    method: GET
    path: 'post.json?limit=5&tags=hatsune_miku'
  }
  return API