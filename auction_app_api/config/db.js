const mysql = require('mysql');

var state = {
    pool: null
};

exports.connect = function(done) {
    state.pool = mysql.createPool({
        host: 'mysql3.csse.canterbury.ac.nz',
        user: 'jha233',
        password: "82432942",
        database: "jha233",
        multipleStatements: true
    });
    done();
};

exports.get_pool = function() {
    return state.pool;
};