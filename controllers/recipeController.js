const axios = require("axios");
const FavoriteRecipe = require("../models/FavoriteRecipe");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Rating = require("../models/Rating");

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

exports.processImageAndFetchRecipes = async (req, res) => {
  try {
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

exports.addToFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.body;

    const existingFavorite = await FavoriteRecipe.findOne({
      user: userId,
      recipe: recipeId,
    });
    if (existingFavorite) {
      return res.status(400).json({ message: "Recipe already in favorites" });
    }

    const newFavorite = new FavoriteRecipe({
      user: userId,
      recipe: recipeId,
    });

    await newFavorite.save();
    res.status(201).json({ message: "Recipe added to favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch Favorite Recipes for a User
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await FavoriteRecipe.find({ user: userId })
      .populate("recipe")
      .exec();
    const recipeIds = favorites.map((fav) => fav.recipe);

    const recipesPromises = recipeIds.map(async (recipeId) => {
      const response = await axios.get(
        `${BASE_URL}/recipes/${recipeId}/information?apiKey=${API_KEY}`
      );
      return response.data;
    });
    const recipes = await Promise.all(recipesPromises);
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove a recipe from favorites
exports.removeFromFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    // Find and remove the favorite recipe from the database
    await FavoriteRecipe.findOneAndDelete({ user: userId, recipe: recipeId });

    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch Recipe by ID from Spoonacular
exports.fetchRecipeById = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const url = `${BASE_URL}/recipes/${recipeId}/information?apiKey=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch Featured Recipes
exports.fetchFeaturedRecipes = async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/recipes/random?number=10&apiKey=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching featured recipes:", error);
    res.status(500).json({ message: "Failed to fetch featured recipes" });
  }
};

// Fetch Popular Recipes
exports.fetchPopularRecipes = async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/recipes/complexSearch?sort=popularity&number=10&apiKey=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching popular recipes:", error);
    res.status(500).json({ message: "Failed to fetch popular recipes" });
  }
};

exports.searchRecipesByName = async (req, res) => {
  try {
    const { query } = req.query;
    const response = await axios.get(
      `${BASE_URL}/recipes/complexSearch?query=${query}&number=10&apiKey=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error searching recipes by name:", error);
    res.status(500).json({ message: "Failed to search recipes by name" });
  }
};

exports.searchRecipesByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.query;
    const response = await axios.get(
      `${BASE_URL}/recipes/findByIngredients?ingredients=${ingredients}&number=10&apiKey=${API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error searching recipes by ingredients:", error);
    res
      .status(500)
      .json({ message: "Failed to search recipes by ingredients" });
  }
};

exports.getFavoritesCountForRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Find the count of favorites for the specified recipe
    const favoritesCount = await FavoriteRecipe.countDocuments({
      recipe: recipeId,
    });

    res.json({ favoritesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addRatingForRecipe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { recipeId, rating } = req.body;
    console.log(recipeId, rating);
    // Check if the user has already rated the recipe
    const existingRating = await Rating.findOne({
      user: userId,
      recipeId,
    });

    if (existingRating) {
      // If the user has already rated, update the rating
      existingRating.rating = rating;
      await existingRating.save();
    } else {
      // If the user has not yet rated, create a new rating entry
      const newRating = new Rating({
        user: userId,
        rating,
        recipeId,
      });
      await newRating.save();
    }

    res.status(201).json({ message: "Rating added/updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get ratings for a specific recipe
exports.getRatingsForRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Find all ratings for the specified recipe
    const ratings = await Rating.find({ recipeId });

    // Calculate average rating
    const totalRatings = ratings.length; // Count the total number of ratings
    const sumOfRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = totalRatings > 0 ? sumOfRatings / totalRatings : 0;

    res.json({ averageRating, totalRatings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
