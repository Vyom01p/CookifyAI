# 🍳 CookifyAI

A full-stack AI-powered recipe generation and meal planning platform. Built to make cooking smarter, easier, and more personalized.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## 📋 Overview

CookifyAI is a comprehensive AI-powered recipe and meal planning web application. It lets users generate personalized recipes using Google Gemini AI based on ingredients they already have, manage their pantry, plan weekly meals, and auto-generate shopping lists — all in one place.

Built with a clean REST API backend and a fully responsive React frontend, CookifyAI delivers a modern, seamless cooking companion experience.

---

## ✨ Features

### 👤 User Features

**Account Management**

- User registration and login with JWT authentication
- Password reset functionality
- Profile management via Settings page
- Secure encrypted passwords

**AI Recipe Generation**

- Generate recipes using Google Gemini AI
- Use ingredients directly from your pantry or enter custom ones
- Set dietary preferences — Vegetarian, Vegan, Gluten-Free, Dairy-Free, Keto, Paleo
- Choose cuisine type and number of servings
- Save AI-generated recipes to your collection

**Pantry Management**

- Add and track ingredients with quantities and units
- Set expiry dates and get expiry warnings
- Filter ingredients by category — Vegetables, Fruits, Dairy, Meat, Spices, Grains
- Search ingredients instantly

**Recipe Collection**

- Browse and search your saved recipes
- Filter by cuisine type and difficulty
- View full recipe details — ingredients, steps, cook time, servings

**Meal Planner**

- Plan breakfast, lunch, and dinner for every day of the week
- Navigate between weeks
- Add recipes to any meal slot
- Remove meals from the plan

**Shopping List**

- Auto-generate shopping lists from planned meals
- Add custom items manually
- Track what you've bought

**Dashboard**

- Overview of total recipes, pantry items, and meals planned this week
- Quick access to Generate and Pantry
- Recent recipes and upcoming meals at a glance

---

## 🛠️ Tech Stack

### Frontend

- **React** — Component-based UI
- **React Router** — Client-side routing
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Icon library
- **Axios** — HTTP client
- **date-fns** — Date utilities
- **React Hot Toast** — Notifications

### Backend

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **PostgreSQL** — Relational database
- **JWT** — Secure authentication

### AI

- **Google Gemini API** — AI-powered recipe generation

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (local or cloud instance)
- Google Gemini API key
- npm or yarn

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/Vyom01p/CookifyAI.git
cd CookifyAI
```

**2. Install backend dependencies**

```bash
cd backend
npm install
```

**3. Install frontend dependencies**

```bash
cd ../frontend
npm install
```

**4. Environment Configuration**

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/cookifyai

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=90d

# Google Gemini
GEMINI_API_KEY=your-gemini-api-key
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

**5. Set up the database**

```bash
cd backend
npm run db:migrate
```

**6. Start the application**

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

---

## 📁 Project Structure

```
CookifyAI/
│
├── frontend/
│ ├── src/
│ │ ├── components/ # Shared components (Navbar, etc.)
│ │ ├── pages/ # Page components
│ │ │ ├── Dashboard.jsx
│ │ │ ├── Generate.jsx
│ │ │ ├── Recipes.jsx
│ │ │ ├── Pantry.jsx
│ │ │ ├── MealPlanner.jsx
│ │ │ ├── Shopping.jsx
│ │ │ ├── Settings.jsx
│ │ │ └── Login.jsx
│ │ ├── context/ # Auth context
│ │ ├── services/ # API service layer
│ │ └── main.jsx
│ ├── public/
│ └── package.json
│
├── backend/
│ ├── controllers/ # Route controllers
│ │ ├── authController.js
│ │ ├── recipeController.js
│ │ ├── pantryController.js
│ │ ├── mealPlanController.js
│ │ └── shoppingController.js
│ ├── routes/ # API routes
│ ├── models/ # Database models
│ ├── middleware/ # Auth & error middleware
│ ├── utils/ # Utility functions
│ ├── app.js
│ └── server.js
│
├── .gitignore
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

POST /api/v1/users/signup # Register new user
POST /api/v1/users/login # Login
GET /api/v1/users/logout # Logout
PATCH /api/v1/users/updateMe # Update profile

### Recipes

GET /api/v1/recipes # Get all recipes
GET /api/v1/recipes/:id # Get single recipe
POST /api/v1/recipes/generate # Generate recipe with Gemini AI
DELETE /api/v1/recipes/:id # Delete recipe
GET /api/v1/recipes/stats # Recipe stats
GET /api/v1/recipes/recent # Recent recipes

### Pantry

GET /api/v1/pantry # Get all pantry items
POST /api/v1/pantry # Add pantry item
PATCH /api/v1/pantry/:id # Update pantry item
DELETE /api/v1/pantry/:id # Delete pantry item
GET /api/v1/pantry/stats # Pantry stats

### Meal Plans

GET /api/v1/meal-plans/weekly # Get weekly meal plan
POST /api/v1/meal-plans # Add meal to plan
DELETE /api/v1/meal-plans/:id # Remove meal from plan
GET /api/v1/meal-plans/stats # Meal plan stats
GET /api/v1/meal-plans/upcoming # Upcoming meals

### Shopping

GET /api/v1/shopping # Get shopping list
POST /api/v1/shopping # Add item
PATCH /api/v1/shopping/:id # Update item
DELETE /api/v1/shopping/:id # Delete item

---

## 🔒 Security Features

- **JWT Authentication** — Secure token-based sessions
- **Password Encryption** — Bcrypt hashing
- **Protected Routes** — Auth middleware on all private endpoints
- **Environment Variables** — Sensitive keys kept out of source code
- **Input Validation** — Server-side request validation

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- [Google Gemini](https://deepmind.google/technologies/gemini/) for the AI recipe generation API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first styling system
- [Lucide](https://lucide.dev/) for the clean icon set
- The open-source community for the amazing tools that made this possible
