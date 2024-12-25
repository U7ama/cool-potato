const express = require("express");
const recipeController = require("../controllers/recipeController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/recipe-by-image", auth, recipeController.processImageAndFetchRecipes);
router.post("/add-to-favorites", auth, recipeController.addToFavorites);
router.get("/favorites", auth, recipeController.getFavorites);
router.delete(
  "/remove-from-favorites/:recipeId",
  auth,
  recipeController.removeFromFavorites
);
router.get("/recipe/:recipeId", auth, recipeController.fetchRecipeById);
router.get("/featured-recipes", auth, recipeController.fetchFeaturedRecipes);
router.get("/popular-recipes", auth, recipeController.fetchPopularRecipes);
router.get("/search-by-name", auth, recipeController.searchRecipesByName);
router.get(
  "/search-by-ingredients",
  auth,
  recipeController.searchRecipesByIngredients
);
router.get(
  "/recipes/:recipeId/favoritesCount",
  recipeController.getFavoritesCountForRecipe
);

router.post(
  "/recipes/:recipeId/addRating",
  auth,
  recipeController.addRatingForRecipe
);

// Route for getting ratings for a recipe
router.get("/recipes/:recipeId/ratings", recipeController.getRatingsForRecipe);

module.exports = router;
