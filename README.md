# Savoré Recipe App

> A mobile-first Progressive Web App for storing, organizing, and viewing your personal recipes—online or offline.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Prerequisites](#prerequisites)  
- [Getting Started](#getting-started)  
- [Project Structure](#project-structure)  
- [Environment Variables](#environment-variables)  
- [Development](#development)  
- [Production Build & Deployment](#production-build--deployment)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- **User Authentication**: Sign up & log in with JWT-protected routes  
- **Recipe Management**: Create, view, edit, and delete recipes (with photos)  
- **Dynamic Forms**: “+ add” inputs for multiple ingredients and steps  
- **Offline-First**: Installable PWA with service-worker caching  
- **Filtering**: Browse recipes by category  
- **Responsive UI**: Mobile-optimized design with Tailwind CSS  

---

## Tech Stack

- **Frontend**  
  - React (Hooks, Context API, React Router v6)  
  - Vite + Tailwind CSS + `vite-plugin-pwa`  
- **Backend**  
  - Node.js + Express (ES modules)  
  - SQLite (`sqlite3`)  
  - JWT authentication (`jsonwebtoken`)  
  - File uploads with Multer  
- **Deployment**  
  - Frontend → Vercel  
  - Backend → Render.com  

---

## Prerequisites

- **Node.js** v16 or higher  
- **npm** (comes with Node.js)  
- **Git**  

---

## Getting Started

1. **Clone the repository**  
   ```bash
   git clone https://github.com/<your-username>/recipe-app.git
   cd recipe-app
   ```

2. **Configure environment variables**

   - **Server**: create `server/.env` with:
     ```ini
     JWT_SECRET=your_jwt_secret
     CORS_ORIGIN=http://localhost:5173
     ```
   - **Client**: create `client/.env` with:
     ```ini
     VITE_API_URL=http://localhost:3001/api
     ```

3. **Install dependencies and start dev servers**  
   Each part runs independently:
   ```bash
   # In one terminal:
   cd server
   npm install
   npm run dev          # starts Express on http://localhost:3001

   # In another terminal:
   cd client
   npm install
   npm run dev          # starts Vite on http://localhost:5173
   ```

4. **Open in browser**  
   Visit `http://localhost:5173` to use the app.

---

## Project Structure

```
recipe-app/
├── client/           # React + Vite frontend
│   ├── public/       # static assets
│   ├── src/          # React components & pages
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── server/           # Express + SQLite backend
    ├── controllers/  # request handlers
    ├── db/           # SQLite setup
    ├── routes/       # auth & recipe routes
    ├── uploads/      # stored images
    ├── server.js     # main Express app
    └── package.json
```

---

## Environment Variables

| Name           | Location      | Description                                      |
| -------------- | ------------- | ------------------------------------------------ |
| `JWT_SECRET`   | `server/.env` | Secret for signing JSON Web Tokens               |
| `CORS_ORIGIN`  | `server/.env` | Allowed origin for CORS (e.g. your frontend URL) |
| `VITE_API_URL` | `client/.env` | Base URL of your backend API (e.g. `…/api`)      |

---

## Development

### Backend

```bash
cd server
npm install
npm run dev       # nodemon watches for changes
```

- Server runs on **http://localhost:3001**
- API endpoints under `/api/auth` and `/api/recipes`

### Frontend

```bash
cd client
npm install
npm run dev       # Vite dev server
```

- App runs on **http://localhost:5173**
- Automatically reloads on code changes

---

## Production Build & Deployment

### Frontend → Vercel

1. In the Vercel dashboard, **Import Git Repository** and point to the `client/` folder as **Root Directory**.  
2. Set **Build Command**:
   ```
   npm ci && npm run build
   ```
3. Set **Output Directory**:
   ```
   dist
   ```
4. Add Environment Variable in Vercel:
   ```
   VITE_API_URL=https://<your-render-app>.onrender.com/api
   ```
5. Deploy and note your Vercel URL (e.g. `https://your-recipe-app.vercel.app`).

### Backend → Render.com

1. In the Render dashboard, **New Web Service**, connect your `server/` repo.  
2. Set **Root Directory** to `server`.  
3. **Build Command**: `npm ci`  
4. **Start Command**: `npm start`  
5. Add Environment Variables in Render:
   ```ini
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=https://<your-vercel-app>.vercel.app
   ```
6. Deploy and note your Render URL (e.g. `https://recipe-server-xyz.onrender.com`).

---

## Contributing

1. Fork this repository  
2. Create a branch: `git checkout -b feat/some-feature`  
3. Commit your changes: `git commit -m "feat: add some feature"`  
4. Push to your fork: `git push origin feat/some-feature`  
5. Open a Pull Request  

---

## License

This project is licensed under the MIT License.
