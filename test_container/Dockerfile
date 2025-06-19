# Use official Node.js LTS image
FROM node:24-alpine

# Set working directory
WORKDIR /test_programme

# Copy package.json and package-lock.json if they exist
COPY package*.json ./

# Install dependencies if package.json exists
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port (change if your app uses a different port)
EXPOSE 4000

# Run the application
CMD ["npm", "start"]