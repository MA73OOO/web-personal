# Harness: Git Preparation and Pre-Commit Validator
# Usage: .\harness\deploy-config\git-prep.ps1

Write-Host "[Harness - Deploy and Config] Ejecutando validaciones antes de commit..." -ForegroundColor Cyan

# Run Frontend build validator
node harness/frontend/validate-build.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "[OK] El proyecto esta limpio y listo para commit/push." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "[FAIL] No realices commit hasta corregir los errores indicados." -ForegroundColor Red
    exit 1
}
