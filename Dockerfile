# Multi-stage build for CCBC PWA
# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --silent

# Copy source code
COPY . .

# Build the application
RUN npx vite build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine AS production

# Install Node.js for serving the PWA (needed for service worker)
RUN apk add --no-cache nodejs npm

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy PWA service worker and manifest
COPY --from=builder /app/dist/sw.js /usr/share/nginx/html/sw.js
COPY --from=builder /app/dist/workbox-*.js /usr/share/nginx/html/
COPY --from=builder /app/dist/manifest.json /usr/share/nginx/html/manifest.json

# Create nginx user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Development stage (optional)
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY . .

# Expose development port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
