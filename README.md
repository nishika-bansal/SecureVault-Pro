# SecureVault Pro

SecureVault Pro is a full-stack MERN password manager built with React, Node.js, Express, MongoDB, JWT authentication, bcrypt password hashing, and AES-256-GCM encryption for stored vault passwords.

## Final Feature Set

### Authentication

- Register
- Login
- Logout
- JWT authentication
- bcrypt password hashing

### Vault

- Add credential
- Edit credential
- Delete credential
- Search credential
- Category filter
- Favorite credentials
- Show/hide password
- Copy password

### Security

- AES encryption for stored passwords
- Protected routes
- Input validation
- Rate limiting

### UI

- Responsive dashboard
- Dark mode
- Password strength meter
- Password generator

### Backend

- REST APIs
- MongoDB
- Mongoose
- MVC architecture

### Deployment

- Render backend configuration
- Vercel frontend configuration
- MongoDB Atlas ready connection string

## Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Login Page
![Login](./screenshots/login.png)

### Add Credential
![Add Credential](./screenshots/add.png)

### Dark Mode
![Dark Mode](./screenshots/darkmode.png)

## Run In VS Code

1. Open `C:\Users\Dell\Downloads\gg\SecureVault-Pro` in VS Code.
2. Copy `backend\.env.example` to `backend\.env` if `.env` is missing.
3. Copy `frontend\.env.example` to `frontend\.env` if `.env` is missing.
4. Generate an encryption key when creating a new `.env`:

```powershell
npm.cmd run keygen
```

Paste the generated value into `backend\.env` as `ENCRYPTION_KEY`, then set a long `JWT_SECRET`.

5. Start MongoDB locally, or use a MongoDB Atlas connection string in `backend\.env`.

6. Install dependencies:

```powershell
npm.cmd run install:all
```

7. Start the full app:

```powershell
npm.cmd run dev
```

Frontend: `http://localhost:5173`  
Backend health check: `http://localhost:5000/health`

In VS Code, you can also press `Ctrl+Shift+P`, choose `Tasks: Run Task`, then run `Install all dependencies` and `Start SecureVault Pro`.

## API Overview

Base URL: `http://localhost:5000/api`

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `GET /credentials`
- `POST /credentials`
- `GET /credentials/:id`
- `PATCH /credentials/:id`
- `DELETE /credentials/:id`
- `POST /credentials/:id/reveal`

## Deployment Notes

- Frontend: deploy the `frontend` folder to Vercel and set `VITE_API_URL`.
- Backend: deploy the `backend` folder to Render and set `MONGO_URI`, `JWT_SECRET`, `ENCRYPTION_KEY`, and `CLIENT_URL`.
- Database: use MongoDB Atlas in production and paste the Atlas connection string into `MONGO_URI`.

## Resume Points

- Developed a full-stack password manager using React, Node.js, Express, MongoDB, and Mongoose.
- Implemented JWT-based authentication with bcrypt password hashing.
- Secured stored vault passwords using AES-256-GCM encryption.
- Designed REST APIs with protected routes, input validation, rate limiting, and MVC architecture.
- Built a responsive dashboard with credential CRUD, search, category filtering, favorites, show/hide password, copy password, dark mode, strength meter, and password generator.
