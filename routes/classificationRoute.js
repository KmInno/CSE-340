const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const classificationController = require("../controllers/classificationController")
// const regValidate = require("../utilities/classification-validation")

// Define the "GET" route for "add classification"

router.get("/", utilities.handleError(classificationController.management))

router.get("/new_classification", utilities.handleError(classificationController.buildpage))
router.post("/new_classification", utilities.handleError(classificationController.addClassification))

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;