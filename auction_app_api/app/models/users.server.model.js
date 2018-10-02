const db = require('../../config/db.js');
const userController = require('../controllers/users.server.controller.js')
exports.createUser = function (values, done) {

    db.get_pool().query('INSERT INTO auction_user (user_username, user_givenname, user_familyname, user_email, user_password) VALUES ?',
        values, function(err, result){

        if (err) return done(400);
        else {
            db.get_pool().query('SELECT user_id AS id FROM auction_user WHERE user_username = ?', values[0][0][0], function(err, result){
                return done(result);
            });
        }

    });
};

exports.loginUserEmail = function (email, password, done) {
    db.get_pool().query('SELECT user_id FROM auction_user WHERE user_email = ? AND user_password = ?', [[email], [password]], function(err, result) {
        if (err | result[0] === undefined) {
            return done(400);
        }
        else {
            db.get_pool().query("UPDATE auction_user SET user_token = ? WHERE user_id = ?", [[userController.token()], [result[0].user_id]], function (err, result) {
                db.get_pool().query("SELECT user_id AS id, user_token AS token FROM auction_user WHERE user_email = ?", [[email]], function(err, result){
                    return done(result);
                });
            });
        }
    });
};


exports.loginUserUsername = function (username, password, done) {
    db.get_pool().query("SELECT user_id FROM auction_user WHERE user_username = ? AND user_password = ?", [[username], [password]], function(err, result){
        if(err || result[0] == undefined) {
            return done(400);
        }
        else{
            db.get_pool().query("UPDATE auction_user SET user_token = ? WHERE user_id = ?", [[userController.token()], [result[0].user_id]], function(err, result){
                db.get_pool().query("SELECT user_id AS id, user_token AS token FROM auction_user WHERE user_username = ?", [[username]], function(err, result){
                    return done(result);
                });
            });
        }

    });
};

exports.logoutUser = function (token, done) {
    db.get_pool().query("UPDATE auction_user SET user_token = NULL WHERE user_token = ?", [[token]], function(err, result){
        if(result.affectedRows == 0){
            return done(401);
        } else {
            return done(200);
        }
    });
};

exports.getUser = function (id, token, done) {
    db.get_pool().query("SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName, user_email AS email, user_accountbalance AS accountBalance FROM auction_user " +
        "WHERE user_id = ? AND user_token = ?", [[id], [token]], function(err, result){
        if(result[0] === undefined) {
            db.get_pool().query("SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName FROM auction_user WHERE user_id = ?", id, function(err, result){
                if(result[0] === undefined) return done(404);
                else return done(result);
            });
        }
        else {
            return done(result);
        }
    });
};

exports.getBasicUser = function (id, done) {
    db.get_pool().query("SELECT user_username AS username, user_givenname AS givenName, user_familyname AS familyName FROM auction_user WHERE user_id = ?", [[id]], function(err, result){
        if(err) return done(404);
        else if(result[0] === undefined){
            console.log(result);
            return done(404);
        }
        else return done(result);
    });
};

exports.verifyUser = function(id, token, done) {
    db.get_pool().query("SELECT user_id FROM auction_user WHERE user_id = ? AND user_token = ?", [[id], [token]], function (err, result) {
        if (err) return done(401);
        else if (result[0] === undefined) {
            return done(401);
        } else {
            return done(200);
        }
    });
}

exports.updateUsername = function(data, done){
    db.get_pool().query("UPDATE auction_user SET user_username = ? WHERE user_id = ? AND user_token = ?", data, function(err, result){
        if(err) return done(err);
        else return done(200);
    });
}

exports.updategivenName = function(data, done){
    db.get_pool().query("UPDATE auction_user SET user_givenname = ? WHERE user_id = ? AND user_token = ?", data, function(err, result){
        if(err) return done(err);
        else return done(200);
    });
}


exports.updatefamilyName = function(data, done){
    db.get_pool().query("UPDATE auction_user SET user_familyname = ? WHERE user_id = ? AND user_token = ?", data, function(err, result){
        if(err) return done(err);
        else return done(200);
    });
}


exports.updateEmail = function(data, done){
    db.get_pool().query("UPDATE auction_user SET user_email = ? WHERE user_id = ? AND user_token = ?", data, function(err, result){
        if(err) return done(err);
        else return done(200);
    });
}


exports.updatePassword = function(data, done){
    db.get_pool().query("UPDATE auction_user SET user_password = ? WHERE user_id = ? AND user_token = ?", data, function(err, result){
        if(err) return done(err);
        else return done(200);
    });
}



