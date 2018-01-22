var fs = require('fs');
var path = require('path');

var collection_path = '../collection/objects';

fs.readdir(collection_path, function(err, items){
    if(err)
        console.log('err', err);

    // console.log('items:', items);
    items.forEach(function(folder){
        fs.readdir(collection_path + '/' + folder, function(err, pieces){
            console.log('pieces:', pieces);
        });
    });
});
