# ==============================================================================
# DevOps Automation Dashboard - Production Dockerfile
# Base Image: Lightweight, secure Alpine Linux with Nginx Web Server
# ==============================================================================
FROM nginx:1.27-alpine

LABEL maintainer="DevOps Team <devops@example.com>"
LABEL description="DevOps Automation Dashboard for Build and Deployment Monitoring"
LABEL version="1.2.0"

# Remove default Nginx welcome site
RUN rm -rf /usr/share/nginx/html/*

# Copy custom hardened Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy application static files
COPY index.html /usr/share/nginx/html/index.html
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Set proper permissions for static assets
RUN chmod -R 755 /usr/share/nginx/html

# Expose standard HTTP port
EXPOSE 80

# Configure container healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
