const express = require('express')
const router = express.Router()

// Controllers
const VehicleController = require('../controllers/VehicleController')
const ViewController = require('../controllers/ViewController')

// -> /api

// Authentication Routes

router.post(
    '/api/vehicle/add',
    VehicleController.add,
)

router.get(
    '/api/vehicle/:code',
    VehicleController.verify,
)

router.post(
    '/api/vehicle/verifyVehicle',
    VehicleController.verifyVehicle
)

// -> /*
router.get(
    '/*',
    ViewController.redirectView
)

module.exports = router
