const pool = require("../database/")

/* *****************************
add new classification to the database
*************************** */

async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        const result = await pool.query(sql, [classification_name])
        return result.rows[0] // Return the inserted row
    }
    catch (error) {
        console.error("Error adding classification:", error)
        return null // Return null if there is an error
    }
}

module.exports = { addClassification }