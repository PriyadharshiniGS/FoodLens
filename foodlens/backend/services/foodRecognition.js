const axios = require("axios");
const User = require("../models/User"); // Import User model
require("dotenv").config();

async function recognizeFood(imageUri, userId) {
  try {
    const response = await axios.post(
      `https://api.spoonacular.com/food/images/analyze?apiKey=${process.env.SPOONACULAR_API_KEY}`,
      { image: imageUri }
    );

    // Fetch nutritional data based on recognized food
    const foodId = response.data.foods[0].id; // Assuming the first food item is the one we want
    const nutritionResponse = await axios.get(
      `https://api.spoonacular.com/food/ingredients/${foodId}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`
    );

    // Store recognized food data in the database
    const foodData = {
      foodData: response.data,
      nutritionalInfo: nutritionResponse.data,
      userId: userId, // Associate with user
    };

    // Save food data to the user's record
    const user = await User.findById(userId);
    if (user) {
      user.recognizedFoods.push(foodData); // Assuming recognizedFoods is an array in the User model
      await user.save();
    }

    return foodData;
  } catch (error) {
    console.error("Error recognizing food:", error);
    return null;
  }
}

module.exports = recognizeFood;
