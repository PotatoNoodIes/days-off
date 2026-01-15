# init.ps1
Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"email":"test@example.com","password":"password","firstName":"Test","lastName":"User","role":"EMPLOYEE"}'

Invoke-RestMethod -Uri http://localhost:3000/auth/register -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"email":"admin@example.com","password":"password","firstName":"Test","lastName":"User","role":"ADMIN"}'

docker exec -it time-sync-frontend sh -c "cd apps/frontend && npx expo start --tunnel -p 3002"
