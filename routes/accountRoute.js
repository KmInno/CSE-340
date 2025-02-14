const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")


// Define the "GET" route for "My Account"
router.get("/login", utilities.handleError(accountController.buildLogin))
router.get("/signup", utilities.handleError(accountController.buildSignup))
router.post('/signup', 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleError(accountController.registerAccount))


// Error handler middleware for this route
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export the router
module.exports = router;