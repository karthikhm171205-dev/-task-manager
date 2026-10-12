# 📝 Task Manager — Full-Stack Web Application

A full-stack **Task Management Web Application** that allows users to securely create, view, update, and delete tasks. The application includes user authentication and authorization, a responsive React frontend, a Node.js/Express backend, and MongoDB Atlas for persistent data storage.

## 🚀 Live Demo

**Frontend:**
https://task-manager-frontend-7qxt.onrender.com/

## 📌 Project Overview

The Task Manager application is designed to help users organize and track their daily tasks efficiently.

Users can create an account, log in securely, and manage their own tasks through a simple and responsive interface. The backend provides RESTful APIs for authentication and task management, while MongoDB Atlas stores user and task information.

## ✨ Features

### 🔐 Authentication & Authorization

* User registration
* User login
* Password hashing using bcrypt
* JWT-based authentication
* Protected API routes
* User-specific task access
* Authorization middleware

### ✅ Task Management

* Create new tasks
* View tasks
* Update tasks
* Delete tasks
* Associate tasks with individual users
* Track task information

### 🎨 Frontend

* Responsive React interface
* Clean and simple UI
* API integration with backend
* Login and registration pages
* Task management interface
* Mobile-friendly design

### ⚡ Backend

* RESTful API
* Express.js server
* Authentication middleware
* Task CRUD APIs
* MongoDB database integration
* CORS configuration
* Environment variable support

## 🧰 Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Vite

### Backend

* Node.js
* Express.js
* REST API
* JWT
* bcryptjs
* CORS
* dotenv

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

### Deployment & Tools

* Render
* Git
* GitHub
* VS Code
* Postman / API testing tools

## 🏗️ Application Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      (Vite)         │
                    └──────────┬──────────┘
                               │
                         REST API Requests
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │      Backend        │
                    └──────────┬──────────┘
                               │
                    Authentication &
                     Task Operations
                               │
                               ▼
                    ┌─────────────────────┐
                    │    MongoDB Atlas    │
                    │       Database      │
                    └─────────────────────┘
```

## 📁 Project Structure

```text
task-manager/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   │
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/karthikhm171205-dev/-task-manager.git
```

```bash
cd task-manager
```

## 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

## 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/register` | Register a new user            |
| POST   | `/api/auth/login`    | Login user                     |
| GET    | `/api/auth/profile`  | Get authenticated user profile |

### Tasks

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/tasks`     | Get user's tasks  |
| POST   | `/api/tasks`     | Create a new task |
| PUT    | `/api/tasks/:id` | Update a task     |
| DELETE | `/api/tasks/:id` | Delete a task     |

Protected endpoints require a valid JWT authentication token.

## 🔐 Authentication Flow

```text
User Registration
       ↓
Password hashed using bcrypt
       ↓
User stored in MongoDB
       ↓
User Login
       ↓
Credentials verified
       ↓
JWT Token Generated
       ↓
Token sent with protected requests
       ↓
Authentication Middleware
       ↓
Authorized API Access
```

## 🗄️ Database

The application uses **MongoDB Atlas** to store application data.

### User

```text
User
├── name
├── email
├── password
└── timestamps
```

### Task

```text
Task
├── title
├── description
├── status
├── user
└── timestamps
```

Each task is associated with the user who created it, ensuring that users can access their own tasks securely.

## 🌍 Deployment

The frontend is deployed on **Render**.

### Live Application

https://task-manager-frontend-7qxt.onrender.com/

The backend is deployed separately and the frontend communicates with the backend through REST APIs.

For production deployment, environment variables such as the MongoDB connection string and JWT secret should be configured through the hosting platform and should **not** be committed to GitHub.

## 📸 Screenshots

Add screenshots of your application here:

```markdown
![Login Page](screenshots/login.png)

![Dashboard](screenshots/dashboard.png)

![Task Management](screenshots/tasks.png)
```

## 🔮 Future Improvements

* Real-time task updates using WebSockets
* Task due dates and reminders
* Task priorities
* Task categories
* Search and filtering
* Email notifications
* Dark/light mode
* Admin dashboard
* Improved analytics and task statistics
* Progressive Web App support

## 🎯 Learning Outcomes

This project helped me gain practical experience in:

* Full-stack web development
* React.js frontend development
* Node.js and Express.js backend development
* REST API development
* MongoDB database integration
* JWT authentication
* Password hashing
* Protected routes
* CRUD operations
* API integration
* Deployment using Render
* Git and GitHub

## 👨‍💻 Author

**Karthik H M**

CSE AIML Student

### Links

* GitHub: https://github.com/karthikhm171205-dev
* Live Project: https://task-manager-frontend-7qxt.onrender.com/

---

⭐ If you find this project useful, consider giving the repository a star!

**Built with React, Node.js, Express.js and MongoDB.**
