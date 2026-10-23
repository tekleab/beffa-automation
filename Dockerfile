# Use the official Playwright base image with the matching version
FROM mcr.microsoft.com/playwright:v1.58.2-jammy

# Ensure system-level CA certificates are fully updated (distrust revoked eMudhra intermediates)
RUN apt-get update && apt-get install --no-install-recommends -y ca-certificates && update-ca-certificates && rm -rf /var/lib/apt/lists/*

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

# Set environment variables for reporting
ENV TEST_RESULTS=/app/test-results/

# Set the default command to run playwright tests
# Dynamic support for TEST_TAG=smoke or TEST_TAG=full
CMD sh -c "\
if [ \"$TEST_TAG\" = \"smoke\" ]; then \
  npx playwright test --grep @smoke; \
elif [ \"$TEST_TAG\" = \"regression\" ]; then \
  npx playwright test --grep @regression; \
else \
  npx playwright test; \
fi"
