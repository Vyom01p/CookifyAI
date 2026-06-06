import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";

// Import Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import pantryRoutes from "./routes/pantry.js";
import recipeRoutes from "./routes/recipes.js";
import mealPlanRoutes from "./routes/mealPlans.js";
import shoppingListRoutes from "./routes/shoppingList.js";

const app = express();

// Middleware - UPDATED WITH YOUR VERCEL URL
app.use(
  cors({
    origin: ["http://localhost:5173", "https://cookifyai.vercel.app"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "AI Recipe Generator API" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/pantry", pantryRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/meal-plans", mealPlanRoutes);
app.use("/api/shopping-list", shoppingListRoutes);

// --- GLOBAL ERROR HANDLER ---
// This catches anything sent via next(error) in your controllers
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error for your own debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    // Only show stack trace in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
// ----------------------------

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
