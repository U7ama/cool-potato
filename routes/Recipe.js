const express = require("express");
const recipeController = require("../controllers/recipeController");

const router = express.Router();

router.post("/process-image", recipeController.processImageAndFetchRecipes);

module.exports = router;
