const Vehicles =  require('../models/Vehicle')

/* Create Idea */
exports.add = function (req, res) {
    const data = {
        number: req.body.number
    }
    var newVehicle = new Vehicles(data);
    if(data) {
        newVehicle.save( function(err, vehicle) {
            if(err) {
                return res.status(400).send({
                    success: false,
                    msg: "Vehicle already exists",
                    err: err
                })
            }
            else {
                return res.status(200).send({
                    success: true,
                    msg: "Vehicle successfully added",
                    body: vehicle
                })
            }
        }
        )
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

exports.verifyVehicle = function (req, res) {
    if(req && req.body && req.body.number) {
        if(req.body.number) {
            req.body.number = req.body.number.toUpperCase()
        }
        console.log(req.body.number)
        Vehicles.findOne({number: req.body.number})
            .exec(function(err, vehicle) {
                if(err) {
                    return res.status(400).send({
                        success: false,
                        msg: 'Error fetching data',
                        error: err
                    })
                }
                if(!vehicle) {
                    return res.json({
                        success: false,
                        msg: 'Vehicle not found',
                        body: vehicle });
                }
                return res.json({
                    success: true,
                    msg: 'Vehicle successfully found',
                    body: vehicle
                })
            })
    }
    else {
        return res.status(400).send({
            success: false,
            msg: "Did not receive data"
        })
    }
}
