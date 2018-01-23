// var fs = require('fs');
var fs = require('graceful-fs');
var path = require('path');
var json2csv = require('json2csv');

var collection_path = '../collection/objects';

var works = [];

fs.readdir(collection_path, function(err, items){
    if(err)
        console.log('err', err);

    items.forEach(function(folder){
        var pieces = fs.readdirSync(collection_path + '/' + folder);

        pieces.forEach(function(piece){
            var data = fs.readFileSync(collection_path + '/' + folder + '/' + piece, 'utf-8');
            try {
                var parsed = JSON.parse(data);
                var int_id = piece.replace('.json', '');
                var trimmed = {
                    id: int_id,
                    title: parsed.title,
                    description: parsed.description,
                    classification: parsed.classification,
                    image: `http://api.artsmia.org/images/${int_id}/small.jpg`
                }
                works.push(trimmed);
            } catch (e){
                // console.log('could not parse', data)
            }
        });
    });

    console.log('works', works.length);

    try {
        var result = json2csv({data: works})
    } catch(e){
        console.log(e);
    }

    fs.writeFile('mia.csv', result, function(err, response){
        if(err)
            console.log('write err', err);

        console.log('file written');
    })
});
