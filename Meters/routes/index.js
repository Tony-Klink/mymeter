var express = require('express');
var router = express.Router();



/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Express', name: 'Yan' });
});

router.get('/index', function (req, res) {
    res.render('index', { title: 'Express', name: 'Yan' });
});

router.post('/meter', function (req, res) {
    console.log(req.body);
    res.redirect('/meter/' + req.body.meter_id + '/' + req.body.start_date + '/' + req.body.end_date);
    
});


module.exports = router;