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
                fs.readFile(collection_path + '/' + folder + '/' + piece, 'utf-8', function(err, data){
                    if(err)
                        console.log('piece err', err);

                    // console.log('piece:', data)
                    works.push(JSON.parse(data));
                    console.log('works', works.length);
                });
            });
        });
    });
});
