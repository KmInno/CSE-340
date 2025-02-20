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

router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleError(accountController.accountLogin)
)

router.get('/', utilities.handleError(accountController.accountDashboard))

// Define the "GET" route for logging out
router.get('/logout', utilities.handleError(accountController.logout))

// Define the "GET" route for updating account information
router.get('/update/:accountId', accountController.buildUpdateAccount)

// Define the "POST" route for updating account information
router.post('/update/:accountId', regValidate.updateAccountRules(), regValidate.checkUpdateData, accountController.updateAccount)

// Define the "POST" route for updating password
router.post('/update-password/:accountId', regValidate.updatePasswordRules(), regValidate.checkPasswordData, accountController.updatePassword)

// Error handler middleware for this route
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Export the router
module.exports = router