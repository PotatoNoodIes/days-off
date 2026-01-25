# apps/frontend/Dockerfile
FROM node:20-alpine

RUN apk add --no-cache bash git python3 make g++

WORKDIR /usr/src/app

# Copy the root lockfile + package.json first
COPY package.json package-lock.json ./

# Copy workspace package manifests
COPY packages/ui/package.json ./packages/ui/
COPY packages/api/package.json ./packages/api/
COPY apps/frontend/package.json ./apps/frontend/
COPY apps/backend/package.json ./apps/backend/

# Install all dependencies in workspace (resolves @time-sync/ui, etc.)
RUN npm install

# Copy the rest of the code
COPY . .

# Keep container alive for dev script
CMD ["sleep", "infinity"]
