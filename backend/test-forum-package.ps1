# Test ForumPackage structure with SmartBot AI
$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:5001/api"

Write-Host "`n========================================"
Write-Host "TEST: ForumPackage Structure" -ForegroundColor Cyan
Write-Host "========================================`n"

Write-Host "Expected format:" -ForegroundColor Yellow
Write-Host "  packageTitle: string"
Write-Host "  packageSummary: string (150-300 words)"
Write-Host "  topics: [{topicTitle, seedComment, essayPrompt}]`n"

# Step 1: Login
Write-Host "[1] Logging in..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@gopass.vn"
    password = "123456"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.data.accessToken
Write-Host "    Success!`n" -ForegroundColor Green

# Step 2: Get VnSocial topics
Write-Host "[2] Getting VnSocial topics..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
$topicsResponse = Invoke-RestMethod -Uri "$baseUrl/vnsocial/topics?type=keyword" -Method GET -Headers $headers
$topicId = $topicsResponse.data.topics[1].id
Write-Host "    Topic ID: $topicId`n" -ForegroundColor Green

# Step 3: Generate forum topics
Write-Host "[3] Generating forum topics..." -ForegroundColor Yellow
Write-Host "    Check server console for AI response!`n" -ForegroundColor Cyan

$endTime = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
$startTime = [DateTimeOffset]::Now.AddDays(-7).ToUnixTimeMilliseconds()

$generateBody = @{
    topicId = $topicId
    count = 3
    source = "baochi"
    startTime = $startTime
    endTime = $endTime
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/forum/topics/generate" -Method POST -Body $generateBody -Headers $headers
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    if ($response.data.package) {
        Write-Host "[FORUM PACKAGE]" -ForegroundColor Cyan
        Write-Host "  ID: $($response.data.package._id)"
        Write-Host "  Title: $($response.data.package.packageTitle)" -ForegroundColor White
        Write-Host "  Summary: $($response.data.package.packageSummary.Length) chars`n"
    }
    
    Write-Host "[FORUM TOPICS] Total: $($response.data.total)" -ForegroundColor Cyan
    foreach ($topic in $response.data.topics) {
        Write-Host "`n  Topic: $($topic.title)" -ForegroundColor White
        Write-Host "    packageId: $($topic.packageId)"
        Write-Host "    seedComment: $($topic.seedComment.Length) chars"
        Write-Host "    essayPrompt: $($topic.essayPrompt.Length) chars"
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
        Write-Host "`n$responseBody" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "CHECK SERVER CONSOLE FOR:" -ForegroundColor Yellow
Write-Host "  - Raw AI response from SmartBot"
Write-Host "  - packageTitle, packageSummary validation"
Write-Host "  - topics array with seedComment (~200 words)"
Write-Host "========================================`n"
