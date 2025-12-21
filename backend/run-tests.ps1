# Run all tests with Vitest
Write-Host "Running VnSmartBot and VnSocial Route Tests..." -ForegroundColor Cyan
Write-Host "Clearing cache..." -ForegroundColor Yellow

# Clear vitest cache
npx vitest run --no-cache --clearCache

Write-Host "`nRunning tests..." -ForegroundColor Cyan
npx vitest run --reporter=verbose

Write-Host "`nTests completed!" -ForegroundColor Green
Write-Host "`nTo run with coverage: npm run test:coverage" -ForegroundColor Cyan
Write-Host "To run with UI: npm run test:ui" -ForegroundColor Cyan
