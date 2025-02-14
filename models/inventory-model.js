const pool = require("../database/")



/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}


async function getVehicleDetails(inv_id) {
  try {
    const result = await pool.query(
      `SELECT * FROM public.inventory
       WHERE inv_id = $1`,
      [inv_id]
    );
    return result.rows;
  } catch (error) {
    console.error("getVehicleDetails error:", error);
    // Re-throw the error to propagate it to the caller
    throw new Error("Failed to retrieve vehicle details");
  }
}


/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* *****************************
insert new vehicle
*************************** */

async function newVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = "INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    const result = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id])
    return result.rows[0] // Return the inserted row
  } catch (error) {
    console.error("Error registering account:", error)
    return null // Return null if there is an error

  }

}




module.exports = { getClassifications, newVehicle, getVehicleDetails, getInventoryByClassificationId }