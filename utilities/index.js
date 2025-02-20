const invModel = require("../models/inventory-model")
const express = require("express")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  // console.log(data)
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* ************************
 * vehicle details
 ************************** */

Util.vehicleDetails = function (vehicle) {
  let details = '<div class="vehicle-details">'
  details += '<img src="' + vehicle.inv_image + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' on CSE Motors" />'
  details += '<div class="car-text">'
  details += '<p><strong>' + vehicle.inv_make + ' ' + vehicle.inv_model + '</strong></p>'
  details += '<p><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
  details += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
  details += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
  details += '<p><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles</p>'
  details += '</div>'

  details += '</div>'
  return details
}

Util.handleError = function (asyncFunction) {
  return async function (req, res, next) {
    try {
      await asyncFunction(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
*  Check Login
* ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
*  Check Login Status
* ************************************ */
Util.checkLoginStatus = (req, res, next) => {
  if (req.session && req.session.clientData) {
    res.locals.loggedIn = true
    res.locals.clientData = req.session.clientData
  } else {
    res.locals.loggedIn = false
    res.locals.clientData = null
  }
  next()
}

/* ****************************************
*  Check Account Type
* ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData && (res.locals.accountData.account_type === 'Employee' || res.locals.accountData.account_type === 'Admin')) {
    next()
  } else {
    req.flash("notice", "You do not have permission to access this page.")
    return res.redirect("/account/login")
  }
}

module.exports = Util