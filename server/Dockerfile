# Use an official Node.js runtime as a parent image
FROM node:14

# Create a working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of your application source code to the container
COPY . .

# Expose the port that your application will listen on
EXPOSE 4000 

# Define the command to start your server
CMD [ "npm", "run", "dev" ]
