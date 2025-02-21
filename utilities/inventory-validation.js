const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const validate = {}

/*  **********************************
*  Inventory Data Validation Rules
* ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Please provide a make."),

    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Please provide a model."),

    body("inv_year")
      .trim()
      .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid year."),

    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .isURL()
      .withMessage("Please provide a valid image URL."),

    body("inv_thumbnail")
      .trim()
      .isURL()
      .withMessage("Please provide a valid thumbnail URL."),

    body("inv_price")
      .trim()
      .isFloat({ min: 0 })
      .withMessage("Please provide a valid price."),

    body("inv_miles")
      .trim()
      .isInt({ min: 0 })
      .withMessage("Please provide a valid mileage."),

    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Please provide a color."),

    body("classification_id")
      .trim()
      .isInt({ min: 1 })
      .withMessage("Please provide a valid classification ID.")
  ]
}

/*  **********************************
*  Classification Validation Rules
* ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .matches(/^[A-Z]+$/)
      .withMessage("Classification name must be all uppercase letters with no spaces.")
  ]
}

/* ******************************
* Check validation results
* ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const classifications = await invModel.getClassifications()
    let nav = await utilities.getNav()
    return res.status(400).render('inventory/edit-vehicle', {
      errors: errors.array(),
      title: 'Edit Vehicle',
      vehicle: req.body,
      classifications: classifications.rows,
      nav
    })
  }
  next()
}

/* ******************************
* Check validation results
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.status(400).render('inventory/new_classification', {
      errors: errors.array(),
      title: 'Add New Classification',
      nav
    })
  }
  next()
}

module.exports = validate