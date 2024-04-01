const axios = require("axios");
const Recipe = require("../models/Recipe");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = "https://api.spoonacular.com";

async function identifyIngredients(base64Image) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  const prompt =
    "Identify all foods and ingredients you see in the image. Also keep in mind i have to give these names to spoonacular api. If you cannot identify certain items, write 'unknown' instead of giving inaccurate items. Give every item separated by comma in your response";

  const imageParts = [
    {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    },
  ];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  console.log(response.text());
  return response.text();
}

async function fetchRecipes(ingredients) {
  const ingredientsQuery = ingredients.join(",");
  const response = await axios.get(
    `${BASE_URL}/recipes/findByIngredients?ingredients=${ingredientsQuery}&apiKey=${API_KEY}`
  );
  console.log("response", response);
  return response.data;
}

async function saveRecipes(recipes) {
  // Loop through recipes and save them to MongoDB
  for (const recipe of recipes) {
    const newRecipe = new Recipe({
      title: recipe.title,
      ingredients: recipe.usedIngredients.map((ing) => ing.name),
      instructions: "", // You might need another API call to get detailed instructions
      image: recipe.image,
      sourceUrl: recipe.sourceUrl,
    });
    await newRecipe.save();
  }
}

exports.processImageAndFetchRecipes = async (req, res) => {
  try {
    // Assuming the base64 image is sent in the body with the key 'image'
    const ingredientsString = await identifyIngredients(req.body.image);
    const ingredients = ingredientsString.split(",").map((item) => item.trim());
    console.log("ingredients", ingredients);
    const recipes = await fetchRecipes(ingredients);

    res.json({
      success: true,
      message: "Recipes fetched and saved successfully",
      recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};
