# Harness: Check Environment Status (Deployment and Config)
# Usage: .\harness\validations\check-env.ps1

Write-Host "[Harness - Deploy and Config] Verificando estado del entorno local..." -ForegroundColor Cyan

# 1. Node version
$nodeVersion = node -v
Write-Host "  * Node Version: $nodeVersion" -ForegroundColor Green

# 2. Git Status
$gitBranch = git branch --show-current
$gitRemote = git remote get-url origin 2>$null
Write-Host "  * Git Branch: $gitBranch" -ForegroundColor Green
Write-Host "  * Git Remote: $gitRemote" -ForegroundColor Green

# 3. Next.js and Dependencies
if (Test-Path "node_modules") {
    Write-Host "  * node_modules: Instalado" -ForegroundColor Green
} else {
    Write-Host "  * node_modules: FALTA (Ejecuta npm install)" -ForegroundColor Red
}

# 4. Vault and Agent docs
if (Test-Path ".agents/AGENTS.md") {
    Write-Host "  * Contexto de Agentes: OK" -ForegroundColor Green
} else {
    Write-Host "  * Contexto de Agentes: FALTA (.agents/AGENTS.md)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "[OK] Verificación de entorno completada." -ForegroundColor Cyan
