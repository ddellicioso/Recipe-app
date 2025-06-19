# STAGE 1: Build React
FROM node:18 AS builder-client
WORKDIR /build/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build && if [ -d dist ]; then mv dist build; fi

# STAGE 2: Build server & native modules
FROM node:18 AS builder-server
WORKDIR /build/server
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm prune --production

# STAGE 3: Final image
FROM node:18-slim
WORKDIR /app

# Bring in server (with Linux-built sqlite3)
COPY --from=builder-server /build/server ./server

# Bring in frontend build
COPY --from=builder-client /build/client/build ./server/public

VOLUME ["/data"]
ENV DATABASE_FILE=/data/app.db

WORKDIR /app/server
EXPOSE 8080
CMD ["node", "server.js"]
