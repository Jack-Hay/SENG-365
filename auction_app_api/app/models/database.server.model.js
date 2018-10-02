const db = require('../../config/db.js');
const fs = require('fs');
const path = require('path');

const reset_database_path = path.join(__dirname, '../database_sql/reset.sql');
const resample_database_path = path.join(__dirname, '../database_sql/resample.sql');

var resetQuery = fs.readFileSync(reset_database_path, "utf-8");

var resampleQuery = fs.readFileSync(resample_database_path, "utf-8");


exports.reset = function (done) {

    db.get_pool().query(resetQuery, function (err, result) {
        if (err) return done(400);

        return done(200);
    });
};

exports.resample = function (done) {
    db.get_pool().query(resampleQuery, function (err, result) {

        if (err) return done(400);

        return done(201);

    });
};