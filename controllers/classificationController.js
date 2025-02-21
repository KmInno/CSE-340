const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

const classificationModel = require("../models/classification-model")

/* ****************************************
 *  Build the new classification view
 **************************************** */
async function buildpage(req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/new_classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
 *  Add a new classification
 **************************************** */
async function addClassification(req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const addResult = await classificationModel.addClassification(classification_name)

  if (addResult) {
    req.flash(
      "notice",
      `Congratulations, ${classification_name} has been added to the database`
    )
    res.status(201).render("inventory/new_classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the classification failed.")
    res.status(501).render("inventory/new_classification", {
      title: "Add Classification",
      nav,
      errors: [{ msg: "Failed to add classification." }]
    })
  }
}

/* ****************************************
 *  Load the management page
 **************************************** */
async function management(req, res, next) {
  let nav = await utilities.getNav()
  const classifications = await invModel.getClassifications()
  console.log("Classifications:", classifications)

  res.render("inventory/management", {
    title: "Vehicle management",
    nav,
    classifications: classifications.rows,
    errors: null,
  })
}

module.exports = { buildpage, management, addClassification }