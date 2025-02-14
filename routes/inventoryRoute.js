// Needed Resources 
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const reValidate = require('../utilities/vehicle-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inv_id", invController.buildByItemId)
router.get("/new_vehicle", invController.buildNewVehicle)
router.post("/new_vehicle",
    reValidate.vehicleRules(),
    reValidate.checkCarData,
    invController.addVehicle)

module.exports = router;