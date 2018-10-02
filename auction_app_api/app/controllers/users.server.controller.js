const users = require('../models/users.server.model');



exports.create = function(req, res){
    var user_data = {
        "username": req.body.username,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "email": req.body.email,
        "password": req.body.password
    };


    var values = [[[user_data['username'], user_data['givenName'], user_data['familyName'], user_data['email'], user_data['password']]]];

    users.createUser(values, function(result){
        if(result == 400){
            res.status(400).json("Malformed request");
        } else {
            res.status(200).json(result);
        }
    })
};

exports.login = function(req, res){
    var email = req.query.email;
    var username = req.query.username;
    var password = req.query.password;
    if(username === undefined){
        users.loginUserEmail(email, password, function(result){
            if(result === 400){
                res.status(400).json("Invalid username/email/password supplied");
            } else {
                res.status(200).json(result[0]);
            }
        });

    } else {
        users.loginUserUsername(username, password, function(result){
            if (result === 400){
                res.status(400).json("Invalid username/email/password supplied");
            } else {
                res.status(200).json(result[0]);
            }
        });
    }
};

exports.logout = function(req, res){
    var token1 = req.header('token');
    users.logoutUser(token1, function(result){
        if(result == 401) {
            res.status(401).json("Unauthorized");
        } else {
            res.status(200).json("OK");
        }
    });
};

exports.getUser = function(req, res){

    var id = req.params.id;

    var token = req.header('token');

    if(token === undefined){

        users.getBasicUser(id, function(result){
            if(result === 404){
                res.status(404).json("Not found");
            } else {
                res.status(200).json(result[0]);
            }
        });
    } else
    users.getUser(id, token, function(result){
        if(result === 404){
            res.status(404).json("Not found");
        } else {
            res.status(200).json(result[0])
        }

    });
};

exports.update = function(req, res){
    var id = req.params.id;
    var token = req.header('token');
    var user_data = {
        "username": req.body.username,
        "givenName": req.body.givenName,
        "familyName": req.body.familyName,
        "email": req.body.email,
        "password": req.body.password
    }


    users.verifyUser(id, token, function(result){

        if(result === 200){
            res.status(200).json("OK");
            if(user_data.username !== undefined){
                users.updateUsername([[user_data.username], [id], [token]], function(result){
                });
            }
            if(user_data.givenName !== undefined){
                users.updategivenName([[user_data.givenName], [id], [token]], function(result){
                });
            }
            if(user_data.familyName !== undefined){
                users.updatefamilyName([[user_data.familyName], [id], [token]], function(result){
                });
            }
            if(user_data.email !== undefined){

                users.updateEmail([[user_data.email], [id], [token]], function(result){

                });
            }
            if(user_data.password !== undefined){
                users.updatePassword([[user_data.password], [id], [token]], function(result){
                });
            }
        } else {
            res.status(400).json("Unauthorized");
        }
    });


};

exports.token = function() {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2);
};