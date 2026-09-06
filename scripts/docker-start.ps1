
# Check if Docker Desktop is running
$dockerProcess = Get-Process -Name "Docker Desktop" -ErrorAction SilentlyContinue

if ($null -eq $dockerProcess) {
    Write-Host "Docker Desktop is not running. Starting..."
    # Launch Docker Desktop
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"

    # Wait for Docker to be ready
    Write-Host "Waiting for Docker to start..."
    $maxAttempts = 30
    $attempt = 0
    $dockerReady = $false

    while ($attempt -lt $maxAttempts -and -not $dockerReady) {
        try {
            docker info | Out-Null
            $dockerReady = $true
            Write-Host "Docker is ready."
        } catch {
            Start-Sleep -Seconds 5
            $attempt++
            Write-Host "Waiting... ($attempt/$maxAttempts)"
        }
    }

    if (-not $dockerReady) {
        Write-Error "Docker failed to start within the timeout period."
        exit 1
    }
} else {
    Write-Host "Docker Desktop is already running."
}

# Run docker-compose
Write-Host "Bringing up docker-compose services..."
docker-compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "Docker services are up."
} else {
    Write-Error "Failed to bring up docker services."
    exit $LASTEXITCODE
}
