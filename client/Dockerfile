# Use an official Node.js runtime as the base image
FROM node:14 as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies without --openssl-legacy-provider
RUN NODE_OPTIONS= npm install

# Copy the rest of your application code to the container
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight Nginx web server as the final image
FROM nginx:alpine

# Copy the built React app from the build image
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (default for HTTP)
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
