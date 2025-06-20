# Issue Tracker Backend

This is the backend API for the Issue Tracker application. It is built with Node.js, Express, TypeScript, and MongoDB. The backend provides RESTful endpoints for user authentication, project management, and ticket tracking, supporting both local development and cloud deployment.

## Features
- User registration and authentication (JWT-based)
- Project creation, editing, and team management
- Ticket creation, editing, deletion, assignment, and filtering
- Role-based access (project owner/member)
- CORS support for local and deployed frontends
- MongoDB Atlas integration
- TypeScript for type safety

## Tech Stack
- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT for authentication
- bcryptjs for password hashing
- dotenv for environment variables

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm
- MongoDB Atlas account (or local MongoDB)

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd issue_tracker/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the backend directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000 # or any port you prefer
   ```

### Scripts
- `npm run build` — Compile TypeScript to JavaScript in the `dist/` folder
- `npm start` — Run the compiled server (`dist/server.js`)
- `npm run dev` — Start the server in development mode with hot-reloading (using ts-node-dev)

### Development Workflow
1. For development, use:
   ```bash
   npm run dev
   ```
2. For production build and run:
   ```bash
   npm run build
   npm start
   ```

## API Overview

### Authentication
- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and receive JWT

### Projects
- `GET /api/projects` — List all projects (user must be authenticated)
- `POST /api/projects` — Create a new project
- `PATCH /api/projects/:id` — Edit a project
- `DELETE /api/projects/:id` — Delete a project
- `POST /api/projects/:id/members` — Add a team member
- `DELETE /api/projects/:id/members/:userId` — Remove a team member

### Tickets
- `GET /api/tickets?projectId=...` — List tickets for a project (supports filtering by status, priority, assignee, search)
- `POST /api/tickets` — Create a new ticket
- `PUT /api/tickets/:id` — Edit a ticket
- `DELETE /api/tickets/:id` — Delete a ticket

## Environment Variables
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — Secret for signing JWT tokens
- `PORT` — Port to run the server (default: 5000)

## CORS Configuration
The backend allows requests from:
- `http://localhost:3000` (local frontend)
- `https://issue-tracker-frontend-k6ad.vercel.app` (deployed frontend)

Update the `allowedOrigins` array in `server.ts` if you deploy the frontend elsewhere.

## Deployment
- Build the project: `npm run build`
- Start the server: `npm start`
- Ensure your environment variables are set in your deployment platform (e.g., Render, Heroku)

## Troubleshooting
- **CORS errors:** Make sure your frontend URL is in the `allowedOrigins` array in `server.ts`.
- **MongoDB connection errors:** Check your `MONGODB_URI` in `.env`.
- **JWT/auth errors:** Ensure `JWT_SECRET` is set and matches between backend and frontend.
- **API not responding:** Check logs for errors, ensure the server is running and accessible.

## License
MIT 