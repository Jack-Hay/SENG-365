const auctions = require('../models/auctions.server.model');

exports.viewAuctions = function(req, res){


    auctions.viewAll(function(result) {
        console.log(result);
    });
};

exports.createAuction = function(req, res){
    var token = req.header('token');

    user_data = {
        "categoryId": req.body.categoryId,
        "title": req.body.title,
        "description": req.body.description,
        "startDateTime": req.body.startDateTime,
        "endDateTime": req.body.endDateTime,
        "reservePrice": req.body.reservePrice,
        "startingBid": req.body.startingBid
    };

    var values = [user_data['title'], user_data['categoryId'], user_data['description'],
        user_data['reservePrice'], user_data['startingBid'], user_data['startDateTime'], user_data['endDateTime']];

    auctions.create(token, values, function(result){
        if(result === 400){
            res.status(400).json("Malformed auction data");
        } else if(result == 401){
            res.status(401).json("Unauthorized")
        } else {
            res.status(200).json("OK");
        }
    });
};

//TODO Stop variable names appearing
exports.viewAuction = function(req, res){
    var auction_id = req.params.id;
    auctions.dropViews();

    auctions.viewOne(auction_id, function(result) {
        var auctionInfo = result[0];
        //console.log(auctionInfo);
        if(result == 404){
            res.status(404).json(result);
        } else {
            //res.json(result);

        auctions.getSellerInfo(function(result){
            var seller = result[0];
            //console.log(sellerInfo);
            auctions.getCurrentBid(function(result4){
                var currentBid = result4[0].currentBid;
                //console.log(currentBid);
                auctions.getStartingBid(function(result5){
                    var startingBid = result5[0].startingBid;

                    auctions.getBidInfo(function(result){
                        var bids = result;
                        //console.log(bidInfo);
                        res.send({auctionInfo, seller, startingBid , currentBid, bids});
                        auctions.dropViews();
                    });
                });

            });
        });


        }
    });
};

exports.patchAuction = function(req, res){
    var auction_id = req.params.id;
    var token = req.header('token');
    var status = 200;

    var auction_data = {
        "categoryId": req.body.categoryId,
        "title": req.body.title,
        "description": req.body.description,
        "startDateTime": req.body.startDateTime,
        "endDateTime": req.body.endDateTime,
        "reservePrice": req.body.reservePrice,
        "startingBid": req.body.startingBid
    }
    auctions.checkExists(auction_id, function(result){
        if(result == 404){
            res.status(404).json("Not found.");
        } else {
            auctions.checkToken(auction_id, token, function (result) {
                if (result == 401) {
                    res.status(401).json("Unauthorized");
                } else {
                    auctions.checkBegun(auction_id, function(result){
                        if(result == 403) {
                            res.status(403).json("Forbidden - bidding has begun on the auction.");
                        } else {
                            if(auction_data['categoryId'] != undefined){
                                auctions.updateCategoryId(auction_data['categoryId'], auction_id, function(result){

                                });
                            }
                            if(auction_data['title'] != undefined){
                                auctions.updateTitle(auction_data['title'], auction_id, function(result){
                                });
                            }
                            if(auction_data['description'] != undefined){
                                auctions.updateDescription(auction_data['description'], auction_id, function(result){
                                });
                            }
                            if(auction_data['startDateTime'] != undefined){
                                auctions.updateStartDateTime(auction_data['startDateTime'], auction_id, function(result){
                                });
                            }
                            if(auction_data['endDateTime'] != undefined){
                                auctions.updateEndDateTime(auction_data['endDateTime'], auction_id, function(result){

                                });
                            }
                            if(auction_data['reservePrice'] != undefined){
                                auctions.updateReservePrice(auction_data['reservePrice'], auction_id, function(result){

                                });
                            }
                            if(auction_data['startingBid'] != undefined){
                                auctions.updateStartingBid(auction_data['startingBid'], auction_id, function(result){
                                });
                            }
                            res.status(200).json("OK");



                        }
                    });
                }

                    });

        }
    });

};

exports.viewBids = function(req, res){

    var id = req.params.id;

    auctions.viewBids(id, function(result){
        if(result == 400){
            res.status(400).json('Bad request.');
        } else if (result == 404){
            res.status(404).json('Not found');
        } else{
            res.status(200).json(result);
        }
    });
};

exports.makeBid = function(req, res){

    var amount = req.query.amount;
    var id = req.params.id;
    var token = req.header('token');

    auctions.checkExists(id, function(result) {
        if (result == 404) {
            res.status(404).json("Not found");
        } else {
            auctions.checkActive(id, function (result) {
                if (result == 400) {
                    res.status(400).json("Bad request");
                } else {
                    auctions.higherBid(id, amount, function(result){
                        if(result == 400){
                            res.status(400).json("Bad request");
                        } else {
                            auctions.makeBid(id, amount, token, function(result) {
                                res.json(result);
                                // if(result == 400){
                                //     res.status(400).json("Bad request");
                                // } else {
                                //     res.status(200).json("OK");
                                // }

                            });
                        }
                    })
                }
            })
        }
    });
};