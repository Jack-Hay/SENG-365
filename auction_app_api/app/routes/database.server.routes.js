const database = require('../controllers/database.server.controller');

module.exports = function(app){

    app.route('/api/v1/reset').post(database.resetDatabase);
    app.route('/api/v1/resample').post(database.resampleDatabase);
};