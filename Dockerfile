# Use the official Playwright base image with the matching version
FROM mcr.microsoft.com/playwright:v1.58.2-focal

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first (for better caching)
COPY package*.json ./

# Install project dependencies
RUN npm ci

# Copy the rest of the application files
# The .dockerignore will prevent node_modules, reports, and .env from being copied
COPY . .

# Ensure the app has permissions to write results if running as non-root (optional but good practice)
RUN mkdir -p /app/test-results /app/allure-results && chmod -R 777 /app

# Set the default command to run playwright tests
# We use --project=chromium by default, but this can be overridden
CMD ["npx", "playwright", "test"]
