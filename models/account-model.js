const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    return result.rows[0] // Return the inserted row
  } catch (error) {
    console.error("Error registering account:", error)
    return null // Return null if there is an error
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* ****************************************
 *  Get account by ID
 * ************************************ */
async function getAccountById(accountId) {
  try {
    const result = await pool.query(
      'SELECT * FROM public.account WHERE account_id = $1',
      [accountId]
    )
    return result
  } catch (error) {
    console.error('Error getting account by ID:', error)
    throw error
  }
}

/* ****************************************
 *  Update account information
 * ************************************ */
async function updateAccount(accountId, account_firstname, account_lastname, account_email) {
  try {
    const result = await pool.query(
      'UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *',
      [account_firstname, account_lastname, account_email, accountId]
    )
    return result.rowCount > 0
  } catch (error) {
    console.error('Error updating account:', error)
    throw error
  }
}

/* ****************************************
 *  Update account password
 * ************************************ */
async function updatePassword(accountId, hashedPassword) {
  try {
    const result = await pool.query(
      'UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *',
      [hashedPassword, accountId]
    )
    return result.rowCount > 0
  } catch (error) {
    console.error('Error updating password:', error)
    throw error
  }
}

module.exports = { registerAccount, getAccountByEmail, getAccountById, updateAccount, updatePassword }