# init.ps1

Write-Host "Waiting for backend to be ready..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$backendReady = $false

while (-not $backendReady -and $attempt -lt $maxAttempts) {
    try {
        $response = Invoke-RestMethod -Uri http://127.0.0.1:3000 -Method GET -ErrorAction Stop
        $backendReady = $true
        Write-Host "Backend is ready!" -ForegroundColor Green
    } catch {
        $attempt++
        Write-Host "Waiting for backend... ($attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $backendReady) {
    Write-Host "Backend failed to start after $maxAttempts attempts" -ForegroundColor Red
    exit 1
}

Write-Host "Registering employee user..." -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri http://127.0.0.1:3000/auth/register -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"email":"test@example.com","password":"password","firstName":"Test","lastName":"User","role":"EMPLOYEE"}'
    Invoke-RestMethod -Uri http://127.0.0.1:3000/auth/register -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"email":"test1@example.com","password":"password","firstName":"Test2","lastName":"User","role":"EMPLOYEE"}'
    Write-Host "Employee registered successfully" -ForegroundColor Green
} catch {
    Write-Host "Employee registration failed (may already exist): $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "Registering admin user..." -ForegroundColor Cyan
try {
    Invoke-RestMethod -Uri http://127.0.0.1:3000/auth/register -Method POST -Headers @{ "Content-Type" = "application/json" } -Body '{"email":"admin@example.com","password":"password","firstName":"admin","lastName":"User","role":"ADMIN"}'
    Write-Host "Admin registered successfully" -ForegroundColor Green
} catch {
    Write-Host "Admin registration failed (may already exist): $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`nStarting Expo..." -ForegroundColor Green
docker exec -it time-sync-frontend sh -c "cd apps/frontend && npx expo start --tunnel -p 3002"