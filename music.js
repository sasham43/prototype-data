require('dotenv').config();

var q = require('q');
var request = require('request');
var _ = require('underscore');
var json2csv = require('json2csv')
var fs = require('graceful-fs')

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
var all_features = [];
var all_data = [];
var all_tags = [];

var last_fm_key = process.env.LAST_FM_KEY;

// const LastFM = require('last-fm')
// const lastfm = new LastFM(process.env.LAST_FM_KEY, { userAgent: 'MyApp/1.0.0 (http://example.com)' })

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
            // console.log('response:', response.body);
            all_features = response.body.audio_features;
            // console.log('audio features:', audio_features.length, all_tracks.length)

            var last_calls = [];

            // get last fm tags
            all_tracks.forEach(function(a){
                var artist_name = encodeURI(a.track.artists[0].name);
                var track_name = encodeURI(a.track.name);
                var endpoint = `http://ws.audioscrobbler.com/2.0/?method=track.gettoptags&artist=${artist_name}&track=${track_name}&api_key=${last_fm_key}&format=json`;

                last_calls.push(q.ninvoke(request, 'get', endpoint, {json:true}))
            });

            q.all(last_calls).then(function(response){
                response.forEach(function(r){
                    console.log('r', r[1])
                    var tags = r[1].toptags;
                    all_tags.push(tags);
                });

                console.log(all_tags.length);

                // match objects
                all_tracks.forEach(function(a){
                    var new_obj = {};

                    var tags = _.find(all_tags, function(t){
                        console.log('t', t)
                        if(t){
                            return t['@attr'].track == a.track.name;
                        }
                    });

                    var features = _.find(all_features, function(f){
                        return f.id == a.track.id;
                    });

                    new_obj.tags = tags ? tags.tag.map(function(t){ return t.name }) : [];
                    new_obj.features = features ?  features : [];
                    new_obj.artist_name = a.track.artists[0].name;
                    new_obj.track_name = a.track.name;
                    all_data.push(new_obj);
                });

                all_data.forEach(function(d, i){
                    if(i < 10){
                        console.log(d)
                    }
                });

                try {
                    var result = json2csv({data: all_data})
                } catch(e){
                    console.log(e);
                }

                fs.writeFile('music.csv', result, function(err, response){
                    if(err)
                        console.log('write err', err);

                    console.log('file written');
                })
            })
            .catch(function(err){
                console.log('you have failed me for the last time', err, last_calls.length);
            })
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
