# syntax=docker/dockerfile:1

# ---------- Build Stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (copy only package files first for caching)
COPY package.json .
# COPY package-lock.json .
RUN npm install --silent

# Copy source files
COPY . .

# Build the Vite app (produces static files in /app/dist)
RUN npm run build

# ---------- Production Stage ----------
FROM nginx:alpine
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (nginx default)
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
