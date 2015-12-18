(function() {
  define(['found/api-factory'], function(APIFactory) {
    var API, GET, POST, create, roots;
    API = new APIFactory;
    roots = {
      konachan: 'https://konachan.com/',
      unsplash: 'https://api.unsplash.com/'
    };
    create = API.create.bind(API);
    GET = "GET";
    POST = "POST";
    API.signUp = create({
      method: POST,
      path: 'me/register'
    });
    API.signIn = create({
      method: POST,
      path: 'me/session'
    });
    API.fetchArtworks = (function(_this) {
      return function(data, callback, opt) {
        var api;
        if (opt.from === 'konachan') {
          api = create({
            root: roots.konachan,
            path: 'post.json?limit=10&tags=hatsune_miku'
          });
        } else if (opt.from === 'unsplash') {
          api = create({
            root: roots.unsplash,
            path: 'photos/?client_id=b913958e7c261416a76d50da89193b5b7eccd8694fd94b3f274c970d2a6c833d'
          });
        }
        return api(data, callback);
      };
    })(this);
    return API;
  });

}).call(this);
