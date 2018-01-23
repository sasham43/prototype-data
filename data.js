// var fs = require('fs');
var fs = require('graceful-fs');
var path = require('path');
var json2csv = require('json2csv');

var collection_path = '../collection/objects';

var works = [];

fs.readdir(collection_path, function(err, items){
    if(err)
        console.log('err', err);

    // console.log('items:', items);
    items.forEach(function(folder){
        var pieces = fs.readdirSync(collection_path + '/' + folder);

        pieces.forEach(function(piece){
            var data = fs.readFileSync(collection_path + '/' + folder + '/' + piece, 'utf-8');
            try {
                var parsed = JSON.parse(data);
                // parsed.int_id = piece.replace('.json', '');
                var int_id = piece.replace('.json', '');
                // console.log('int id', int_id, piece)
                var trimmed = {
                    id: int_id,
                    title: parsed.title,
                    description: parsed.description,
                    classification: parsed.classification,
                    image: `http://api.artsmia.org/images/${int_id}/small.jpg`
                }
                works.push(trimmed);
                // console.log(parsed);
            } catch (e){
                console.log('could not parse', data)
            }
        });
    });

    console.log('works', works.length);
    // var csv = 'ID\tTitle\tDescription\tClassification\tImage\n';
    // var fields = ['id', 'title', 'description', 'classification', 'image'];
    // works.forEach(function(work){
    //     // var image_url = `http://api.artsmia.org/images/${work.int_id}/small.jpg`;
    //     // var line = work.int_id + '\t' + work.title + '\t' + work.description + '\t' + work.classification + '\t' + image_url + '\n';
    //     // csv = csv + line;
    //     console.log(Object.keys(work))
    // });
    try {
        var result = json2csv({data: works})
    } catch(e){
        console.log(e);
    }

    fs.writeFile('out.csv', result, function(err, response){
        if(err)
            console.log('write err', err);

        console.log('file written');
    })
});
