const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to get inventory items by classification ID (for AJAX request)
router.get("/getInventory/:classificationId", invController.getInventoryByClassificationId)

// Route to build inventory product by item ID view
router.get("/detail/:inv_id", invController.buildByItemId)

// Route to build the edit view for an inventory item
router.get("/edit/:inv_id", utilities.checkJWTToken, utilities.checkAccountType, invController.buildEditView)

// Route to update an inventory item
router.post("/update/:inv_id", utilities.checkJWTToken, utilities.checkAccountType, invValidate.inventoryRules(), invValidate.checkInventoryData, invController.updateVehicle)

// Route to build the delete confirmation view for an inventory item
router.get("/delete/:inv_id", utilities.checkJWTToken, utilities.checkAccountType, invController.buildDeleteView)

// Route to delete an inventory item
router.post("/delete/:inv_id", utilities.checkJWTToken, utilities.checkAccountType, invController.deleteVehicle)

// Route to build the new vehicle view
router.get("/new_vehicle", utilities.checkJWTToken, utilities.checkAccountType, invController.buildNewVehicle)

// Route to add a new vehicle
router.post("/new_vehicle", utilities.checkJWTToken, utilities.checkAccountType, invValidate.inventoryRules(), invValidate.checkInventoryData, invController.addVehicle)

module.exports = router