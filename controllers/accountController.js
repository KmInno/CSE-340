const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }

async function buildSignup(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/signup", {
      title: "Sign Up",
      nav,
      error:null,
    })
  }

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before saving it to the database
  const hashedPassword = await bcrypt.hash(account_password, 10)

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword // Save the hashed password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    console.log('account_password:', account_password)
    console.log('accountData.account_password:', accountData.account_password)
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      // Set session data
      req.session.clientData = {
        account_firstname: accountData.account_firstname,
        account_lastname: accountData.account_lastname,
        account_email: accountData.account_email,
        account_type: accountData.account_type, // Add account type
        account_id: accountData.account_id, // Add account id
        // Add any other necessary data
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error('Error during login:', error)
    req.flash("notice", "An error occurred during login. Please try again later.")
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }
}

async function accountDashboard(req, res, next) {
  let nav = await utilities.getNav()
  if (!res.locals.clientData) {
    req.flash("notice", "Please log in to view your dashboard.")
    return res.redirect("/account/login")
  }
  res.render("account/dashboard", {
    title: "Dashboard",
    nav,
    errors: null,
    accountData: res.locals.clientData,
  })
  
}

/* ****************************************
 *  Process logout request
 * ************************************ */
function logout(req, res) {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err)
      return res.redirect('/')
    }
    res.clearCookie('jwt')
    res.clearCookie('sessionId')
    res.redirect('/')
  })
}


async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const accountId = req.params.accountId
  const accountData = await accountModel.getAccountById(accountId)
  if (accountData.rows.length === 0) {
    req.flash("notice", "Account not found.")
    return res.redirect("/account/")
  }
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    errors: null,
    accountData: accountData.rows[0],
  })
}

/* ****************************************
 *  Process account update request
 * ************************************ */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email } = req.body
  const accountId = req.params.accountId

  const updateResult = await accountModel.updateAccount(
    accountId,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(500).render("account/update", {
      title: "Update Account Information",
      nav,
      accountData: {
        account_id: accountId,
        account_firstname,
        account_lastname,
        account_email
      },
      errors,
    })
  }
}

/* ****************************************
 *  Process password update request
 * ************************************ */
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { new_password } = req.body
  const accountId = req.params.accountId

  // Hash the new password before saving it to the database
  const hashedPassword = await bcrypt.hash(new_password, 10)

  const updateResult = await accountModel.updatePassword(
    accountId,
    hashedPassword
  )

  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(500).render("account/update", {
      title: "Update Account Information",
      nav,
      errors,
      accountData: {
        account_id: accountId
      }
    })
  }
}

module.exports = { buildLogin, buildSignup, registerAccount, accountLogin, accountDashboard, logout, buildUpdateAccount, updateAccount, updatePassword }
