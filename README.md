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
  - [Vercel](#vercel)  
  - [Render.com](#rendercom)  
  - [Fly.io (Optional)](#flyio-optional)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

Savoré offers a clean, intuitive interface to manage recipes:

- **User Authentication**: Sign up & log in with JWT-protected routes  
- **Recipe CRUD**: Create, view, edit, and delete recipes (with photos)  
- **Dynamic Forms**: “+ add” inputs for ingredients and steps  
- **Offline-First**: Installable PWA with service-worker caching  
- **Filtering**: Browse recipes by category  
- **Responsive UI**: Mobile-optimized design with Tailwind CSS  

---

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, vite-plugin-pwa  
- **Backend**: Node.js, Express (ESM), SQLite, JWT, Multer  
- **Deployment**: Vercel (frontend), Render.com (backend), Fly.io (optional full-stack)

---

## Prerequisites

- Node.js v16+ & npm  
- Git  
- (Optional) Fly.io CLI (`brew install flyctl` or see https://fly.io/docs/hands-on/install-flyctl/)  

---

## Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/<your-username>/recipe-app.git
   cd recipe-app
   ```

2. **Configure environment variables**  
   - **Server** (`server/.env`):
     ```ini
     JWT_SECRET=your_jwt_secret
     CORS_ORIGIN=http://localhost:5173
     ```
   - **Client** (`client/.env`):
     ```ini
     VITE_API_URL=http://localhost:3001/api
     ```

3. **Install dependencies & start local servers**  
   ```bash
   # Backend
   cd server
   npm install
   npm run dev   # http://localhost:3001

   # Frontend (in new terminal)
   cd client
   npm install
   npm run dev   # http://localhost:5173
   ```

4. **Open** `http://localhost:5173` in your browser

---

## Project Structure

```
recipe-app/
├── client/        # Frontend (React + Vite)
│   ├── public/
│   ├── src/
│   └── ...
└── server/        # Backend (Express + SQLite)
    ├── controllers/
    ├── db/
    ├── routes/
    ├── uploads/
    └── ...
```

---

## Environment Variables

- `JWT_SECRET` (server/.env): Secret key for JWT  
- `CORS_ORIGIN` (server/.env): Allowed origin for CORS  
- `VITE_API_URL` (client/.env): Backend API base URL  

---

## Development

```bash
# Backend
cd server && npm install && npm run dev

# Frontend
cd client && npm install && npm run dev
```

---

## Production Build & Deployment

### Vercel

1. Import the **client/** directory in Vercel  
2. Build: `npm ci && npm run build`  
3. Output: `dist`  
4. Set `VITE_API_URL` to your backend URL  

### Render.com

1. Create a Web Service pointing to **server/**  
2. Build: `npm ci`  
3. Start: `npm start`  
4. Add `JWT_SECRET` and `CORS_ORIGIN` env vars  

### Fly.io (Optional)

Fly.io can host both client and server together.

1. **Install** `flyctl` and **login**:  
   ```bash
   flyctl auth signup
   ```

2. **Initialize** in project root:  
   ```bash
   flyctl launch \
     --name savore-app \
     --dockerfile server/Dockerfile \
     --region iad \
     --no-deploy
   ```

3. **Edit** `fly.toml` to include frontend build:  
   ```toml
   [[services]]
     internal_port = 3001
     protocol = "tcp"

   [build]
     dockerfile = "server/Dockerfile"
     [build.args]
       CLIENT_BUILD_DIR = "../client/dist"
   ```

4. **Configure** environment on Fly.io:  
   ```bash
   flyctl secrets set JWT_SECRET=your_jwt_secret \
     CORS_ORIGIN="https://savore-app.fly.dev"
   ```

5. **Deploy** both:  
   ```bash
   flyctl deploy
   ```

6. App is live at `https://savore-app.fly.dev`

---

## Contributing

1. Fork & clone the repo  
2. Create a branch: `git checkout -b feat/awesome`  
3. Commit & push, then open a Pull Request  

---

## License

MIT License  
