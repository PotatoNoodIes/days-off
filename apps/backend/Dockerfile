# apps/backend/Dockerfile
FROM node:22-alpine

# Install system dependencies for native modules
RUN apk add --no-cache bash git python3 make g++

WORKDIR /usr/src/app

# Copy root manifest and lockfile
COPY package.json package-lock.json ./

# Copy package manifests for workspace dependency resolution
COPY packages/api/package.json ./packages/api/
COPY packages/ui/package.json ./packages/ui/
COPY apps/backend/package.json ./apps/backend/
COPY apps/package.json ./apps/

# Install all dependencies (including workspace links)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the backend (and shared packages if needed)
RUN npx turbo run build --filter=@time-sync/backend

EXPOSE 3000

# Set working directory to backend app for execution
WORKDIR /usr/src/app/apps/backend

CMD ["npm", "run", "start:dev"]
