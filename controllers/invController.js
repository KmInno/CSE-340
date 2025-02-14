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

// invCont.addVehicle = async function (req, res, next) {
//   let nav = await utilities.getNav()
//   const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

//   const addResult = await invModel.newVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)

//   if (addResult) {
//     req.flash(
//       "notice",
//       `Congratulations, ${inv_make} ${inv_model} has been added to the database`
//     )
//     res.status(201).render("./inventory/new_vehicle", {
//       title: "Add Vehicle",
//       nav,
//     })
//   } else {
//     req.flash("notice", "Sorry, the vehicle failed.")
//     res.status(501).render("./inventory/new_vehicle", {
//       title: "Add Vehicle",
//       nav,
//     })
//   }
// }
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

module.exports = invCont