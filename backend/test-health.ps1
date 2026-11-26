# PowerShell script to test live Spring Boot health check with test profile
$jarPath = "C:\Users\thavi\OneDrive\Desktop\AccessCore\backend\target\accesscore-backend-0.0.1-SNAPSHOT.jar"
$javaExe = "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot\bin\java.exe"

Write-Host "Starting Spring Boot application in background with active profile..."
$proc = Start-Process -FilePath $javaExe -ArgumentList "-Dspring.profiles.active=test", "-jar", "`"$jarPath`"" -PassThru -WindowStyle Hidden

try {
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 1
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8080/api/health" -Method Get -TimeoutSec 2 -ErrorAction Stop
            if ($response.status -eq "UP") {
                $ready = $true
                Write-Host ">>> LIVE HEALTH CHECK SUCCESSFUL! <<<"
                $response | ConvertTo-Json
                break
            }
        }
        catch {
            # Still booting up
        }
    }

    if (-not $ready) {
        Write-Host "Error: Health check did not respond with UP within 30 seconds."
        exit 1
    }
}
finally {
    Write-Host "Terminating background test instance..."
    Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue
}
