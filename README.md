
# AssignHub – Student, Group & Assignment Management System

AssignHub is a full-stack web application designed to simplify student group management and assignment tracking.

It provides a platform where students can create groups, add members, access assigned assignments, and confirm their submissions. Administrators can manage students, groups, and assignments while monitoring submission progress through a centralized dashboard.

## Repository

**GitHub:** [AssignHub – GitHub Repository](https://github.com/Gaurav-Rawat28437/AssignHub-Student-Group-Assignment-Management-System)

## Features

### Student Features
- Student registration and login.
- Create and manage groups.
- Add students to groups using their email addresses.
- View group details and members.
- View assigned assignments and OneDrive links.
- Confirm assignment submissions through a two-step confirmation process.
- Track assignment completion status.

### Admin Features
- Dashboard with overall application statistics.
- View and search registered students.
- View and manage student groups.
- Create and edit assignments.
- Assign assignments to all groups or selected groups.
- Track assignment submission confirmations.
- View group-wise and student-wise submission progress.



## Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- Lucide React
- React Hot Toast

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcryptjs

### Tools & Development
- Docker and Docker Compose
- Git and GitHub
- VS Code
- Postman

## Project Structure

```text
AssignHub-Student-Group-Assignment-Management-System/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── prisma/
│   ├── routes/
│   ├── scripts/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── docker-compose.yml
└── README.md
```



## Installation and Setup

Follow these steps to run AssignHub locally.

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Docker Desktop
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Gaurav-Rawat28437/AssignHub-Student-Group-Assignment-Management-System.git

cd AssignHub-Student-Group-Assignment-Management-System
```

### 2. Start PostgreSQL Database

Run this command from the project root:

```bash
docker compose up -d
```

This starts the PostgreSQL database using Docker.

### 3. Backend Setup

Navigate to the backend folder:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
DATABASE_URL="postgresql://postgres:YOUR_DB_PASSWORD@localhost:5432/joineazy?schema=public"
JWT_SECRET="your_secure_secret"
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

Replace `YOUR_DB_PASSWORD` with the PostgreSQL password configured in `docker-compose.yml`.

Generate Prisma Client and apply database migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

Start the backend server:

```bash
npm run dev
```

Backend URL:

http://localhost:5000

### 4. Frontend Setup

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

Frontend URL:

http://localhost:5173

### 5. Open the Application

Make sure Docker, the backend server, and the frontend server are running.

Open the following URL in your browser:

http://localhost:5173



## API Documentation

Base URL:

```text
http://localhost:5000/api
```

### 1. Authentication APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/auth/register` | Register a new student | Public |
| POST | `/auth/login` | Login to an account | Public |
| POST | `/auth/logout` | Logout from an account | Authenticated |
| GET | `/users/profile` | Get logged-in user profile | Authenticated |

### 2. Student Management APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/users/students` | Get all registered students | Admin |

### 3. Group Management APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/groups` | Create a new group | Authenticated |
| GET | `/groups/my-groups` | Get user's groups | Authenticated |
| GET | `/groups/:groupId` | Get group details and members | Authenticated |
| POST | `/groups/:groupId/members` | Add a student using email | Authenticated |
| DELETE | `/groups/:groupId` | Delete a group | Group creator |
| GET | `/groups/all` | Get all groups | Admin |

### 4. Assignment Management APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/assignments` | Create a new assignment | Admin |
| GET | `/assignments` | Get all assignments | Admin |
| PUT | `/assignments/:id` | Update an assignment | Admin |
| GET | `/assignments/my-assignments` | Get assignments available to a student | Authenticated |
| POST | `/assignments/:id/confirm` | Confirm assignment submission | Authenticated |
| GET | `/assignments/:id/progress` | Get assignment submission progress | Admin |

### 5. Analytics API

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/analytics` | Get dashboard statistics | Admin |



## Authentication and Authorization

AssignHub uses JWT-based authentication and role-based authorization to protect application resources.

- **JWT Authentication:** JSON Web Tokens are used to authenticate users.
- **HTTP-only Cookies:** Authentication tokens are stored in HTTP-only cookies.
- **Password Security:** Passwords are hashed using bcryptjs before being stored in the database.
- **Role-Based Access:** The application supports two roles: `STUDENT` and `ADMIN`.
- **Protected Routes:** Authenticated users can access protected API endpoints.
- **Admin Authorization:** Admin-only endpoints require the user to have the `ADMIN` role.
- **Credential Handling:** Axios sends cookies with API requests, and Express CORS is configured to allow credentials.



## Database Design

AssignHub uses PostgreSQL as its relational database and Prisma ORM for database operations.

### Database Models

| Model | Description |
|---|---|
| User | Stores student and admin account information. |
| Group | Stores group details and creator information. |
| GroupMember | Connects students with their groups. |
| Assignment | Stores assignment details, descriptions, due dates, and OneDrive links. |
| AssignmentGroup | Connects assignments with their assigned groups. |
| Submission | Tracks individual student submission confirmations. |

### Entity Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Group : creates
    User ||--o{ GroupMember : joins
    Group ||--o{ GroupMember : contains

    User ||--o{ Assignment : creates
    Assignment ||--o{ AssignmentGroup : assigned
    Group ||--o{ AssignmentGroup : receives

    User ||--o{ Submission : confirms
    Group ||--o{ Submission : tracks
    Assignment ||--o{ Submission : has
```

### Database Relationships

- One user can create multiple groups.
- Students can join multiple groups through `GroupMember`.
- One admin can create multiple assignments.
- Assignments can be assigned to multiple groups through `AssignmentGroup`.
- Each submission record connects a student, a group, and an assignment.
- The unique constraints prevent duplicate group memberships, assignment-group assignments, and submission records for the same student, group, and assignment.



## Application Architecture

AssignHub follows a client-server architecture with a React frontend, Express.js backend, and PostgreSQL database.

### Request Flow

1. The user interacts with the React frontend.
2. Axios sends HTTP requests to the Express.js backend.
3. Express routes direct requests to the appropriate controllers.
4. Authentication middleware validates JWT cookies and checks user permissions.
5. Controllers use Prisma ORM to perform database operations.
6. PostgreSQL stores and retrieves application data.
7. The backend returns responses to the frontend, which updates the user interface.

### Architecture Overview

```mermaid
flowchart TD
    A[User] --> B[React Frontend]
    B --> C[Axios API Requests]
    C --> D[Express.js Backend]
    D --> E[Authentication Middleware]
    E --> F[Controllers]
    F --> G[Prisma ORM]
    G --> H[(PostgreSQL Database)]
    H --> G
    G --> F
    F --> D
    D --> B
```

## Design Decisions

- **React:** Used to build reusable and component-based user interfaces.
- **Express.js:** Used to create REST APIs and handle backend business logic.
- **PostgreSQL:** Chosen as a relational database because the application contains structured data and relationships between users, groups, assignments, and submissions.
- **Prisma ORM:** Simplifies database queries and provides schema-based database management.
- **JWT with HTTP-only Cookies:** Provides authentication while keeping the token inaccessible to frontend JavaScript.
- **Redux Toolkit:** Manages shared frontend state, including user authentication and dashboard data.
- **Docker:** Provides a consistent local PostgreSQL database environment.



## Project Status

AssignHub currently includes the following implemented functionality:

- Student authentication and profile management.
- Group creation and member management.
- Assignment creation and management by administrators.
- Assignment allocation to groups.
- Two-step assignment submission confirmation.
- Admin dashboard and analytics.
- Student, group, assignment, and submission management.
- PostgreSQL database integration using Prisma ORM.
- Docker-based PostgreSQL setup.

## Future Improvements

- Deploy the frontend and backend to cloud hosting platforms.
- Configure a hosted PostgreSQL database.
- Add a live application demo.
- Add automated backend and frontend tests.

## Deployment

The application currently runs locally. Deployment is planned for a later stage.

Live Demo: Coming Soon

Demo Video: Coming Soon

## Author

**Gaurav Singh Rawat**

GitHub: [Gaurav-Rawat28437](https://github.com/Gaurav-Rawat28437)

Project Repository: [AssignHub](https://github.com/Gaurav-Rawat28437/AssignHub-Student-Group-Assignment-Management-System)
