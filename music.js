require('dotenv').config();

var q = require('q');

var playlists = [
    {
        user: 'charliebrooker',
        playlist: '1enamd7IoA2KtAoMxeiINW'
    },
    {
        user: '1227203063',
        playlist: '6aRZRyzUVJUh492q9KkX4y'
    },
    {
        user: 'spotify',
        playlist: '37i9dQZEVXcCXYdBgOge4v'
    }
];
var track_ids = [];
var all_tracks = [];

var SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
// var spotifyApi = new SpotifyWebApi();
console.log(process.env.SPOTIFY_ID,process.env.SPOTIFY_SECRET)
var spotifyApi = new SpotifyWebApi({
  clientId : process.env.SPOTIFY_ID,
  clientSecret : process.env.SPOTIFY_SECRET,
  redirectUri : 'http://www.example.com/callback'
});

// console.log('spotify', spotifyApi);
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    console.log('The access token expires in ' + data.body['expires_in']);
    console.log('The access token is ' + data.body['access_token']);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body['access_token']);

    var calls = [];

    playlists.forEach(function(p){
        calls.push(spotifyApi.getPlaylistTracks(p.user, p.playlist));
        // spotifyApi.getPlaylistTracks(p.user, p.playlist)
        // .then(function(response){
        //     // console.log('response:', response);
        //     // all_tracks.push(response);
        //     response.body.items.forEach(function(t){
        //         console.log('t', t);
        //         all_tracks.push(t);
        //     })
        //     console.log('length', all_tracks.length)
        // })
        // .catch(function(err){
        //     console.log('fail', err);
        // });
    });

    q.all(calls).then(function(response){
        // console.log('response', response);
        response.forEach(function(r){
            console.log('r', r.body.items)
            r.body.items.forEach(function(t){
                all_tracks.push(t);
                track_ids.push(t.track.id);
            });
        });

        // console.log('track ids', track_ids)

        spotifyApi.getAudioFeaturesForTracks(track_ids)
        .then(function(response){
            console.log('response:', response.body);
        })
        .catch(function(err){
            console.log('failed again', err);
        });
    }).catch(function(err){
        console.log('oh my no', err);
    })
  }, function(err) {
        console.log('Something went wrong when retrieving an access token', err);
  });
