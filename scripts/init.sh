
#!/bin/bash
set -e

echo "Injecting default users..."

docker exec -i time-sync-backend sh -c "curl -s -X POST http://localhost:3000/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\",\"password\":\"password\",\"firstName\":\"Test\",\"lastName\":\"User\",\"role\":\"EMPLOYEE\"}'"
docker exec -i time-sync-backend sh -c "curl -s -X POST http://localhost:3000/auth/register -H 'Content-Type: application/json' -d '{\"email\":\"admin@example.com\",\"password\":\"password\",\"firstName\":\"Test\",\"lastName\":\"User\",\"role\":\"ADMIN\"}'"
echo "Users created. Starting frontend..."
docker exec -it time-sync-frontend sh -c "cd apps/frontend && npx expo start --tunnel -p 3002"
