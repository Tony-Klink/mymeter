var express = require('express');
var pg = require('pg');
var Pool = require('pg').Pool;
var router = express.Router();

/* GET meters listing. */
router.get('/', function (req, res) {
    res.render('meter', { pageTitle: 'Необходимо указать точный период', values: {} });
});

router.get('/:id/:start_date/:end_date', function (req, res) {
    if (req.params.start_date != '' && req.params.end_date != '' && req.params.id != '') {
        console.log(req.body);
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
        console.log(req.params.id);
        var query = 'SELECT meters.num, meters.address, meters.serial_number, meters.dev_type, meters.date, meters.active_energy_sum, meters.total_active_energy, meters.total_active_energy_rate1, meters.total_active_energy_rate2, meters.active_energy_import, meters.active_energy_import1, meters.active_energy_import2 FROM public.meters WHERE meters.serial_number LIKE \'' + req.params.id + '\' AND meters.date BETWEEN \'' + req.params.start_date + '\' AND \'' + req.params.end_date + '\' ORDER BY meters.date;';
        //var query = 'SELECT meters.serial_number, meters.dev_type, meters.date, meters.active_energy_sum, meters.total_active_energy, meters.total_active_energy_rate1, meters.total_active_energy_rate2, meters.active_energy_import, meters.active_energy_import1, meters.active_energy_import2 FROM meters WHERE CAST(coalesce(serial_number, \'1234567\') AS integer) = ' + req.params.id;
        pool.query(query, function (err, result) {
            if (err != null) {
                console.log(err);
                res.render('meter', { pageTitle: 'Указанный номер счетчика не существует', values: {} });
            }
            else {
                //console.log(result.rows[0].meter_number); // output: foo
                var metersList = [];
                result.rows.forEach(function (item, i, rows) {
                    metersList.push({
                        serial: item.serial_number,
                        devType: item.dev_type,
                        date: item.date.toLocaleDateString() + ' ' + item.date.toLocaleTimeString(),
                        activeEnergy: item.active_energy_sum,
                        totalActiveEnergy: item.total_active_energy,
                        totalActiveEnergy1: item.total_active_energy_rate1,
                        totalActiveEnergy2: item.total_active_energy_rate2,
                        activeEnergyImport: item.active_energy_import,
                        activeEnergyImport1: item.active_energy_import1,
                        activeEnergyImport2: item.active_energy_import2
                    })
                });
                if (metersList.length != 0) {
                    res.render('meter', { pageTitle: metersList[0].serial + ' ' + metersList[0].devType + ':', values: metersList });
                    console.log(result.rows.values());
                }
                else {
                    res.render('meter', { pageTitle: 'Указанный номер счетчика не найден в базе', values: {} });
                }
            }
        });
    }
    else {
        res.render('meter', { pageTitle: metersList[0].serial + ' ' + metersList[0].devType + ':', values: {} });
    }
});

module.exports = router;