$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot

function Test-AppHealth([int]$Port) {
  try {
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health" -TimeoutSec 2
    return $response.ok -eq $true -and $response.appId -eq 'financial-ai-analyst'
  } catch { return $false }
}
function Open-App([int]$Port) {
  if ($env:FINANCIAL_ANALYST_LAUNCHER_TEST -ne '1') { Start-Process "http://127.0.0.1:$Port" }
}

try {
  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) { throw 'Node.js 22 o superiore non e installato o non e nel PATH.' }
  $major = [int]((& node --version).TrimStart('v').Split('.')[0])
  if ($major -lt 22) { throw "Serve Node.js 22 o superiore. Versione trovata: $major." }

  $candidatePorts = 8000..8010
  foreach ($candidate in $candidatePorts) {
    if (Test-AppHealth $candidate) {
      Open-App $candidate
      Write-Host "Financial Analyst era gia attivo sulla porta ${candidate}: browser riaperto." -ForegroundColor Green
      exit 0
    }
  }

  $port = $null
  foreach ($candidate in $candidatePorts) {
    $occupied = Get-NetTCPConnection -LocalPort $candidate -State Listen -ErrorAction SilentlyContinue
    if (-not $occupied) { $port = $candidate; break }
  }
  if ($null -eq $port) { throw 'Le porte da 8000 a 8010 sono occupate. Chiudi uno dei programmi in ascolto e riprova.' }
  if ($port -ne 8000) { Write-Host "La porta 8000 e occupata da un altro servizio. Uso la porta libera $port." -ForegroundColor Yellow }

  if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'node_modules'))) {
    Write-Host 'Installazione dipendenze...' -ForegroundColor Cyan
    & npm.cmd install
    if ($LASTEXITCODE -ne 0) { throw 'Installazione dipendenze non riuscita.' }
  }
  Write-Host 'Preparazione applicazione...' -ForegroundColor Cyan
  & npm.cmd run build
  if ($LASTEXITCODE -ne 0) { throw 'Build non riuscita. Controlla i messaggi precedenti.' }

  $previousPort = $env:PORT
  $env:PORT = [string]$port
  try {
    $server = Start-Process -FilePath node -ArgumentList 'server/index.js' -WorkingDirectory $projectRoot -PassThru -WindowStyle Hidden
  } finally {
    if ($null -eq $previousPort) { Remove-Item Env:PORT -ErrorAction SilentlyContinue } else { $env:PORT = $previousPort }
  }

  try {
    $ready = $false
    for ($attempt = 0; $attempt -lt 40; $attempt++) {
      if ($server.HasExited) { throw "Il server si e chiuso con codice $($server.ExitCode)." }
      if (Test-AppHealth $port) { $ready = $true; break }
      Start-Sleep -Milliseconds 250
    }
    if (-not $ready) { throw 'Il server non ha risposto entro 10 secondi.' }
    Open-App $port
    Write-Host "Financial Analyst e pronto sulla porta $port. Chiudi questa finestra o premi Ctrl+C per arrestarlo." -ForegroundColor Green
    if ($env:FINANCIAL_ANALYST_LAUNCHER_TEST -eq '1') { return }
    $server.WaitForExit()
  } finally {
    if ($server -and -not $server.HasExited) { Stop-Process -Id $server.Id -ErrorAction SilentlyContinue }
  }
} catch {
  Write-Host ''
  Write-Host "ERRORE: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
