const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    })
  } catch (error) {
    console.error("Error fetching inventory by classification:", error)
    next(error)
  }
}

/* ***************************
 *  Get inventory items by classification ID (for AJAX request)
 * ************************** */
invCont.getInventoryByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    res.json(data)
  } catch (error) {
    console.error("Error fetching inventory by classification ID:", error)
    res.status(500).json({ error: "Failed to fetch inventory" })
  }
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

invCont.buildNewVehicle = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    const classifications = await invModel.getClassifications()
    // console.log("Classifications:", classifications)
    res.render("./inventory/new_vehicle", {
      title: "Add Vehicle",
      nav,
      classifications: classifications.rows,
      errors: null,
    })
  } catch (error) {
    console.error("Error fetching vehicle page:", error)
    next(error)
  }

}


invCont.addVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const addResult = await invModel.newVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

  const classifications = await invModel.getClassifications() // Fetch classifications again

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, ${inv_make} ${inv_model} has been added to the database`
    )
    res.status(201).render("./inventory/new_vehicle", {
      title: "Add Vehicle",
      nav,
      classifications: classifications.rows, // Ensure classifications is passed correctly
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the vehicle failed.")
    res.status(501).render("./inventory/new_vehicle", {
      title: "Add Vehicle",
      nav,
      classifications: classifications.rows, // Ensure classifications is passed correctly
      errors: null,
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build the edit view for an inventory item
 * ************************** */
invCont.buildEditView = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const vehicleData = await invModel.getVehicleDetails(inv_id)
    console.log("Vehicle data:", vehicleData)
    const classifications = await invModel.getClassifications() // Fetch classifications again
    console.log("Classifications:", classifications)

    // Check if vehicleData exists and has at least one element
    if (!vehicleData || vehicleData.length === 0) {
      return res.status(404).send("Vehicle not found")
    }

    // Extract the first (and presumably only) vehicle object
    const vehicle = vehicleData[0]

    let nav = await utilities.getNav()

    res.render("./inventory/edit-vehicle", {
      title: "Edit " + vehicle.inv_make + " " + vehicle.inv_model,
      nav,
      classifications: classifications.rows, // Ensure classifications is passed correctly
      errors: null,
      vehicle,
    })
  } catch (error) {
    console.error("Error fetching vehicle details for edit view:", error)
    next(error)
  }
}

/* ***************************
 *  Update an inventory item
 * ************************** */
invCont.updateVehicle = async function (req, res, next) {
  try {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    const updateResult = await invModel.updateVehicle(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
    if (updateResult) {
      req.flash("notice", "Vehicle updated successfully.")
      res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Failed to update vehicle.")
      res.redirect(`/inv/edit/${inv_id}`)
    }
  } catch (error) {
    console.error("Error updating vehicle:", error)
    req.flash("notice", "An error occurred while updating the vehicle.")
    res.redirect(`/inv/edit/${req.body.inv_id}`)
  }
}

/* ***************************
 *  Build the delete confirmation view for an inventory item
 * ************************** */
invCont.buildDeleteView = async function (req, res, next) {
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

    res.render("./inventory/delete-vehicle", {
      title: "Delete " + vehicle.inv_make + " " + vehicle.inv_model,
      nav,
      vehicle,
    })
  } catch (error) {
    console.error("Error fetching vehicle details for delete view:", error)
    next(error)
  }
}

/* ***************************
 *  Delete an inventory item
 * ************************** */
invCont.deleteVehicle = async function (req, res, next) {
  try {
    const inv_id = req.body.inv_id
    const deleteResult = await invModel.deleteVehicle(inv_id)
    if (deleteResult) {
      req.flash("notice", "Vehicle deleted successfully.")
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Failed to delete vehicle.")
      res.redirect(`/inv/delete/${inv_id}`)
    }
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    req.flash("notice", "An error occurred while deleting the vehicle.")
    res.redirect(`/inv/delete/${req.body.inv_id}`)
  }
}

module.exports = invCont