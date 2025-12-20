# Debug script - Test tung buoc API
# NOTE: Server phai dang chay tren port 5001 (cd backend; npm run dev)

Write-Host "================================================="
Write-Host "Debug VnSmartBot API - Step by Step"
Write-Host "================================================="
Write-Host ""

# Check if server is running
Write-Host "Checking if server is running on port 5001..."
try {
    # Kiem tra server co dang hoat dong khong
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -Method Get -ErrorAction Stop
    Write-Host "Server is running"
}
catch {
    Write-Host "Server is NOT running on port 5001"
    Write-Host ""
    Write-Host "Please start server first:"
    Write-Host "  Terminal 1: cd backend; npm run dev"
    Write-Host "  Terminal 2: cd backend; .\debug-smartbot.ps1"
    Write-Host ""
    exit 1
}

Write-Host ""

# Get fresh token
Write-Host "Step 1: Getting admin token..."
# Giai thich: Dang nhap bang tai khoan admin mac dinh de lay JWT token dung cho cac request sau
try {
    $loginBody = @{
        email = "admin@gopass.vn"
        password = "123456"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/auth/login" `
        -Method Post `
        -Body $loginBody `
        -ContentType "application/json"

    Write-Host "Login response:"
    $loginResponse | ConvertTo-Json -Depth 5 | Write-Host
    Write-Host ""

    $token = $loginResponse.data.accessToken

    if (-not $token) {
        throw "Token is empty"
    }
    Write-Host "Token obtained"
}
catch {
    Write-Host "Failed to get token"
    Write-Host "Check if admin account exists with password: 123456"
    Write-Host $_
    exit 1
}

Write-Host ""

# Test 1: Get VnSocial topics
Write-Host "================================================="
Write-Host "Test 1: Testing VnSocial /topics endpoint"
Write-Host "================================================="
Write-Host ""

# Giai thich: Goi API lay danh sach cac chu de (topics) tu VnSocial da duoc cau hinh
Write-Host "Calling GET /api/vnsocial/topics..."
try {
    $headers = @{
        Authorization = "Bearer $token"
        "Content-Type" = "application/json"
    }

    $topicsResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/vnsocial/topics" `
        -Method Get `
        -Headers $headers

    $topicsResponse | ConvertTo-Json -Depth 5 | Write-Host

    $topicsCount = 0
    if ($topicsResponse.data -and $topicsResponse.data.total) {
        $topicsCount = $topicsResponse.data.total
    }

    Write-Host ""
    if ($topicsCount -eq 0) {
        Write-Host "WARNING: VnSocial returned 0 topics!"
        Write-Host "This means your VnSocial account has no topics configured."
        Write-Host "You need to create topics in VnSocial platform first."
        Write-Host ""
    }
    else {
        Write-Host "Found $topicsCount topics"
        Write-Host ""
    }
}
catch {
    Write-Host "Failed to get topics"
    Write-Host $_
}

Write-Host "================================================="
Write-Host ""

# Test 2: Time range calculation
Write-Host "Test 2: Calculate time range for last 7 days"
Write-Host ""

# Giai thich: Tinh toan thoi gian bat dau va ket thuc (7 ngay qua) de query du lieu
# VnSocial API yeu cau timestamp dang milliseconds
$endTime = Get-Date
$startTime = $endTime.AddDays(-7)

# Convert to Unix timestamp in milliseconds
$endTimeMs = [int64](($endTime - (Get-Date "1970-01-01").ToLocalTime()).TotalMilliseconds)
$startTimeMs = [int64](($startTime - (Get-Date "1970-01-01").ToLocalTime()).TotalMilliseconds)

Write-Host "Time Range:"
Write-Host "  Start: $($startTime.ToString('yyyy-MM-dd HH:mm:ss')) ($startTimeMs)"
Write-Host "  End:   $($endTime.ToString('yyyy-MM-dd HH:mm:ss')) ($endTimeMs)"
Write-Host ""
Write-Host "================================================="
Write-Host ""

# Test 3: Test getHotPosts directly with first topic
Write-Host "Test 3: Testing getHotPosts with first topic"
Write-Host ""

$postsCount = 0
$firstTopicName = ""

if ($topicsCount -gt 0) {
    # Extract first topic ID (use AI topic which has data if available)
    $topics = $topicsResponse.data.topics
    $aiTopic = $topics | Where-Object { $_.name -eq 'AI' } | Select-Object -First 1
    
    if (-not $aiTopic) {
        $aiTopic = $topics[0]
    }
    
    $firstTopicId = $aiTopic.id
    $firstTopicName = $aiTopic.name

    Write-Host "Testing with topic: $firstTopicName (ID: $firstTopicId)"
    Write-Host ""

    # Giai thich: Goi truc tiep API cua VnSocial de kiem tra xem co bai viet hot nao khong
    # Dieu nay giup xac dinh loi do backend cua minh hay do VnSocial khong tra ve du lieu
    Write-Host "Calling VnSocial hot-posts API directly..."
    
    # Get VnSocial token from env file
    $envPath = Join-Path $PSScriptRoot ".env"
    if (-not (Test-Path $envPath)) {
        $envPath = ".\.env"
    }
    
    $vnSocialToken = ""
    if (Test-Path $envPath) {
        $envContent = Get-Content $envPath
        foreach ($line in $envContent) {
            if ($line -match "^VNSOCIAL_TOKEN=(.*)$") {
                $vnSocialToken = $matches[1]
                break
            }
        }
    }

    if (-not $vnSocialToken) {
        Write-Host "Could not find VNSOCIAL_TOKEN in .env file. Skipping direct API test."
    }
    else {
        try {
            $hotPostsBody = @{
                project_id = $firstTopicId
                source = "baochi"
                start_time = $startTimeMs
                end_time = $endTimeMs
            } | ConvertTo-Json

            $hotPostsResponse = Invoke-RestMethod -Uri "https://api-vnsocialplus.vnpt.vn/social-api/v1/projects/hot-posts" `
                -Method Post `
                -Headers @{ "x-access-token" = $vnSocialToken; "Content-Type" = "application/json" } `
                -Body $hotPostsBody

            Write-Host "Hot Posts Response:"
            $hotPostsResponse | ConvertTo-Json -Depth 2 | Write-Host

            if ($hotPostsResponse.object -is [array]) {
                $postsCount = $hotPostsResponse.object.Count
            }
            
            Write-Host ""
            Write-Host "Posts found: $postsCount"
            Write-Host ""
        }
        catch {
            Write-Host "Failed to call VnSocial API directly"
            Write-Host $_
        }
    }
} 
else {
    Write-Host "Skipping Test 3 because no topics were found."
}

Write-Host "================================================="
Write-Host ""

# Test 3.5: Test SmartBot directly with a simple prompt
Write-Host "Test 3.5: Testing SmartBot API directly"
Write-Host ""

$testPromptBody = @{
    sender_id = "test_user"
    text = "Tao 3 cau hoi tranh luan tu bai bao: AI dang phat trien nhanh chong"
    input_channel = "platform"
    session_id = "test_session_$(Get-Date -Format 'yyyyMMddHHmmss')"
    settings = @{
        system_prompt = "Ban la mot tro ly AI chuyen tao cau hoi tranh luan."
    }
} | ConvertTo-Json

Write-Host "Calling SmartBot API..."
try {
    $smartBotResponse = Invoke-RestMethod -Uri "http://localhost:5001/api/smartbot/conversation" `
        -Method Post `
        -Headers $headers `
        -Body $testPromptBody `
        -ContentType "application/json" `
        -TimeoutSec 30

    Write-Host "SmartBot Response:"
    $smartBotResponse | ConvertTo-Json -Depth 5 | Write-Host
    Write-Host ""
    
    if ($smartBotResponse.success) {
        Write-Host "SmartBot is working correctly!"
    } else {
        Write-Host "SmartBot returned error"
    }
}
catch {
    Write-Host "Failed to call SmartBot API"
    Write-Host $_
}

Write-Host ""
Write-Host "================================================="
Write-Host ""

# Test 4: Now test the full social-debates endpoint
Write-Host "Test 4: Testing /admin/social-debates endpoint"
Write-Host ""

# Giai thich: Goi API backend cua minh de tao cac chu de tranh luan (debates) tu du lieu social
# API nay co 2 LUONG (2 REQUESTS):
#   Luong 1: Backend goi VnSocial API -> Lay danh sach bai viet noi bat (hot posts)
#   Luong 2: Backend goi SmartBot API -> Truyen bai viet -> AI tao cau hoi tranh luan
# Tat ca deu duoc xu li tu dong boi endpoint /admin/social-debates
$baseUrl = 'http://localhost:5001/api/admin/social-debates'
# Dung format string de tranh PowerShell parse nham ky tu '&' trong URL
$url = '{0}?start_time={1}&end_time={2}&source=baochi' -f $baseUrl, $startTimeMs, $endTimeMs

Write-Host "URL: $url"
Write-Host ""
Write-Host "Calling API..."
Write-Host "Note: API se thuc hien 2 luong:"
Write-Host "  1. GET hot posts tu VnSocial"
Write-Host "  2. POST moi bai viet den SmartBot de tao cau hoi"
Write-Host "Tong thoi gian co the mat 20-30 giay..."
Write-Host ""

$debatesCount = 0
try {
    $debatesResponse = Invoke-RestMethod -Uri $url `
        -Method Get `
        -Headers $headers `
        -TimeoutSec 60

    Write-Host "Response:"
    $debatesResponse | ConvertTo-Json -Depth 5 | Write-Host

    if ($debatesResponse.data -and $debatesResponse.data.total) {
        $debatesCount = $debatesResponse.data.total
    }
}
catch {
    Write-Host "Failed to get social debates"
    Write-Host $_
}

Write-Host ""
Write-Host "================================================="
Write-Host "Summary:"
Write-Host "================================================="
Write-Host ""
Write-Host "1. Server status: Running on port 5001"
Write-Host "2. VnSocial topics: $topicsCount"
Write-Host "3. Hot posts for '$firstTopicName': $postsCount"
Write-Host "4. Debate topics generated: $debatesCount"

Write-Host ""
if ($topicsCount -eq 0) {
    Write-Host "ISSUE FOUND: No VnSocial topics available"
    Write-Host ""
    Write-Host "SOLUTION:"
    Write-Host "1. Login to VnSocial platform: https://vnsocial.vnpt.vn"
    Write-Host "2. Create some topics (projects) with type TOPIC_POLICY"
    Write-Host "3. Run this script again"
    Write-Host ""
}
elseif ($postsCount -eq 0) {
    Write-Host "ISSUE: Topics exist but NO hot posts in time range"
    Write-Host ""
    Write-Host "REASON: No news articles found for this topic in the last 7 days"
    Write-Host ""
    Write-Host "SOLUTIONS:"
    Write-Host "1. Try a longer time range - 30 days"
    Write-Host "2. Try different source - facebook youtube tiktok"
    Write-Host "3. Check if topic has data in VnSocial dashboard"
    Write-Host ""
}
elseif ($debatesCount -eq 0) {
    Write-Host "Posts exist but no debates generated"
    Write-Host "This may be a vnSmartBot API issue"
    Write-Host "Check server logs for AI generation errors"
    Write-Host ""
}
else {
    Write-Host "SUCCESS: Generated $debatesCount debate topics!"
    Write-Host ""
}

Write-Host "================================================="
Write-Host "Check the backend terminal for detailed logs"
Write-Host "================================================="
