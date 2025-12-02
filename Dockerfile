# ---- 1. Build Stage ----
FROM node:25.2-alpine AS builder

# Set wokring directory
WORKDIR /app

# Receive VITE_* environment variable when build
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# Copy package.json & lock file (if exist)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Build Vite project
RUN npm run build

# ---- 2. Production Stage ----
FROM nginx:1.29.3-alpine

# Delete default nginx static page
RUN rm -rf /usr/share/nginx/html/*

# Copy SPA fallback nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy from build previous stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 for nginx
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]