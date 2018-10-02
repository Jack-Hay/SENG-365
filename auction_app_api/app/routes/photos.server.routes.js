const photos = require('../controllers/photos.server.controller');

module.exports = function(app){

    app.route('/api/v1/auctions/:auction_id/photos').get(photos.photoUrl).post(photos.addPhoto);
    app.route('/api/v1/auctions/:auction_id/photos/:photos_id').get(photos.getPhoto).put(photos.updatePhoto).delete(photos.deletePhoto);
};