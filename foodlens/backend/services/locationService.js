const axios = require("axios");
require("dotenv").config();

async function getNearbyHealthyOptions(latitude, longitude) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&type=restaurant&keyword=healthy&key=${process.env.GOOGLE_PLACES_API_KEY}`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching nearby healthy options:", error);
    return null;
  }
}

module.exports = getNearbyHealthyOptions;
