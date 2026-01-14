# Use Node Alpine
FROM node:22-alpine

# Install system dependencies
RUN apk add --no-cache bash git python3 make g++

WORKDIR /usr/src/app

# Copy package manifests first for caching
COPY package.json package-lock.json ./
COPY packages/api/package.json ./packages/api/
COPY packages/ui/package.json ./packages/ui/
COPY apps/frontend/package.json ./apps/frontend/

# Install all dependencies
RUN npm install

# Copy the rest of the code
COPY apps/frontend ./ 

# Expose the Metro and DevTools ports
EXPOSE 3002

# Set working directory to frontend app
WORKDIR /usr/src/app

# Start Expo in LAN mode with DevTools available
CMD ["npx", "expo", "start", "--lan", "-p", "3002"]
