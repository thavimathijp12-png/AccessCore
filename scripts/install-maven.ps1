# Script to install Maven locally in user tools directory
$ErrorActionPreference = "Stop"
$zipUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.9/binaries/apache-maven-3.9.9-bin.zip"
$destZip = "$env:TEMP\apache-maven-3.9.9-bin.zip"
$toolsDir = "C:\Users\thavi\tools"

if (-not (Test-Path $toolsDir)) {
    New-Item -ItemType Directory -Path $toolsDir -Force | Out-Null
}

$mavenHome = "$toolsDir\apache-maven-3.9.9"
if (-not (Test-Path "$mavenHome\bin\mvn.cmd")) {
    Write-Host "Downloading Apache Maven 3.9.9..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $zipUrl -OutFile $destZip
    Write-Host "Extracting Apache Maven 3.9.9 to $toolsDir..."
    Expand-Archive -Path $destZip -DestinationPath $toolsDir -Force
    if (Test-Path $destZip) { Remove-Item $destZip -Force }
}

Write-Host "Configuring User PATH..."
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$mavenBin = "$mavenHome\bin"
if ($userPath -notlike "*$mavenBin*") {
    $newUserPath = "$userPath;$mavenBin"
    [Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
    Write-Host "Added $mavenBin to User PATH."
}

$env:Path = "$mavenBin;$env:Path"
Write-Host "Verifying Maven..."
& "$mavenBin\mvn.cmd" -v
