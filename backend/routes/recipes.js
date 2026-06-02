import express from "express";
const router = express.Router();
import * as recipeController from "../controllers/recipeController.js";
import authMiddleware from "../middleware/Auth.js";

//All routes are protected
router.use(authMiddleware);

//AI generation

router.post("/generate", recipeController.generateRecipe);
router.get("/suggestions", recipeController.getPantrySuggestions);

//CRUD Operations

router.get("/", recipeController.getRecipes);
router.get("/recent", recipeController.getRecentRecipes);
router.get("/stats", recipeController.getRecipesStats);
router.get("/:id", recipeController.getRecipeById);
router.post("/", recipeController.saveRecipe);
router.put("/:id", recipeController.updateRecipe);
router.delete("/:id", recipeController.deleteRecipe);

export default router;
