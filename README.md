# Edunet-EY Project 6
# Recipe App (MERN Stack)

## Overview
The **Recipe App** is a full-stack web application built using the **MERN** (MongoDB, Express.js, React.js, Node.js) stack. This app allows users to browse, add, update, and delete recipes, making it easy to manage and share cooking ideas.

## Features
- ✅ User authentication (Login/Register)
- ✅ Create, Read, Update, and Delete (CRUD) operations for recipes
- ✅ Search recipes by title or ingredients
- ✅ Responsive and user-friendly UI

## 🛠 Tech Stack
### Frontend
- ⚡ **React.js** (with Vite for fast development)
- 🔀 **React Router** for navigation
- 📡 **Axios** for API requests
- 🎨 **CSS** for styling (or TailwindCSS if applicable)

### Backend
- 🟢 **Node.js** with Express.js
- 🗄 **MongoDB** with Mongoose for database management
- 🔒 **JWT authentication** for secure login

## 🚀 Installation
### Prerequisites
Ensure you have the following installed on your system:
- 🖥 **Node.js**
- 🛢 **MongoDB** (local or cloud-based, e.g., MongoDB Atlas)
  
### Clone the Repository
```sh
git clone https://github.com/Sushant2253/Recipe-App-Edunet-EY.git
cd simple-recipe-app
```

### Install Dependencies
- Backend
```sh
  cd backend
  npm install
```
- Frontend
```sh
  cd frontend
  npm install
```
### ⚙ Environment Variables
- Create a .env file in the backend directory and add:
```sh
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Running the Application

- Start backend server
```sh
cd backend
node server.js
```

- Start frontend server
```sh
cd frontend
npm run dev
```



