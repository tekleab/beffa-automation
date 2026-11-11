# Use the official Playwright base image with the matching version
FROM mcr.microsoft.com/playwright:v1.58.2-jammy

# Ensure system-level CA certificates are fully updated and install Bun
RUN apt-get update && \
    apt-get install --no-install-recommends -y ca-certificates curl unzip && \
    update-ca-certificates && \
    curl -fsSL https://bun.sh/install | bash && \
    rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.bun/bin:${PATH}"

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definitions and lockfiles
COPY package*.json bun.lock* ./

# Install project dependencies with Bun (fast cached install)
RUN bun install --frozen-lockfile || npm ci

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
