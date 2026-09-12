# Planexa AI

Planexa AI is a full-stack AI-powered project management application that helps users manage projects and tasks, track project progress, and generate development tasks using OpenAI.

## Live Demo

https://planexa-ai-frontend.onrender.com

## GitHub Repository

https://github.com/chanakyadarahas/planexa-Ai

---

## Features

### Authentication
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Protected routes
- User-specific project ownership
- Logout functionality

### Dashboard
- Total projects
- Total tasks
- Completed tasks
- Pending tasks
- Overdue tasks
- Project and task progress overview

### Project Management
- Create projects
- View projects
- Edit projects
- Delete projects
- Project descriptions
- Project start and due dates
- Project status
- Automatic project progress calculation

### Task Management
- Create tasks
- View tasks
- Edit tasks
- Delete tasks
- Assign tasks to projects
- Task descriptions
- Task priority
- Task status
- Task due dates
- Search tasks
- Filter tasks

### AI Features
- Generate development tasks from a project idea using OpenAI
- AI-generated task suggestions
- Integration with the OpenAI API

---

## Tech Stack

### Frontend
- React
- JavaScript
- JSX
- CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt
- Axios
- OpenAI API

### Database
- PostgreSQL
- Supabase

### Development Tools
- Visual Studio Code
- Git
- GitHub
- Postman

### Deployment
- Render
- Supabase


## Running the Project Locally

Follow the steps below to run Planexa AI on your local machine.

### 1. Clone the Repository
```bash
Clone the GitHub repository:
git clone https://github.com/chanakyadarahas/planexa-Ai.git

2. Navigate into the Project
cd planexa-Ai

Backend Setup
3. Navigate to the Server Directory
cd server

4. Install Backend Dependencies
npm install

5. Create the .env File
Create a .env file inside the server directory and add the required environment variables:

OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_connection_string


6. Start the Backend
npm start

The backend will run on:

http://localhost:5000
Frontend Setup

Open another terminal while keeping the backend running.

7. Navigate to the Client Directory From the project root:
cd client

8. Install Frontend Dependencies
npm install

9. Start the React Development Server
npm run dev

The frontend will be available at the URL provided by Vite, typically:
http://localhost:5173

Project Structure:

planexa-Ai/
│
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── dashboardController.js
│   │   └── aiController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── aiRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── db/
│   │   └── connection.js
│   │
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md

Future Improvements

Potential future improvements include:

Advanced dashboard analytics
More AI-powered project planning features
Notifications and reminders
Team collaboration
Role-based permissions
Improved error handling
Additional project and task analytics

Author

Chanakya Darahas

GitHub:
https://github.com/chanakyadarahas