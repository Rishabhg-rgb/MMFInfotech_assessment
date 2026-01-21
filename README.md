# HRMS (Human Resource Management System)

A comprehensive HRMS application built with React, TypeScript, Node.js, Express, and MongoDB. Features employee management, attendance tracking, role-based authentication, and a professional UI.

## Project Structure

```
Assessment/
├── backend/          # Node.js/Express API server
├── frontend/         # React/TypeScript client application
└── README.md         # This file
```

## Backend Setup

### Prerequisites

- Node.js >= 22.12.0
- npm >= 10.9.0
- MongoDB (local or cloud instance)

### Installation

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:
   Copy `env.dev.txt` to `.env` and update the values:

   ```bash
   cp env.dev.txt .env
   ```

   Required environment variables:

   ```
   NODE_ENV=development
   DATABASE_URL="mongodb://localhost:27017/hrms"
   SERVER_PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173
   ```

4. Start MongoDB service (if running locally)

### Running the Backend

#### Development Mode

```bash
npm run dev
```

This starts the server with hot reload using ts-node-dev.

#### Production Mode

```bash
npm run build
npm start
```

### Seeding Data

To populate the database with sample data including admin user and test employees:

```bash
npm run seed
```

This will create:

- Admin role and Employee role
- Admin user and several test employees

**Default Admin Credentials:**

- Email: `admin@hrms.com`
- Password: `password123`

**Test Employee Credentials:**

- Email: `john.doe@hrms.com`
- Password: `password123`

## Frontend Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:
   Create a `.env` file in the frontend root:
   ```bash
   VITE_API_URL=http://localhost:3000/api/v1
   ```

### Running the Frontend

#### Development Mode

```bash
npm run dev
```

This starts the Vite development server on `http://localhost:5173`

#### Production Build

```bash
npm run build
npm run preview
```

## Getting Started

1. **Start the Backend:**

   ```bash
   cd backend
   npm install
   # Configure .env file
   npm run seed  # Optional: seed sample data
   npm run dev
   ```

2. **Start the Frontend:**

   ```bash
   cd frontend
   npm install
   # Configure .env file
   npm run dev
   ```

3. **Access the Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

4. **Login with Admin:**
   - Email: `admin@hrms.com`
   - Password: `password123`

## Features

### Authentication

- JWT-based authentication
- Role-based access control (Admin/Employee)
- Secure password hashing

### Employee Management

- Add, view, update, delete employees
- Employee profiles with detailed information
- Department-based organization

### Attendance Tracking

- Daily attendance marking
- Attendance history and filtering
- Employee attendance reports

### User Interface

- Professional, responsive design
- Modal-based forms
- Table views with pagination
- Toast notifications

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/signup` - User registration
- `GET /api/v1/auth/me` - Get current user

### Employees

- `GET /api/v1/employees` - Get all employees (paginated)
- `GET /api/v1/employees/:id` - Get employee by ID
- `POST /api/v1/employees` - Create new employee (Admin only)
- `DELETE /api/v1/employees/:id` - Delete employee (Admin only)

### Attendance

- `GET /api/v1/attendance` - Get attendance records
- `POST /api/v1/attendance` - Mark attendance

## Technologies Used

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **Validation:** Yup
- **Security:** Helmet, CORS, Rate limiting
- **File Upload:** Multer with AWS S3

### Frontend

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** React Icons

## Development Scripts

### Backend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm run format` - Format code with Prettier

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the ISC License.
