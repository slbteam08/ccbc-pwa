# Docker Setup for CCBC PWA

This document explains how to build and run the CCBC PWA application using Docker.

## Quick Start

### Production Build
```bash
# Build and run production image
docker-compose up ccbc-pwa

# Or build manually
docker build -t ccbc-pwa:latest --target production .
docker run -p 8080:80 ccbc-pwa:latest
```

### Development Build
```bash
# Run development server with hot reload
docker-compose -f docker-compose.dev.yml up ccbc-pwa-dev

# Or use the main compose file with dev profile
docker-compose --profile dev up ccbc-pwa-dev
```

## Available Commands

### Build Commands
```bash
# Build production image
docker build -t ccbc-pwa:prod --target production .

# Build development image
docker build -t ccbc-pwa:dev --target development .

# Build all stages
docker build -t ccbc-pwa:latest .
```

### Run Commands
```bash
# Production (Nginx + built app)
docker run -p 8080:80 ccbc-pwa:prod

# Development (Vite dev server)
docker run -p 5173:5173 -v $(pwd):/app -v /app/node_modules ccbc-pwa:dev
```

### Docker Compose Commands
```bash
# Production deployment
docker-compose up -d ccbc-pwa

# Development with hot reload
docker-compose -f docker-compose.dev.yml up

# Development with profiles
docker-compose --profile dev up

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build
```

## Docker Images

### Production Image (`ccbc-pwa:prod`)
- **Base**: nginx:alpine
- **Size**: ~50MB
- **Port**: 80
- **Features**:
  - Optimized Nginx configuration
  - PWA support with service worker
  - Gzip compression
  - Security headers
  - Health checks
  - Static asset caching

### Development Image (`ccbc-pwa:dev`)
- **Base**: node:20-alpine
- **Size**: ~200MB
- **Port**: 5173
- **Features**:
  - Hot reload
  - Source code mounting
  - Development dependencies
  - Vite dev server

## Environment Variables

Create a `.env` file with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://47.128.222.103
VITE_API_TIMEOUT=30000

# PWA Configuration
VITE_APP_NAME="Church PWA 2"
VITE_APP_SHORT_NAME="ChurchPWA 2"

# Development
VITE_DEV_MODE=true
VITE_DEBUG=false

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE=true
```

## Production Deployment

### Using Docker Compose
```bash
# Deploy to production
docker-compose up -d ccbc-pwa

# Check status
docker-compose ps

# View logs
docker-compose logs -f ccbc-pwa
```

### Using Docker Run
```bash
# Run production container
docker run -d \
  --name ccbc-pwa-prod \
  -p 8080:80 \
  --restart unless-stopped \
  ccbc-pwa:latest
```

### Health Checks
The production container includes health checks:
```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' ccbc-pwa-prod

# Manual health check
curl http://localhost:8080/health
```

## Development Workflow

### With Docker Compose
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Make changes to source code (hot reload enabled)
# Access app at http://localhost:5173
```

### With Docker Run
```bash
# Start development container
docker run -it --rm \
  -p 5173:5173 \
  -v $(pwd):/app \
  -v /app/node_modules \
  ccbc-pwa:dev
```

## Troubleshooting

### Build Issues
```bash
# Clean build (no cache)
docker build --no-cache -t ccbc-pwa:latest .

# Check build logs
docker build -t ccbc-pwa:latest . 2>&1 | tee build.log
```

### Runtime Issues
```bash
# Check container logs
docker logs ccbc-pwa-prod

# Access container shell
docker exec -it ccbc-pwa-prod sh

# Check nginx configuration
docker exec ccbc-pwa-prod nginx -t
```

### Performance Issues
```bash
# Check resource usage
docker stats ccbc-pwa-prod

# Check disk usage
docker system df
```

## Security Considerations

The production image includes:
- Security headers (X-Frame-Options, CSP, etc.)
- Non-root user execution
- Minimal attack surface (alpine base)
- Regular security updates via base images

## Monitoring

### Health Endpoints
- `GET /health` - Container health check
- `GET /` - Main application

### Logs
```bash
# View application logs
docker-compose logs -f ccbc-pwa

# View nginx access logs
docker exec ccbc-pwa-prod tail -f /var/log/nginx/access.log
```

## Scaling

### Horizontal Scaling
```bash
# Scale production service
docker-compose up -d --scale ccbc-pwa=3
```

### Load Balancing
Use the nginx-proxy profile for load balancing:
```bash
docker-compose --profile proxy up -d
```
