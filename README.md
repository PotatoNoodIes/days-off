# TimeSync Monorepo

This is the monorepo for the TimeSync application, containing the backend, admin dashboard, and employee mobile app. It is managed using [Turborepo](https://turbo.build/repo) and npm workspaces.

## Setup Steps

1. In the `docker-compose.yml` file change the `EXPO_PUBLIC_API_URL` to your local IP address. To verify the address run `ipconfig` in powershell and look for the IPv4 Address. Or run `ifconfig` in linux and look for the inet address.
2. There should be 2 `.env` files, one in the backend and one in the frontend. Copy the contents of the `.env.example` file to the `.env` file.
3. In the backend `.env` file, check the pinned message on the discord channel for the database credentials.
4. In the frontend `.env` file, change the `EXPO_PUBLIC_API_URL` to match your local IP address.
2. Run `docker compose up --build` to start the containers.
3. If you use Windows, run `.\scripts\init.ps1` to seed the database with initial data and start the frontend.
4. If you use Linux, run `.\scripts\init.sh` to seed the database with initial data and start the frontend.
5. If there's a problem with the scripts run this commands in your terminal:

### Powershell

```
Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"email":"test@example.com","password":"password","firstName":"Test","lastName":"User","role":"EMPLOYEE"}'

Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"email":"admin@example.com","password":"password","firstName":"Test","lastName":"User","role":"ADMIN"}'

docker exec -it time-sync-frontend sh -c "cd apps/frontend && npx expo start --tunnel -p 3002"
```

### Bash

```
docker exec -i time-sync-backend sh -c "curl -s -X POST http://localhost:3000/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"password\",\"firstName\":\"Test\",\"lastName\":\"User\",\"role\":\"EMPLOYEE\"}'"
docker exec -i time-sync-backend sh -c "curl -s -X POST http://localhost:3000/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"admin@example.com\",\"password\":\"password\",\"firstName\":\"Test\",\"lastName\":\"User\",\"role\":\"ADMIN\"}'"
docker exec -it time-sync-frontend sh -c "cd apps/frontend && npx expo start --tunnel -p 3002"
```

5. Use android emulator or phone to use the app.
