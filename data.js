// var fs = require('fs');
var fs = require('graceful-fs');
var path = require('path');

var collection_path = '../collection/objects';

var works = [];

fs.readdir(collection_path, function(err, items){
    if(err)
        console.log('err', err);

    // console.log('items:', items);
    items.forEach(function(folder){
        fs.readdir(collection_path + '/' + folder, function(err, pieces){
            // console.log('pieces:', pieces);
            pieces.forEach(function(piece){
                var data = fs.readFileSync(collection_path + '/' + folder + '/' + piece, 'utf-8');
                try {
                    var parsed = JSON.parse(data);
                    works.push(parsed);
                } catch (e){
                    console.log('could not parse', data)
                }
                // works.push(JSON.parse(data));
            });

            console.log('works', works.length);
        });
    });
});
