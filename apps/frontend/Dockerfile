FROM node:22-alpine

RUN apk add --no-cache bash git python3 make g++

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
COPY apps/frontend/package.json ./apps/frontend/
COPY packages/ui/package.json ./packages/ui/
COPY packages/api/package.json ./packages/api/

RUN npm install

COPY . .

CMD ["sleep", "infinity"]
