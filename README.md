# User Management System

A full-stack web application for managing users with role-based access control, authentication, and admin dashboard functionality.

## 📋 Features

- **User Authentication**: Register, login, and logout with JWT-based cookie authentication
- **Profile Management**: Update user profile (name, email, birth date) and change password
- **Admin Dashboard**: View all users and manage user status (activate/deactivate)
- **Role-Based Access**: Admin and regular user roles with protected routes
- **Responsive UI**: Full-screen, mobile-friendly interface using Tailwind CSS
- **Secure Cookies**: HTTP-only, SameSite-configured JWT tokens (access & refresh)
- **Error Handling**: Comprehensive error messages and validation

## 🛠️ Tech Stack

### Backend
- **Node.js** (ESM) - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library

### Frontend
- **React** (Vite) - UI library with fast build tool
- **React Router v7** - Client-side routing
- **Redux Toolkit** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **react-hot-toast** - Toast notifications

## 📁 Project Structure

```
User Management System/
├── Backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── index.js               # Server entry point
│   │   ├── config/                # Configuration files
│   │   ├── controllers/           # Route controllers
│   │   │   └── user.controller.js
│   │   ├── db/                    # Database connection
│   │   ├── middlewares/           # Custom middleware
│   │   │   ├── auth.middleware.js
│   │   │   ├── admin.middleware.js
│   │   │   └── error.middleware.js
│   │   ├── models/                # Mongoose schemas
│   │   │   └── user.model.js
│   │   ├── routes/                # API routes
│   │   │   └── user.route.js
│   │   └── utils/                 # Utility functions
│   ├── tests/                     # Test files
│   │   └── auth.test.js
│   ├── jest.config.cjs            # Jest configuration
│   ├── .env                       # Environment variables
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── components/            # Reusable React components
    │   ├── pages/                 # Page components
    │   ├── services/              # API service layer
    │   ├── redux/                 # Redux store & slices
    │   ├── hooks/                 # Custom React hooks
    │   ├── context/               # React context
    │   ├── utils/                 # Utility functions
    │   ├── App.jsx                # Main App component
    │   └── main.jsx               # React entry point
    ├── public/                    # Static assets
    │   └── _redirects             # Netlify SPA routing config
    ├── .env                       # Environment variables
    ├── vite.config.js             # Vite configuration
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- MongoDB (local or cloud, e.g., MongoDB Atlas)

### Backend Setup

1. **Install dependencies**:
   ```bash
   cd Backend
   npm install
   npm install --save-dev cross-env jest supertest mongodb-memory-server
   ```

2. **Create `.env` file** in the `Backend` directory:
   ```env
   PORT=4000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/user-management
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRY=7d
   REFRESH_TOKEN_EXPIRY=30d
   CORS_ORIGIN=http://localhost:5173,http://localhost:3000
   ```

3. **Start the server**:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install dependencies**:
   ```bash
   cd Frontend
   npm install
   ```

2. **Create `.env` file** in the `Frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

Visit `http://localhost:5173` in your browser.

## 🧪 Testing

### Run Tests
From the `Backend` directory:

```bash
npm test
```

This will run Jest tests in band mode using an in-memory MongoDB server for isolation.

### Test Coverage
- **Auth Flow**: Register → Login → Get Current User
- **Admin Protection**: Verify admins cannot be deactivated
- More tests can be added in `tests/` directory

## 🔐 API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `POST /api/users/logout` - Logout user
- `GET /api/users/me` - Get current user (requires auth)

### User Profile
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)
- `PUT /api/users/change-password` - Change password (requires auth)

### Admin Only
- `GET /api/users` - List all users (requires admin)
- `PUT /api/users/activate/:userId` - Activate user (requires admin)
- `PUT /api/users/deactivate/:userId` - Deactivate user (requires admin, cannot deactivate other admins)

## 📝 Environment Variables

### Backend
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 4000 | Server port |
| `NODE_ENV` | development | Environment (development/production/test) |
| `MONGODB_URI` | - | MongoDB connection string |
| `JWT_SECRET` | - | Secret key for JWT signing |
| `JWT_EXPIRY` | 7d | JWT access token expiry |
| `REFRESH_TOKEN_EXPIRY` | 30d | Refresh token expiry |
| `CORS_ORIGIN` | http://localhost:5173 | Comma-separated allowed origins |

### Frontend
| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | http://localhost:4000/api | Backend API base URL |

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **HTTP-Only Cookies**: JWT tokens stored in secure, HTTP-only cookies
- **CORS**: Origin validation and controlled cross-origin access
- **SameSite Cookies**: Set to `'none'` in production for cross-site requests
- **Admin Protection**: Admins cannot be deactivated by other admins
- **Route Protection**: Protected routes require authentication

## 📦 Deployment

### Backend (Render / Heroku)
1. Set environment variables on the hosting platform
2. Ensure `NODE_ENV=production`
3. Ensure `CORS_ORIGIN` includes your frontend domain
4. Deploy the `Backend` directory

### Frontend (Netlify / Vercel)
1. Set `VITE_API_BASE_URL` to your deployed backend URL
2. The `public/_redirects` file handles SPA routing for Netlify
3. Deploy the `Frontend` directory

## 🐛 Troubleshooting

### CORS Issues
- Verify `CORS_ORIGIN` in backend `.env` includes your frontend URL
- Ensure frontend axios is configured with `withCredentials: true`

### Cookies Not Being Set
- Check backend is running on HTTPS in production (required for SameSite=none)
- Verify frontend is on a different domain (cross-origin) for production cookies

### Tests Failing
- Ensure MongoDB is not running on the test port
- Run `npm test` from the `Backend` directory
- Check Node.js version is 16+

## 👤 User Roles

- **User**: Can view and edit own profile, change password
- **Admin**: Can manage all users (activate/deactivate), cannot deactivate other admins

## 📄 License

This project is provided as-is for educational purposes.

---

**Happy coding!** 🎉
