# Step 1: Build the Vite App
FROM node:23-alpine AS builder
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the Vite app
RUN npm run build

# Step 2: Serve the Built Files Using Nginx
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Copy the built files from the builder stage
COPY --from=builder /usr/src/app/dist .

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
