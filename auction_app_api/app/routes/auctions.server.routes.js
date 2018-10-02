const auctions = require('../controllers/auctions.server.controller');

module.exports = function(app){

    app.route('/api/v1/auctions').get(auctions.viewAuctions).post(auctions.createAuction);
    app.route('/api/v1/auctions/:id').get(auctions.viewAuction).patch(auctions.patchAuction);
    app.route('/api/v1/auctions/:id/bids').get(auctions.viewBids).post(auctions.makeBid);
};