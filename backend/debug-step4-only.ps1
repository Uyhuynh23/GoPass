# ========================================
# DEBUG STEP 4 ONLY - Forum Topics Generation
# ========================================

$ErrorActionPreference = "Continue"
$baseUrl = "http://localhost:5001/api"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DEBUG STEP 4: GENERATE FORUM TOPICS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# ========================================
# STEP 1: Login (Quick)
# ========================================
Write-Host "[STEP 1] Quick Login..." -ForegroundColor Yellow

$loginBody = @{
    email = "admin@gopass.vn"
    password = "123456"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    
    $token = $loginResponse.data.accessToken
    Write-Host "[OK] Token: $($token.Substring(0, 20))...`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Login failed: $_" -ForegroundColor Red
    exit 1
}

# ========================================
# STEP 2: Get VnSocial Topics (Quick)
# ========================================
Write-Host "[STEP 2] Get VnSocial Topics..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    $topicsResponse = Invoke-RestMethod -Uri "$baseUrl/vnsocial/topics?type=keyword" `
        -Method GET `
        -Headers $headers
    
    $selectedTopic = $topicsResponse.data.topics[0]
    $topicId = $selectedTopic.id
    $topicName = $selectedTopic.name
    
    Write-Host "[OK] Selected Topic: $topicName" -ForegroundColor Green
    Write-Host "     Topic ID: $topicId`n" -ForegroundColor Gray
} catch {
    Write-Host "[ERROR] Failed to get topics: $_" -ForegroundColor Red
    exit 1
}

# ========================================
# STEP 3: Get Hot Posts (Quick)
# ========================================
Write-Host "[STEP 3] Get Hot Posts..." -ForegroundColor Yellow

$endTime = [DateTimeOffset]::Now.ToUnixTimeMilliseconds()
$startTime = [DateTimeOffset]::Now.AddDays(-7).ToUnixTimeMilliseconds()

$hotPostsBody = @{
    project_id = $topicId
    source = "baochi"
    start_time = $startTime
    end_time = $endTime
} | ConvertTo-Json

try {
    $hotPostsResponse = Invoke-RestMethod -Uri "$baseUrl/vnsocial/posts/hot" `
        -Method POST `
        -Body $hotPostsBody `
        -Headers $headers
    
    $postsCount = $hotPostsResponse.data.posts.Count
    Write-Host "[OK] Got $postsCount hot posts`n" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Failed to get hot posts: $_" -ForegroundColor Red
    exit 1
}

# ========================================
# STEP 4: GENERATE FORUM TOPICS (DETAILED DEBUG)
# ========================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 4: GENERATE FORUM TOPICS (DETAILED)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "[INFO] This will:" -ForegroundColor Yellow
Write-Host "  1. Fetch articles from VnSocial" -ForegroundColor Gray
Write-Host "  2. Send article to SmartBot AI" -ForegroundColor Gray
Write-Host "  3. Parse AI response (packageTitle, packageSummary, topics[])" -ForegroundColor Gray
Write-Host "  4. Create ForumPackage (1) + ForumTopics (3)" -ForegroundColor Gray
Write-Host "  5. Link topics to package via packageId`n" -ForegroundColor Gray

$generateBody = @{
    topicId = $topicId
    count = 3
    source = "baochi"
    startTime = $startTime
    endTime = $endTime
} | ConvertTo-Json

Write-Host "[REQUEST BODY]" -ForegroundColor Cyan
Write-Host $generateBody -ForegroundColor Gray
Write-Host ""

Write-Host "[CALLING API] POST /api/forum/topics/generate..." -ForegroundColor Yellow
Write-Host "Please wait... (This may take 30-60 seconds)`n" -ForegroundColor Gray

try {
    # Call với verbose error handling
    $response = Invoke-WebRequest -Uri "$baseUrl/forum/topics/generate" `
        -Method POST `
        -Body $generateBody `
        -Headers $headers `
        -ContentType "application/json" `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "`n========================================" -ForegroundColor Green
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Green
    
    $result = $response.Content | ConvertFrom-Json
    
    Write-Host "[RESPONSE STATUS] $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    Write-Host "[TOPICS CREATED] $($result.data.total)`n" -ForegroundColor Green
    
    # Display ForumPackage info
    if ($result.data.package) {
        Write-Host "[FORUM PACKAGE]" -ForegroundColor Cyan
        Write-Host "  Package ID: $($result.data.package._id)" -ForegroundColor Gray
        Write-Host "  Package Title: $($result.data.package.packageTitle)" -ForegroundColor White
        Write-Host "  Package Summary: $($result.data.package.packageSummary.Substring(0, [Math]::Min(150, $result.data.package.packageSummary.Length)))..." -ForegroundColor Gray
        Write-Host ""
    }
    
    Write-Host "[FORUM TOPICS]" -ForegroundColor Cyan
    foreach ($topic in $result.data.topics) {
        Write-Host "---" -ForegroundColor Gray
        Write-Host "Topic Title: $($topic.title)" -ForegroundColor White
        Write-Host "Package ID: $($topic.packageId)" -ForegroundColor Gray
        Write-Host "Seed Comment (~200 words): $($topic.seedComment.Substring(0, [Math]::Min(100, $topic.seedComment.Length)))..." -ForegroundColor Cyan
        Write-Host "Essay Prompt: $($topic.essayPrompt.Substring(0, [Math]::Min(80, $topic.essayPrompt.Length)))..." -ForegroundColor Yellow
        Write-Host ""
    }
    
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $statusDescription = $_.Exception.Response.StatusDescription
    
    Write-Host "`n========================================" -ForegroundColor Red
    Write-Host "ERROR OCCURRED!" -ForegroundColor Red
    Write-Host "========================================`n" -ForegroundColor Red
    
    Write-Host "[HTTP STATUS] $statusCode $statusDescription`n" -ForegroundColor Red
    
    Write-Host "[ERROR DETAILS]" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    
    # Try to get response body
    if ($_.Exception.Response) {
        try {
            $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            $reader.Close()
            
            Write-Host "[RESPONSE BODY]" -ForegroundColor Yellow
            Write-Host $responseBody -ForegroundColor Red
            Write-Host ""
            
            # Try to parse as JSON for better formatting
            try {
                $errorJson = $responseBody | ConvertFrom-Json
                if ($errorJson.message) {
                    Write-Host "[ERROR MESSAGE] $($errorJson.message)" -ForegroundColor Red
                }
                if ($errorJson.error) {
                    Write-Host "[ERROR TYPE] $($errorJson.error)" -ForegroundColor Red
                }
            } catch {
                # Not JSON, already printed raw
            }
        } catch {
            Write-Host "[RESPONSE BODY] Could not read response body" -ForegroundColor Red
        }
    }
    
    Write-Host "`n[DEBUG INSTRUCTIONS]" -ForegroundColor Yellow
    Write-Host "Check server console logs for:" -ForegroundColor Gray
    Write-Host "  1. '🤖 [AI Response] Raw text from SmartBot' - Full AI response" -ForegroundColor Gray
    Write-Host "  2. 'packageTitle', 'packageSummary', 'topics[]' - Validation" -ForegroundColor Gray
    Write-Host "  3. 'topicTitle', 'seedComment', 'essayPrompt' - Each topic validation" -ForegroundColor Gray
    Write-Host "  4. Error stack trace with exact line number" -ForegroundColor Gray
    Write-Host "  5. 'ForumPackage created' - Package creation status`n" -ForegroundColor Gray
    
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "DEBUG COMPLETE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "[SUMMARY]" -ForegroundColor Yellow
Write-Host "✓ Login successful" -ForegroundColor Green
Write-Host "✓ VnSocial topics fetched" -ForegroundColor Green
Write-Host "✓ Hot posts retrieved" -ForegroundColor Green
Write-Host "✓ Forum topics generated" -ForegroundColor Green
Write-Host "`nAll steps completed successfully!`n" -ForegroundColor Green
