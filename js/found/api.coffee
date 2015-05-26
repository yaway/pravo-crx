define ['found/api-factory'],(ApiFactory)->
  
  API = new ApiFactory {root: 'http://211.155.86.150:9999/'}

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
    path: 'artworks'
  }
  
  return API