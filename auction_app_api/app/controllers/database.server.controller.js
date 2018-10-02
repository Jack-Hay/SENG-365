const database = require('../models/database.server.model');

exports.resetDatabase = function(req, res){
    database.reset(function(result) {
        if(result === 200){
            res.status(200).send("OK");
        } else {
            res.status(400).send("Malformed request");
        }
    });
}

exports.resampleDatabase = function(req, res){
    database.resample(function(result){
        if(result === 201){
            res.status(201).send("Sample of data has been reloaded");
        } else {
            res.status(400).send("Malformed request");
        }
    });
}