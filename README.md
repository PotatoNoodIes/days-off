# TimeSync Monorepo

This is the monorepo for the TimeSync application, containing the backend, admin dashboard, and employee mobile app. It is managed using [Turborepo](https://turbo.build/repo) and npm workspaces.

## Project Structure

- **apps/backend**: NestJS API server (`@time-sync/backend`)
- **apps/admin**: React Native (Expo) Admin Dashboard (`@time-sync/admin`)
- **apps/employee**: React Native (Expo) Employee App (`@time-sync/employee`)
- **packages/api**: Shared API client logic (`@time-sync/api`)
- **packages/ui**: Shared UI components (`@time-sync/ui`)

## Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [npm](https://www.npmjs.com/) (Version 10+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (Optional, but useful for React Native apps)

## Installation

Because this is a monorepo using npm workspaces, you solely need to run `npm install` **once** at the root of the project. This will automatically install all dependencies for every application and package within the repository and link them together.

```bash
# Extract the project if needed
cd days-off

# Install all dependencies for backend, admin, employee, and packages
npm install
```

> **Note:** You do **NOT** need to go into each `apps/` folder and run `npm install`. The root install handles everything.

## Running the Applications

### Run Everything (Development Mode)

To start all applications simultaneously in development mode, run the following command from the root:

```bash
npm run dev
```

This uses Turborepo to launch the `dev` script for all workspaces in parallel.

### Run Apps Individually

If you prefer to run specific applications separately (e.g., to debug or focus on one part), follow these instructions:

#### Backend API
Runs on `http://localhost:3000` (default NestJS port).

```bash
cd apps/backend
npm run start:dev
```

#### Admin App (Expo)
To start the Admin dashboard:

```bash
cd apps/admin
npm start
# Press 'a' for Android, 'i' for iOS, or 'w' for Web
```

#### Employee App (Expo)
To start the Employee mobile app:

```bash
cd apps/employee
npm start
# Press 'a' for Android, 'i' for iOS, or 'w' for Web
```

## Additional Commands

- **Build**: `npm run build` (Runs `turbo run build` from root)
- **Lint**: `npm run lint` (Runs `turbo run lint` from root)
- **Format**: `npm run format` (Runs prettier on supported files)

## data Seeding (Backend)

To seed the database with initial data:

```bash
cd apps/backend
npm run seed
```
