const utilities = require("./")
const invModel = require("../models/inventory-model")

const { body, validationResult } = require("express-validator")
const validate = {}

/* ************************
 * Validate the vehicle form
 ************************** */

validate.vehicleRules = () => {

    return [
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a vehicle make."), // on error this message is 

        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a vehicle model."),

        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 1886, max: new Date().getFullYear() + 1 }) // The first car was invented in 1886, and the max year is next year
            .withMessage("Please provide a valid vehicle year."),

        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a vehicle description."),

        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a valid vehicle image URL."),

        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a valid vehicle thumbnail URL."),

        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isFloat({ min: 0 })
            .withMessage("Please provide a valid vehicle price."),

        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isInt({ min: 0 })
            .withMessage("Please provide a valid vehicle mileage."),

        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a vehicle color."),

        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .isInt()
            .withMessage("Please provide a valid classification ID.")
    ]

}

validate.checkCarData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    const classifications = await invModel.getClassifications() // Fetch classifications again
    
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/new_vehicle", {
            errors,
            title: "Add Vehicle",
            nav,
            classifications: classifications.rows,
            inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
        })
        return
    }
    next()
}

module.exports = validate