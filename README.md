# DevPulse - Issue Tracking System Backend

A robust, modular Issue Tracking System built with **Node.js**, **Express**, **TypeScript**, and **PostgreSQL**. This system features JWT-based role-based authentication (Maintainer, Contributor) and complete issue management tracking capabilities.

## 🚀 Live Deployment
- **Live API URL:** [https://devpulse-backend-ashen.vercel.app](https://devpulse-backend-ashen.vercel.app)

---

## ✨ Features
- **Modular Architecture:** Well-structured codebase utilizing clean separation of concerns (`modules/`, `middleware/`, `config/`, `db/`).
- **Role-Based Access Control (RBAC):** Restricts critical endpoints based on user roles (`maintainer` and `contributor`).
- **Secure Authentication:** Implements JWT tokens for stateless and secure session validation.
- **Relational Data Integrity:** Relies on a PostgreSQL database for fast, atomic operations.
- **No JOIN-optimization:** Single-issue fetches follow customized sequential fetch pipelines optimized for high concurrent throughput without complex database joins.

---

## 🛠️ Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **Deployment:** Vercel

---

## 📂 Database Schema Summary
### 1. `users` Table
- `id` (SERIAL, PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR)
- `role` (VARCHAR - 'maintainer' or 'contributor')
- `created_at` (TIMESTAMP)

### 2. `issues` Table
- `id` (SERIAL, PRIMARY KEY)
- `title` (VARCHAR)
- `description` (TEXT)
- `type` (VARCHAR - 'bug', 'feature', 'chore')
- `status` (VARCHAR - 'open', 'in-progress', 'resolved', 'closed')
- `reporter_id` (INTEGER, FOREIGN KEY referencing `users(id)`)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

---

## 🛣️ API Endpoints Specification

### Authentication Module
- `POST /api/auth/signUp` - Registers a new user.
- `POST /api/auth/signIn` - Logs in a user and returns a signed JWT.

### Issues Module
- `POST /api/issues/create-issue` - Creates a new issue *(Requires Auth: Contributor)*.
- `GET /api/issues` - Retrieves all issues with dynamic query filtering *(Public)*.
- `GET /api/issues/:id` - Fetches details of a single issue *(Public)*.
- `PATCH /api/issues/:id` - Updates specific fields of an issue *(Requires Auth: Contributor/Maintainer)*.
- `DELETE /api/issues/:id` - Permanently deletes an issue *(Requires Auth: Maintainer)*.

---

## 💻 Local Setup Steps

Follow these instructions to run the project locally:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/akashsarker2478/devpulse.git](https://github.com/akashsarker2478/devpulse.git)
   cd devpulse

   1.Install dependencies: npm install
   2.Configure Environment Variables:
    Create a .env file in the root directory and populate it with your environment keys:
    PORT=5000
    DATABASE_URL=your_postgresql_connection_string
    JWT_SECRET=your_super_secret_jwt_key

    3.Build the Application:npm run build
    4.Run the Development Server: npm run dev