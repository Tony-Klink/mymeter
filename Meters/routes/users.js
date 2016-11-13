var express = require('express');
var pg = require('pg');
var Pool = require('pg').Pool;
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res) {
    var pool = new Pool({
        user: 'postgres',
        password: '1234',
        database: 'metersdb',
        max: 10,
        idleTimeoutMillis: 1000
    });
    pool.on('error', function (e, client) {
        console.log(e);
    });
    // you can run queries directly against the pool
    pool.query('SELECT meter_number FROM meter', function (err, result) {
        //console.log(result.rows[0].meter_number); // output: foo
        var metersList = [];
        result.rows.forEach(function (item, i, rows) {
            metersList.push(item.meter_number)
        });
        res.render('users', { comment: 'You are my nigga, nigga', values: metersList });
        console.log(result.rows.values());
    });

    //res.render('users', {comment: 'You are my nigga, nigga', values:['apple', 'shit', 'my meter']});
});

module.exports = router;