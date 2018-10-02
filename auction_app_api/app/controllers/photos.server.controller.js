const photo = require('../models/photos.server.model');

exports.photoUrl = function(req, res){
    photo.getPhotoUrl(function(result) {
        console.log(result);
    });
}

exports.addPhoto = function(req, res){
    photo.addPhoto(function(result) {
        console.log(result);
    });
}

exports.getPhoto = function(req, res){
    photo.getPhoto(function(result) {
        console.log(result);
    });
}

exports.updatePhoto = function(req, res){
    photo.updatePhoto(function(result) {
        console.log(result);
    });
}

exports.deletePhoto = function(req, res){
    photo.deletePhoto(function(result) {
        console.log(result);
    });
}