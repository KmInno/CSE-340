const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required."),

    body("account_password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches('[0-9]')
      .withMessage('Password must contain at least one number.')
      .matches('[A-Z]')
      .withMessage('Password must contain at least one uppercase letter.')
      .matches('[a-z]')
      .withMessage('Password must contain at least one lowercase letter.')
  ]
}

/*  **********************************
*  Account Update Validation Rules
* ********************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
  ]
}

/* ****************************************
 *  Password Validation Rules
 * ************************************ */
validate.passwordRules = () => {
  return [
    body('new_password')
      .trim()
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long.')
      .matches('[0-9]')
      .withMessage('Password must contain at least one number.')
      .matches('[A-Z]')
      .withMessage('Password must contain at least one uppercase letter.')
      .matches('[a-z]')
      .withMessage('Password must contain at least one lowercase letter.')
  ]
}

/*  **********************************
*  Password Update Validation Rules
* ********************************* */
validate.updatePasswordRules = () => {
  return [
    body("new_password")
      .trim()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long.")
      .matches('[0-9]')
      .withMessage('Password must contain at least one number.')
      .matches('[A-Z]')
      .withMessage('Password must contain at least one uppercase letter.')
      .matches('[a-z]')
      .withMessage('Password must contain at least one lowercase letter.')
  ]
}

/* ************************
 * Validate login form
 ************************** */
validate.loginRules = () => {
  return [
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required."),
    
    body("account_password")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a password.")
  ]
}

/* ******************************
* Check validation results
* ***************************** */
validate.checkRegData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.status(400).render('account/register', {
      errors: errors.array(),
      title: 'Registration',
      nav,
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email
    })
  }
  next()
}

validate.checkLoginData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.status(400).render('account/login', {
      errors: errors.array(),
      title: 'Login',
      nav,
      account_email: req.body.account_email
    })
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.status(400).render('account/update', {
      errors: errors.array(),
      title: 'Update Account Information',
      nav,
      accountData: req.body
    })
  }
  next()
}

validate.checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.status(400).render('account/update', {
      errors: errors.array(),
      title: 'Update Account Information',
      nav,
      accountData: req.body
    })
  }
  next()
}

module.exports = validate