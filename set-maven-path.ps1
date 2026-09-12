# set-maven-path.ps1 – add Maven to PATH for this project

# Resolve the Maven bin directory relative to this script's location
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$mavenBin = Join-Path $scriptDir "apache-maven-3.9.9\bin"

if (-Not (Test-Path $mavenBin)) {
    Write-Error "Maven bin directory not found at $mavenBin. Ensure Maven is extracted correctly."
    exit 1
}

# Add to PATH if not already present
if ($env:Path -notlike "*$mavenBin*") {
    $env:Path = "$mavenBin;$env:Path"
    Write-Host "Added Maven to PATH: $mavenBin"
} else {
    Write-Host "Maven bin already in PATH."
}

# Optionally, expose mvn command directly for the current session
Set-Alias mvn "$mavenBin\mvn.cmd"

# Show version to confirm
& "$mavenBin\mvn.cmd" -v
