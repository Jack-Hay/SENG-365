const db = require('../../config/db.js');

exports.viewAll = function() {
    return null;
};

exports.create = function(token, data, done) {
    db.get_pool().query("SELECT user_id FROM auction_user WHERE user_token = ?", token, function (err, result) {
        if (result[0] === undefined) {
            return done(401);
        } else {
            data.push(result[0].user_id);
            console.log(data);
            db.get_pool().query("INSERT INTO auction (auction_title, auction_categoryid, auction_description, auction_reserveprice, auction_startingprice, auction_startingdate, auction_endingdate, auction_userid)" +
                " VALUES ?", [[data]], function (err, result) {
                if (err) {
                    return done(400);
                } else {
                    return done(200);
                }
            });
        }
    });
};

exports.viewOne = function(id, done) {
    db.get_pool().query('CREATE VIEW view1 AS SELECT * FROM auction JOIN auction_user ON auction.auction_userid = auction_user.user_id JOIN bid ON auction.auction_id = bid.bid_auctionid JOIN category ON category.category_id = auction.auction_categoryid WHERE auction.auction_id = ?', [[id]], function(err, result){
        if(err) return done(404);
        else {
            db.get_pool().query('SELECT auction_categoryid AS categoryId, category_title AS categoryTitle, auction_title AS title, auction_reserveprice AS reservePrice, auction_startingdate AS startDateTime, auction_endingdate AS endDateTime, auction_description AS description, auction_creationdate AS creationDateTime FROM view1', function(err, result){
                return done(result);
            });

        }
    });
};

exports.getBidInfo = function(done) {
    db.get_pool().query('CREATE VIEW view2 AS SELECT view1.bid_amount AS amount, view1.bid_datetime AS datetime, view1.bid_userid AS buyerId, auction_user.user_username AS buyerUsername FROM view1 JOIN auction_user ON bid_userid = auction_user.user_id', function(err, result){
        //return done(err);
        db.get_pool().query('SELECT * FROM view2', function(err, result){
            return done(result);
        });
    });
};

exports.getSellerInfo = function(done){
    db.get_pool().query('SELECT auction_userid AS id, user_username AS username FROM view1', function(err, result){
        return done(result);
    })
};

exports.getCurrentBid = function(done){
    db.get_pool().query('SELECT MAX(bid_amount) AS currentBid FROM view1', function(err, result){
        return done(result);
    });
};

exports.getStartingBid = function(done){
    db.get_pool().query('SELECT auction_startingprice AS startingBid FROM view1', function(err, result){
        return done(result);
    });
};


exports.dropViews = function(done){
    db.get_pool().query('DROP VIEW view1'), function(err, result){
        db.get_pool().query('DROP VIEW view2', function(err, result){
            return done(result);
        })
    }
};

exports.checkToken = function(auction_id, token, done){
    db.get_pool().query("SELECT * FROM auction JOIN auction_user ON user_id = auction_userid WHERE user_token = ? AND auction_id = ?", [[token], [auction_id]], function(err, result){
        if (result[0] == undefined) return done(401);
        else return done(200);
    });
};
//TODO CHANGE DATE CHECK TO <
exports.checkBegun = function(id, done){
    db.get_pool().query("SELECT auction_startingdate FROM auction WHERE auction_id = ?", [[id]], function(err, result){
        console.log(result);
        var currentDate = Date.now();
        var startDate = new Date(result[0].auction_startingdate);
        console.log(startDate);
        if(currentDate < startDate) {
            console.log("yeet");
            return done(200);
        } else {
            console.log("reet");
            return done(403);
        }
    });
};

exports.checkExists = function(id, done){
    db.get_pool().query("SELECT * FROM auction WHERE auction_id = ?", [[id]], function(err, result){
        if(result[0] == undefined){
            return done(404);
        } else return done(200);
    })
};

exports.updateCategoryId = function(category, id, done) {
    db.get_pool().query("UPDATE auction SET auction_categoryid = ? WHERE auction_id = ?", [[category], [id]],
        function (err, result) {
            if (err) return done(400);
            else return done(200);
        });
};

exports.updateTitle = function(title, id, done){
    db.get_pool().query("UPDATE auction SET auction_title = ? WHERE auction_id = ?", [[title], [id]],
        function (err, result) {
            if (err) return done(400);
            else return done(200);
        });
};

exports.updateDescription = function(description, id, done){
    db.get_pool().query("UPDATE auction SET auction_description = ? WHERE auction_id = ?", [[description], [id]],
        function (err, result) {
            if (err) return done(400);
            else return done(200);
        });
};

exports.updateStartDateTime = function(time, id, done){
    db.get_pool().query("UPDATE auction SET auction_startDateTime = ? WHERE auction_id = ?", [[time], [id]],
        function (err, result) {
            if (err) return done(400);
            else return done(200);
        });
};

exports.updateEndDateTime = function(time, id, done){
    db.get_pool().query("UPDATE auction SET auction_endDateTime = ? WHERE auction_id = ?", [[time], [id]],
        function (err, result) {
            if (err) return done(400);
            else return done(200);
        });
};

exports.updateReservePrice = function(price, id, done){
    db.get_pool().query("UPDATE auction SET auction_ReservePrice = ? WHERE auction_id = ?", [[price], [id]],
        function (err, result) {
        console.log(result);
            if (result.changedRows == 0) return done(400);
            else return done(200);
        });
};

exports.updateStartingBid = function(bid, id, done){
    db.get_pool().query("UPDATE auction SET auction_startingBid = ? WHERE auction_id = ?", [[bid], [id]],
        function (err, result) {

            if (err) return done(400);
            else return done(200);
        });
};

exports.viewBids = function(id, done) {
    db.get_pool().query("SELECT bid_amount AS amount, bid_datetime AS datetime, bid_userid AS buyerId, user_username AS buyerUsername FROM auction JOIN bid ON auction_id = bid_auctionid JOIN auction_user ON bid_userid = user_id WHERE auction_id = ?", [[id]],
        function(err, result){
        if(result[0] == []){
            return done(404);
        } else if (result.length > 0){
            return done(result);
        } else return done(400);
    });
};

// exports.checkExists = function(id, done){
//     db.get_pool().query("SELECT * FROM auction WHERE auction_id = ?", [[id]],
//          function(err, result){
//         if(result == undefined){
//             return done(404);
//         } else {
//             return done(200);
//         }
//          });
// };

exports.checkActive = function(id, done){
    db.get_pool().query("SELECT auction_startingdate AS start, auction_endingdate AS end FROM auction WHERE auction_id = ?", [[id]],
        function(err, result){

            var currentDate = Date.now();
            var startDate = new Date(result[0].start);
            var endDate = new Date(result[0].end);
            if(startDate < currentDate && endDate > currentDate){
                console.log("Good");
                return done(200);
            } else {
                return done(400);
            }
            });
};

exports.higherBid = function(id, amount, done) {
    db.get_pool().query("SELECT MAX(bid_amount) AS bid FROM auction JOIN bid ON auction.auction_id = bid.bid_auctionid WHERE auction.auction_id = ?", [[id]],
        function (err, result) {

            if (err) return done(400);
            else if (result[0].bid < amount) {
                return done(200);
            } else return done(400);
        });
};

exports.makeBid = function(id, amount, token, done) {
    console.log(token);
    db.get_pool().query("SELECT user_id FROM auction_user WHERE user_token = ?", token, function(err, result1){
        if(result1 == undefined){
            return done(400);
        } else {
            db.get_pool().query("INSERT INTO bid (bid_userid, bid_auctionid, bid_amount, bid_datetime) VALUES ?", [[[result1[0].user_id, Number(id), Number(amount), Date.now()]]],
                function(err, result){
                if(err) return done(400);
                return done(200);
                    // if(err) return done(result);
                    // else return done(200);
                })
        }
    })
};
