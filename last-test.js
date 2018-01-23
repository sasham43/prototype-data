require('dotenv').config()

const LastFM = require('last-fm')
const lastfm = new LastFM(process.env.LAST_FM_KEY, { userAgent: 'MyApp/1.0.0 (http://example.com)' })

var options = { name: 'Brooklyn', artistName: 'Dreamers Delight' };

lastfm.trackTopTags(options, function(err, data){
    console.log('err', err);
    console.log('data', data);
})
