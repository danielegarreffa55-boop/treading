$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectRoot
$healthUrl = 'http://127.0.0.1:8000/api/health'
$appUrl = 'http://127.0.0.1:8000'
function Test-AppHealth { try { $response = Invoke-RestMethod -Uri $healthUrl -TimeoutSec 2; return $response.ok -eq $true -and $response.appId -eq 'financial-ai-analyst' } catch { return $false } }
try {
  $node = Get-Command node -ErrorAction SilentlyContinue
  if (-not $node) { throw 'Node.js 22 o superiore non è installato o non è nel PATH.' }
  $major = [int]((& node --version).TrimStart('v').Split('.')[0])
  if ($major -lt 22) { throw "Serve Node.js 22 o superiore. Versione trovata: $major." }
  if (Test-AppHealth) { Start-Process $appUrl; Write-Host 'Financial Analyst era già attivo: browser riaperto.' -ForegroundColor Green; exit 0 }
  $occupied = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
  if ($occupied) { throw 'La porta 8000 è occupata da un altro programma. Chiudilo o modifica PORT prima di riprovare.' }
  if (-not (Test-Path -LiteralPath (Join-Path $projectRoot 'node_modules'))) { Write-Host 'Installazione dipendenze...' -ForegroundColor Cyan; & npm.cmd install; if ($LASTEXITCODE -ne 0) { throw 'Installazione dipendenze non riuscita.' } }
  Write-Host 'Preparazione applicazione...' -ForegroundColor Cyan
  & npm.cmd run build
  if ($LASTEXITCODE -ne 0) { throw 'Build non riuscita. Controlla i messaggi precedenti.' }
  $server = Start-Process -FilePath node -ArgumentList 'server/index.js' -WorkingDirectory $projectRoot -PassThru -NoNewWindow
  try {
    $ready = $false
    for ($attempt=0; $attempt -lt 40; $attempt++) { if ($server.HasExited) { throw "Il server si è chiuso con codice $($server.ExitCode)." }; if (Test-AppHealth) { $ready = $true; break }; Start-Sleep -Milliseconds 250 }
    if (-not $ready) { throw 'Il server non ha risposto entro 10 secondi.' }
    Start-Process $appUrl
    Write-Host 'Financial Analyst è pronto. Chiudi questa finestra o premi Ctrl+C per arrestarlo.' -ForegroundColor Green
    $server.WaitForExit()
  } finally { if ($server -and -not $server.HasExited) { Stop-Process -Id $server.Id -ErrorAction SilentlyContinue } }
} catch { Write-Host ''; Write-Host "ERRORE: $($_.Exception.Message)" -ForegroundColor Red; exit 1 }
