Write-Host "🚀 Iniciando validación de Neural Nexus..." -ForegroundColor Cyan

# 1. Ejecutar Linter
Write-Host "`n🔍 Paso 1: Ejecutando Linter..." -ForegroundColor Yellow
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Linter fallido. Por favor, corrige los errores antes de continuar." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Linter completado satisfactoriamente." -ForegroundColor Green

# 2. Ejecutar Build
Write-Host "`n🏗️ Paso 2: Ejecutando Build (Simulación de Vercel)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build fallido. Deployment en Vercel fallaría con este código." -ForegroundColor Red
    exit 1
}

Write-Host "`n✨ VALIDACIÓN EXITOSA ✨" -ForegroundColor Green
Write-Host "El código es seguro para Commit y Push." -ForegroundColor Cyan
exit 0
