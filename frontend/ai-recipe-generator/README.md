🧑‍🍳 CookifyAI
A full-stack, AI-powered culinary companion that transforms your available pantry ingredients into delicious recipes. Built with modern web technologies to deliver a seamless, intelligent cooking and meal-planning experience.

Live Demo: https://cookifyai.vercel.app
Backend API: https://cookifyai.onrender.com

📋 Overview
CookifyAI is a comprehensive recipe generation and kitchen management web application. Instead of wondering what to make for dinner, users can input their current pantry items, and the application leverages the Google Gemini AI API to generate customized recipes.

Featuring a robust backend architecture and a highly responsive React/Vite frontend, CookifyAI provides everything needed to manage ingredients, plan meals, and generate shopping lists. The platform ensures secure authentication, seamless database integration via Neon PostgreSQL, and a smooth user experience.

✨ Features
👤 User Features
Account Management: User registration and login with secure JWT authentication.

Pantry Tracking: Add, edit, and manage ingredients currently available in your kitchen.

AI Recipe Generation: Generate unique, actionable recipes based strictly on your available pantry items using Google's Gemini AI.

Meal Planning: Organize and save generated recipes into structured meal plans for the week.

Smart Shopping Lists: Automatically generate shopping lists for missing ingredients needed for upcoming meal plans.

Responsive Design: Optimized for both mobile and desktop screens for a seamless kitchen-side experience.

🛠️ Tech Stack
Frontend
React.js (Vite) - Lightning-fast frontend build tool and library.

Tailwind CSS - Utility-first CSS framework for rapid, responsive UI styling.

Axios - Promise-based HTTP client for API requests.

Backend
Node.js - JavaScript runtime environment.

Express.js - Fast, unopinionated web framework.

PostgreSQL (Neon) - Serverless cloud relational database.

pg-pool - PostgreSQL client for robust database connections.

AI & Security
Google Gemini API - Advanced Large Language Model for intelligent recipe generation.

JWT (JSON Web Tokens) - Secure, stateless user authentication.

Bcrypt - Password hashing and encryption.

CORS - Secure cross-origin resource sharing configured for strict frontend-backend communication.

🚀 Getting Started
Prerequisites
Node.js (v18 or higher)

PostgreSQL Database (Local or Neon/Supabase cloud instance)

Google Gemini API Key

Installation
Clone the repository

Bash
git clone https://github.com/Vyom01p/CookifyAI.git
cd CookifyAI
Install Backend Dependencies

Bash
cd backend
npm install
Install Frontend Dependencies

Bash
cd ../frontend
npm install
Environment Configuration
Backend (backend/.env):

Code snippet

# Server Configuration

NODE_ENV=development
PORT=8000

# Database (Neon PostgreSQL)

DATABASE_URL=postgresql://<username>:<password>@<endpoint>.neon.tech/neondb?sslmode=require

# JWT Configuration

JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=30d

# AI Configuration

GEMINI_API_KEY=your_google_gemini_api_key
Frontend (frontend/.env):

Code snippet
VITE_API_URL=http://localhost:8000/api
Start the Application
Start the Backend Server:

Bash
cd backend
npm start
Start the Frontend Development Server:

Bash
cd frontend
npm run dev
Access the application at: http://localhost:5173

🔌 API Endpoints
Authentication
POST /api/auth/register - Create a new user account

POST /api/auth/login - User login

Users
GET /api/users/profile - Get current user profile

PUT /api/users/profile - Update user details

Pantry
GET /api/pantry - Get all pantry items for the user

POST /api/pantry - Add a new item to the pantry

DELETE /api/pantry/:id - Remove an item

Recipes
GET /api/recipes - Get user's saved recipes

POST /api/recipes/generate - (AI) Generate a new recipe based on pantry

POST /api/recipes/save - Save a generated recipe

Meal Plans & Shopping List
GET /api/meal-plans - Retrieve weekly meal plans

POST /api/meal-plans - Create a new meal plan

GET /api/shopping-list - View current shopping list

POST /api/shopping-list - Add missing ingredients to list

🚀 Deployment
The application is fully configured for cloud deployment:

Frontend: Deployed on Vercel with routing configured via vercel.json for seamless SPA navigation.

Backend: Deployed on Render utilizing automated continuous integration from the main branch.

Database: Hosted securely on Neon, integrated via internal connection strings.
