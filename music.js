require('dotenv').config();

var Spotify = require('node-spotify-api');

var spotify = new Spotify({
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET
});

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

var all_tracks = [];

playlists.forEach(function(p){
    var endpoint = `https://api/spotify.com/v1/users/${p.user}/playlists/${p.playlist}/tracks`;
    console.log('endpoint:', endpoint);
    spotify.request(endpoint)
    .then(function(response){
        console.log('response:', response);

        all_tracks.push(response);
    }).catch(function(err){
        console.log('fail', err);
    });
});
