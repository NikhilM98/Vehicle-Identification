const Vehicles =  '../models/Vehicle'

/* Create Idea */
exports.add = function (req, res) {
    if (req.body && req.body.number) {
        var newVehicle = new Vehicles({number: req.body.number});
        newVehicle.save(function (err, vehicle) {
            if (err) {
                return res.status(400).send({ success: false, msg: 'Vehicle already exists' });
            } else {
                return res.json({ success: true, msg: 'Vehicle successfully added', body: vehicle });
            }
        });
    } else {
        return res.status(400).send({ success: false, msg: 'Invalid params' });
    }
};

/* Update Idea */
exports.verify = function (req, res) {
    if (req.params.id) {
        Vehicles.find({ number: req.params.id })
            .select('number')
            .exec(function (err, vehicle) {
                if (err) {
                    return res.status(400).send({ success: false, msg: 'Cannot find vehicle', error: err });
                }
                return res.json({ success: true, msg: 'Found', body: vehicle });
            })
    } else {
        return res.status(400).send({ success: false, msg: 'No vehicle number Specified' });
    }
};
