# Use a minimal Nginx base image
FROM nginx:alpine

# Copy the static files from the local machine to the Nginx default public directory
COPY frontend/dist /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Command to start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
