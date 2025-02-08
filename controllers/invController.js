const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory product by item ID view
 * ************************** */

invCont.buildByItemId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicleData = await invModel.getVehicleDetails(inv_id)
    console.log("Vehicle data:", vehicleData)
    
    // Check if vehicleData exists and has at least one element
    if (!vehicleData || vehicleData.length === 0) {
      return res.status(404).send("Vehicle not found")
    }
    
    // Extract the first (and presumably only) vehicle object
    const vehicle = vehicleData[0]

    let nav = await utilities.getNav()
    const details = utilities.vehicleDetails(vehicle)
    
    res.render("./inventory/vehicle", {
      title: vehicle.inv_make + " " + vehicle.inv_model,
      nav,
      details,
    })
  } catch (error) {
    console.error("Error fetching vehicle details:", error)
    next(error)
  }
}


module.exports = invCont