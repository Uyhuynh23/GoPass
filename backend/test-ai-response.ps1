# Test to see full AI response from SmartBot
# Run this to capture the exact response that's causing parsing errors
# Now testing new ForumPackage structure

$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:5001/api"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "TEST: AI Response - ForumPackage Structure" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
Write-Host "Expected AI response format:" -ForegroundColor Yellow
Write-Host "  {" -ForegroundColor Gray
Write-Host "    packageTitle: string" -ForegroundColor Gray
Write-Host "    packageSummary: string (150-300 chu)" -ForegroundColor Gray
Write-Host "    topics: [" -ForegroundColor Gray
Write-Host "      { topicTitle, seedComment (~200 chu), essayPrompt }" -ForegroundColor Gray
Write-Host "    ]," -ForegroundColor Gray
Write-Host "    tags: []" -ForegroundColor Gray
Write-Host "  }`n" -ForegroundColor Gray

# Login
Write-Host "[1] Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@gopass.vn"
    password = "123456"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.accessToken
Write-Host "    ✓ Logged in`n" -ForegroundColor Green

# Get topics
Write-Host "[2] Getting VnSocial topics..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
$topicsResponse = Invoke-RestMethod -Uri "$baseUrl/vnsocial/topics?type=keyword" -Method GET -Headers $headers
$topicId = $topicsResponse.data.topics[1].id
Write-Host "    ✓ Topic ID: $topicId`n" -ForegroundColor Green

# Generate forum topics and let server log the AI response
Write-Host "[3] Generating forum topics..." -ForegroundColor Yellow
Write-Host "    Server will log full AI response. Check server console!`n" -ForegroundColor Cyan

$endTime = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
$startTime = [DateTimeOffset]::Now.AddDays(-7).ToUnixTimeMilliseconds()

$generateBody = @{
    topicId = $topicId
    count = 3
    source = "baochi"
    startTime = $startTime
    endTime = $endTime
} | ConvertTo-Json

Write-Host "[REQUEST]" -ForegroundColor Gray
Write-Host $generateBody -ForegroundColor DarkGray
Write-Host ""

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/forum/topics/generate" `
        -Method POST `
        -Body $generateBody `
        -Headers $headers
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    if ($response.data.package) {
        Write-Host "[FORUM PACKAGE]" -ForegroundColor Cyan
        Write-Host "  Package ID: $($response.data.package._id)" -ForegroundColor Gray
        Write-Host "  Title: $($response.data.package.packageTitle)" -ForegroundColor White
        Write-Host "  Summary Length: $($response.data.package.packageSummary.Length) chars`n" -ForegroundColor Gray
    }
    
    Write-Host "[FORUM TOPICS]" -ForegroundColor Cyan
    Write-Host "  Total created: $($response.data.total)" -ForegroundColor Green
    
    foreach ($topic in $response.data.topics) {
        Write-Host "`n  - $($topic.title)" -ForegroundColor White
        Write-Host "    Seed Comment: $($topic.seedComment.Length) chars" -ForegroundColor Gray
        Write-Host "    Essay Prompt: $($topic.essayPrompt.Length) chars" -ForegroundColor Gray
    }
    Write-Host ""
    
} catch {
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "ERROR!" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        $reader.Close()
        Write-Host "`n[Response Body]" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "CHECK SERVER CONSOLE FOR:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. '🤖 [AI Response] Raw text from SmartBot:'" -ForegroundColor Yellow
Write-Host "2. Full JSON with packageTitle, packageSummary, topics[]" -ForegroundColor Yellow
Write-Host "3. Validation messages for each field" -ForegroundColor Yellow
Write-Host "4. Any parsing errors or missing fields`n" -ForegroundColor Yellow
