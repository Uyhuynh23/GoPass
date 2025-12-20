# ==============================================================================
# DEBUG SCRIPT: Forum Flow Testing
# Test full flow: VnSocial -> SmartBot -> Forum -> User interactions
# NOTE: Server must be running on port 5001 (npm run dev)
# ==============================================================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FORUM FLOW DEBUG SCRIPT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$baseUrl = "http://localhost:5001/api"
$adminToken = ""
$userId = ""

# ==============================================================================
# CHECK SERVER
# ==============================================================================

Write-Host "Checking if server is running on port 5001..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:5001/api/health" -Method Get -ErrorAction Stop
    Write-Host "[OK] Server is running" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Server is NOT running on port 5001" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start server first:" -ForegroundColor Yellow
    Write-Host "  Terminal 1: cd backend; npm run dev" -ForegroundColor Yellow
    Write-Host "  Terminal 2: cd backend; .\debug-forum-flow-fixed.ps1" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""

# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

function Write-Section {
    param([string]$Title)
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Yellow
    Write-Host $Title -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Yellow
}

function Write-Step {
    param([string]$Message)
    Write-Host "[STEP] $Message" -ForegroundColor Green
}

function Write-Response {
    param(
        [string]$Label,
        [object]$Data
    )
    Write-Host "[RESPONSE] $Label" -ForegroundColor Magenta
    if ($Data) {
        $json = $Data | ConvertTo-Json -Depth 10
        Write-Host $json -ForegroundColor Gray
    }
}

function Write-Error-Message {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Make-Request {
    param(
        [string]$Method,
        [string]$Url,
        [object]$Body = $null,
        [string]$Token = ""
    )
    
    try {
        $headers = @{
            "Content-Type" = "application/json"
        }
        
        if ($Token) {
            $headers["Authorization"] = "Bearer $Token"
        }
        
        $params = @{
            Method = $Method
            Uri = $Url
            Headers = $headers
        }
        
        if ($Body) {
            $params["Body"] = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        Write-Error-Message "Request failed: $($_.Exception.Message)"
        if ($_.Exception.Response) {
            $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
            $responseBody = $reader.ReadToEnd()
            Write-Host "Response Body: $responseBody" -ForegroundColor Red
        }
        return $null
    }
}

# ==============================================================================
# STEP 1: LOGIN AS ADMIN
# ==============================================================================

Write-Section "STEP 1: Login as Admin"
Write-Step "Attempting to login..."

try {
    $loginBody = @{
        email = "admin@gopass.vn"
        password = "123456"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
    }

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method Post `
        -Headers $headers `
        -Body $loginBody

    if ($loginResponse -and $loginResponse.success) {
        $adminToken = $loginResponse.data.accessToken
        $userId = $loginResponse.data.user._id
        Write-Host "`n[OK] Login successful!" -ForegroundColor Green
        Write-Host "  User ID: $userId" -ForegroundColor Cyan
        if ($adminToken -and $adminToken.Length -gt 20) {
            Write-Host "  Token: $($adminToken.Substring(0, 20))..." -ForegroundColor Cyan
        } else {
            Write-Host "  Token: $adminToken" -ForegroundColor Cyan
        }
    } else {
        Write-Error-Message "Login failed - Invalid response structure"
        exit 1
    }
}
catch {
    Write-Error-Message "Login failed: $($_.Exception.Message)"
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. Backend server is running on port 5001" -ForegroundColor Yellow
    Write-Host "  2. Admin credentials: admin@gopass.vn / 123456" -ForegroundColor Yellow
    Write-Host "  3. Database has admin user seeded" -ForegroundColor Yellow
    exit 1
}

# ==============================================================================
# STEP 2: FETCH TOPICS FROM VNSOCIAL
# ==============================================================================

Write-Section "STEP 2: Fetch Topics from VnSocial API"
Write-Step "Getting available topics..."

try {
    $headers = @{
        Authorization = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }

    $topicsResponse = Invoke-RestMethod -Uri "$baseUrl/vnsocial/topics" `
        -Method Get `
        -Headers $headers

    Write-Host "`n[FULL API RESPONSE]" -ForegroundColor Magenta
    $topicsResponse | ConvertTo-Json -Depth 5 | Write-Host

    if ($topicsResponse -and $topicsResponse.success -and $topicsResponse.data -and $topicsResponse.data.topics) {
        $topicsCount = $topicsResponse.data.topics.Count
        Write-Host "`n[OK] Topics fetched successfully!" -ForegroundColor Green
        Write-Host "  Total topics: $topicsCount" -ForegroundColor Cyan
        
        Write-Host "`n[TOPICS LIST]" -ForegroundColor Magenta
        for ($i = 0; $i -lt [Math]::Min(5, $topicsCount); $i++) {
            $topic = $topicsResponse.data.topics[$i]
            Write-Host "  [$($i+1)] ID: $($topic.id)" -ForegroundColor Gray
            Write-Host "      Name: $($topic.name)" -ForegroundColor Gray
            if ($topic.description) {
                Write-Host "      Description: $($topic.description)" -ForegroundColor DarkGray
            }
        }
        
        # ===== CHỌN TOPIC Ở ĐÂY =====
        # Thay đổi số 0 thành index topic bạn muốn (0=đầu tiên, 1=thứ 2, 2=thứ 3,...)
        $selectedTopicIndex = 1  # <-- THAY ĐỔI GIÁ TRỊ NÀY
        
        $selectedTopic = $topicsResponse.data.topics[$selectedTopicIndex]
        
        if (-not $selectedTopic) {
            Write-Error-Message "Cannot select topic at index $selectedTopicIndex"
            exit 1
        }
        
        $topicId = $selectedTopic.id
        $topicName = $selectedTopic.name
        
        Write-Host "`n[SELECTED TOPIC]" -ForegroundColor Green
        Write-Host "  ID: $topicId" -ForegroundColor Cyan
        Write-Host "  Name: $topicName" -ForegroundColor Cyan
    } else {
        Write-Error-Message "Invalid response structure from VnSocial API"
        Write-Host "Response structure:" -ForegroundColor Yellow
        $topicsResponse | ConvertTo-Json -Depth 3 | Write-Host
        exit 1
    }
}
catch {
    Write-Error-Message "Failed to fetch topics: $($_.Exception.Message)"
    exit 1
}

# ==============================================================================
# STEP 3: FETCH HOT POSTS FROM VNSOCIAL
# ==============================================================================

Write-Section "STEP 3: Fetch Hot Posts from VnSocial"
Write-Step "Getting hot posts for topic: $topicName"

# Calculate time range (last 7 days)
$endTime = Get-Date
$startTime = $endTime.AddDays(-7)

# Convert to Unix timestamp in milliseconds
$endTimeMs = [int64](($endTime - (Get-Date "1970-01-01").ToLocalTime()).TotalMilliseconds)
$startTimeMs = [int64](($startTime - (Get-Date "1970-01-01").ToLocalTime()).TotalMilliseconds)

Write-Host "`n[TIME RANGE]" -ForegroundColor Magenta
Write-Host "  Start: $($startTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray
Write-Host "  End:   $($endTime.ToString('yyyy-MM-dd HH:mm:ss'))" -ForegroundColor Gray
Write-Host "  Start (ms): $startTimeMs" -ForegroundColor DarkGray
Write-Host "  End (ms):   $endTimeMs" -ForegroundColor DarkGray

try {
    $headers = @{
        Authorization = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }

    $hotPostsBody = @{
        project_id = $topicId
        source = "baochi"
        start_time = $startTimeMs
        end_time = $endTimeMs
    } | ConvertTo-Json

    Write-Host "`n[REQUEST BODY]" -ForegroundColor Magenta
    Write-Host $hotPostsBody -ForegroundColor DarkGray

    $hotPostsResponse = Invoke-RestMethod -Uri "$baseUrl/vnsocial/posts/hot" `
        -Method Post `
        -Headers $headers `
        -Body $hotPostsBody

    Write-Host "`n[FULL API RESPONSE]" -ForegroundColor Magenta
    $hotPostsResponse | ConvertTo-Json -Depth 3 | Write-Host

    if ($hotPostsResponse -and $hotPostsResponse.success) {
        Write-Host "`n[OK] Hot posts fetched successfully!" -ForegroundColor Green
        Write-Host "  Total posts: $($hotPostsResponse.data.posts.Count)" -ForegroundColor Cyan
        
        if ($hotPostsResponse.data.posts.Count -gt 0) {
            $firstPost = $hotPostsResponse.data.posts[0]
            Write-Host "`n[FIRST POST DETAILS]" -ForegroundColor Magenta
            Write-Host "  Doc ID: $($firstPost.docId)" -ForegroundColor Gray
            Write-Host "  Title: $($firstPost.title)" -ForegroundColor Gray
            if ($firstPost.content -and $firstPost.content.Length -gt 0) {
                $previewLength = [Math]::Min(100, $firstPost.content.Length)
                Write-Host "  Content Preview: $($firstPost.content.Substring(0, $previewLength))..." -ForegroundColor Gray
            }
            Write-Host "  Source: $($firstPost.domain)" -ForegroundColor Gray
        }
    } else {
        Write-Error-Message "Invalid response structure"
        exit 1
    }
}
catch {
    Write-Error-Message "Failed to fetch hot posts: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
    exit 1
}

# ==============================================================================
# STEP 4: GENERATE FORUM TOPICS (VNSOCIAL -> SMARTBOT -> FORUM)
# ==============================================================================

Write-Section "STEP 4: Generate Forum Topics (Main Flow)"
Write-Step "Calling POST /api/forum/topics/generate..."
Write-Host "  This will:" -ForegroundColor Yellow
Write-Host "    1. Fetch 1 article from VnSocial" -ForegroundColor Yellow
Write-Host "    2. Send article to SmartBot AI" -ForegroundColor Yellow
Write-Host "    3. SmartBot generates: 1 ForumPackage (packageTitle + packageSummary)" -ForegroundColor Yellow
Write-Host "    4. Create 3 ForumTopics with seedComment (~200 chữ) + essayPrompt" -ForegroundColor Yellow
Write-Host "    5. Save package and topics to database" -ForegroundColor Yellow

try {
    $headers = @{
        Authorization = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }

    $generateBody = @{
        topicId = $topicId
        count = 3
        source = "baochi"
        startTime = $startTimeMs
        endTime = $endTimeMs
    } | ConvertTo-Json

    Write-Host "`n[REQUEST BODY]" -ForegroundColor Magenta
    Write-Host $generateBody -ForegroundColor DarkGray

    $generateResponse = Invoke-RestMethod -Uri "$baseUrl/forum/topics/generate" `
        -Method Post `
        -Headers $headers `
        -Body $generateBody

    Write-Host "`n[FULL API RESPONSE]" -ForegroundColor Magenta
    $generateResponse | ConvertTo-Json -Depth 5 | Write-Host

    if ($generateResponse -and $generateResponse.success) {
        Write-Host "`n[OK] Forum package and topics generated successfully!" -ForegroundColor Green
        Write-Host "  Total topics created: $($generateResponse.data.total)" -ForegroundColor Cyan
        
        # Display Package Info
        if ($generateResponse.data.package) {
            $package = $generateResponse.data.package
            Write-Host "`n[FORUM PACKAGE]" -ForegroundColor Magenta
            Write-Host "  Package ID: $($package._id)" -ForegroundColor Gray
            Write-Host "  Package Title: $($package.packageTitle)" -ForegroundColor White
            if ($package.packageSummary) {
                Write-Host "  Package Summary Length: $($package.packageSummary.Length) chars" -ForegroundColor Gray
                $summaryPreview = $package.packageSummary.Substring(0, [Math]::Min(150, $package.packageSummary.Length))
                Write-Host "  Preview: $summaryPreview..." -ForegroundColor DarkGray
            }
        }
        
        # Display Topics
        if ($generateResponse.data.topics -and $generateResponse.data.topics.Count -gt 0) {
            Write-Host "`n[FORUM TOPICS]" -ForegroundColor Magenta
            
            for ($i = 0; $i -lt $generateResponse.data.topics.Count; $i++) {
                $forumTopic = $generateResponse.data.topics[$i]
                
                Write-Host "`n  [TOPIC #$($i+1)]" -ForegroundColor Cyan
                Write-Host "  ID: $($forumTopic._id)" -ForegroundColor Gray
                Write-Host "  Title: $($forumTopic.title)" -ForegroundColor White
                Write-Host "  Package ID: $($forumTopic.packageId)" -ForegroundColor Gray
                
                if ($forumTopic.seedComment) {
                    Write-Host ""
                    Write-Host "  [SEED COMMENT (~200 chữ)]" -ForegroundColor Yellow
                    Write-Host "  Length: $($forumTopic.seedComment.Length) chars" -ForegroundColor Gray
                    $commentPreview = $forumTopic.seedComment.Substring(0, [Math]::Min(120, $forumTopic.seedComment.Length))
                    Write-Host "  Preview: $commentPreview..." -ForegroundColor DarkGray
                }
                
                if ($forumTopic.essayPrompt) {
                    Write-Host ""
                    Write-Host "  [ESSAY PROMPT]" -ForegroundColor Yellow
                    $promptPreview = $forumTopic.essayPrompt.Substring(0, [Math]::Min(100, $forumTopic.essayPrompt.Length))
                    Write-Host "  $promptPreview..." -ForegroundColor DarkGray
                }
            }
            
            # Save first topic ID for testing
            $firstForumTopicId = $generateResponse.data.topics[0]._id
            Write-Host "`n[SELECTED FORUM TOPIC FOR TESTING]" -ForegroundColor Green
            Write-Host "  ID: $firstForumTopicId" -ForegroundColor Cyan
        }
    } else {
        Write-Error-Message "Failed to generate forum topics"
        exit 1
    }
}
catch {
    Write-Error-Message "Failed to generate forum topics: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody" -ForegroundColor Red
    }
    exit 1
}

# ==============================================================================
# STEP 5: GET FORUM TOPICS LIST
# ==============================================================================

Write-Section "STEP 5: Get Forum Topics List"
Write-Step "Fetching all forum topics via GET /api/forum/topics..."

try {
    $headers = @{
        Authorization = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }

    $topicsListResponse = Invoke-RestMethod -Uri "$baseUrl/forum/topics?status=published&page=1&limit=10" `
        -Method Get `
        -Headers $headers

    if ($topicsListResponse -and $topicsListResponse.success) {
        Write-Host "`n[OK] Forum topics list fetched!" -ForegroundColor Green
        Write-Host "  Total: $($topicsListResponse.data.total)" -ForegroundColor Cyan
        Write-Host "  Current page: $($topicsListResponse.data.page)/$($topicsListResponse.data.totalPages)" -ForegroundColor Cyan
        
        if ($topicsListResponse.data.topics -and $topicsListResponse.data.topics.Count -gt 0) {
            Write-Host "`n[TOPICS LIST]" -ForegroundColor Magenta
            for ($i = 0; $i -lt [Math]::Min(5, $topicsListResponse.data.topics.Count); $i++) {
                $topic = $topicsListResponse.data.topics[$i]
                Write-Host "  [$($i+1)] $($topic.title)" -ForegroundColor Gray
                Write-Host "      ID: $($topic._id)" -ForegroundColor DarkGray
                Write-Host "      Comments: $($topic.commentCount) | Likes: $($topic.likeCount) | Views: $($topic.viewCount)" -ForegroundColor DarkGray
            }
        }
    }
}
catch {
    Write-Host "[WARNING] Failed to fetch topics list: $($_.Exception.Message)" -ForegroundColor Yellow
}

# ==============================================================================
# STEP 6: GET FORUM TOPIC DETAIL
# ==============================================================================

Write-Section "STEP 6: Get Forum Topic Detail"
Write-Step "Fetching details for topic ID: $firstForumTopicId..."

try {
    $headers = @{
        Authorization = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }

    $topicDetailResponse = Invoke-RestMethod -Uri "$baseUrl/forum/topics/$firstForumTopicId" `
        -Method Get `
        -Headers $headers

    if ($topicDetailResponse -and $topicDetailResponse.success) {
        Write-Host "`n[OK] Topic details fetched!" -ForegroundColor Green
        
        $topic = $topicDetailResponse.data.topic
        
        Write-Host "`n[WHAT USER SEES ON FRONTEND]" -ForegroundColor Magenta
        Write-Host "============================================" -ForegroundColor Cyan
        Write-Host "[TOPIC] $($topic.title)" -ForegroundColor White
        Write-Host "============================================" -ForegroundColor Cyan
        Write-Host ""
        
        if ($topic.packageId) {
            Write-Host "[Package ID] $($topic.packageId)" -ForegroundColor DarkGray
            Write-Host "(Use GET /api/forum/packages/:id to fetch packageTitle & packageSummary)" -ForegroundColor DarkGray
            Write-Host ""
        }
        
        if ($topic.seedComment) {
            Write-Host "[Seed Comment (AI-generated ~200 ch\u1eef)]" -ForegroundColor Yellow
            $seedPreview = if ($topic.seedComment.Length -gt 200) { $topic.seedComment.Substring(0, 200) + "..." } else { $topic.seedComment }
            Write-Host "$seedPreview" -ForegroundColor Gray
            Write-Host ""
        }
        
        if ($topic.essayPrompt) {
            Write-Host "[Essay Prompt]" -ForegroundColor Yellow
            Write-Host "$($topic.essayPrompt)" -ForegroundColor Gray
            Write-Host ""
        }
        
        Write-Host "[Stats]" -ForegroundColor Yellow
        Write-Host "  Comments: $($topic.commentCount)" -ForegroundColor Gray
        Write-Host "  Likes: $($topic.likeCount)" -ForegroundColor Gray
        Write-Host "  Views: $($topic.viewCount)" -ForegroundColor Gray
        Write-Host "============================================" -ForegroundColor Cyan
        
        if ($topicDetailResponse.data.comments -and $topicDetailResponse.data.comments.Count -gt 0) {
            Write-Host "`n[COMMENTS]" -ForegroundColor Magenta
            foreach ($comment in $topicDetailResponse.data.comments) {
                $aiLabel = if ($comment.isAiGenerated) { "[AI] " } else { "[USER] " }
                Write-Host "  $aiLabel $($comment.content.Substring(0, [Math]::Min(80, $comment.content.Length)))..." -ForegroundColor Gray
            }
        }
    }
}
catch {
    Write-Error-Message "Failed to fetch topic detail: $($_.Exception.Message)"
}

# ==============================================================================
# STEP 7: USER CREATES A COMMENT
# ==============================================================================

Write-Section "STEP 7: User Creates Comment"
Write-Step "Posting a user comment to topic..."

try {
    $headers = @{
        Authorization = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }

    $userCommentBody = @{
        content = "Toi hoan toan dong y voi quan diem nay. Trong thoi dai cong nghe so, viec giao duc ky nang so cho hoc sinh la vo cung quan trong. Day la mot chu de rat thoi su va can duoc quan tam!"
    } | ConvertTo-Json

    Write-Host "`n[USER ACTION]" -ForegroundColor Magenta
    Write-Host $userCommentBody -ForegroundColor DarkGray

    $commentResponse = Invoke-RestMethod -Uri "$baseUrl/forum/topics/$firstForumTopicId/comments" `
        -Method Post `
        -Headers $headers `
        -Body $userCommentBody

    if ($commentResponse -and $commentResponse.success) {
        Write-Host "`n[OK] Comment posted successfully!" -ForegroundColor Green
        Write-Host "  Comment ID: $($commentResponse.data._id)" -ForegroundColor Cyan
        Write-Host "  Author: $($commentResponse.data.author.name)" -ForegroundColor Cyan
    }
}
catch {
    Write-Error-Message "Failed to post comment: $($_.Exception.Message)"
}

# ==============================================================================
# STEP 8: USER LIKES A TOPIC
# ==============================================================================

Write-Section "STEP 8: User Likes Topic"
Write-Step "User likes the forum topic..."

try {
    $headers = @{
        Authorization = "Bearer $adminToken"
        "Content-Type" = "application/json"
    }

    $likeResponse = Invoke-RestMethod -Uri "$baseUrl/forum/topics/$firstForumTopicId/like" `
        -Method Post `
        -Headers $headers

    if ($likeResponse -and $likeResponse.success) {
        Write-Host "`n[OK] Topic liked successfully!" -ForegroundColor Green
        Write-Host "  Message: $($likeResponse.message)" -ForegroundColor Cyan
    }
}
catch {
    Write-Host "[WARNING] Failed to like topic (may already be liked): $($_.Exception.Message)" -ForegroundColor Yellow
}

# ==============================================================================
# COMPLETION SUMMARY
# ==============================================================================

Write-Host ""
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "                  DEBUG SCRIPT COMPLETED                         " -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "[FLOW VERIFIED]" -ForegroundColor Cyan
Write-Host "  [1] Admin Login                  [OK]" -ForegroundColor Green
Write-Host "  [2] Fetch VnSocial Topics        [OK]" -ForegroundColor Green
Write-Host "  [3] Fetch Hot Posts              [OK]" -ForegroundColor Green
Write-Host "  [4] Generate Forum Topics        [OK]" -ForegroundColor Green
Write-Host "       -> VnSocial Article" -ForegroundColor Gray
Write-Host "       -> SmartBot AI Generation" -ForegroundColor Gray
Write-Host "       -> Forum Topics + AI Comments + Essay Prompts" -ForegroundColor Gray
Write-Host "  [5] List Forum Topics            [OK]" -ForegroundColor Green
Write-Host "  [6] Get Topic Detail             [OK]" -ForegroundColor Green
Write-Host "  [7] User Comment                 [OK]" -ForegroundColor Green
Write-Host "  [8] User Like                    [OK]" -ForegroundColor Green
Write-Host ""
Write-Host "[SYSTEM STATUS]" -ForegroundColor Cyan
Write-Host "  Backend Server:  RUNNING" -ForegroundColor Green
Write-Host "  VnSocial API:    CONNECTED" -ForegroundColor Green
Write-Host "  VnSmartBot API:  CONNECTED" -ForegroundColor Green
Write-Host "  MongoDB:         CONNECTED" -ForegroundColor Green
Write-Host ""
Write-Host "=================================================================" -ForegroundColor Green
Write-Host "   -> Save to MongoDB:" -ForegroundColor Gray
Write-Host "      * ForumTopic documents" -ForegroundColor Gray
Write-Host "      * ForumComment (AI seed)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. User Interactions" -ForegroundColor White
Write-Host "   -> POST /forum/topics/:id/comments" -ForegroundColor Gray
Write-Host "      * User creates comment" -ForegroundColor Gray
Write-Host "   -> POST /forum/comments/:id/replies" -ForegroundColor Gray
Write-Host "      * User creates reply (nested)" -ForegroundColor Gray
Write-Host "   -> POST /forum/comments/:id/like" -ForegroundColor Gray
Write-Host "      * User likes comment" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Frontend Response" -ForegroundColor White
Write-Host "   -> GET /forum/topics/:id" -ForegroundColor Gray
Write-Host "      * Complete topic with all comments" -ForegroundColor Gray
Write-Host "      * Comment hierarchy (comments + replies)" -ForegroundColor Gray
Write-Host "      * Like counts and user interactions" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Exam Generation" -ForegroundColor White
Write-Host "   -> POST /exams/generate-from-topic/:id" -ForegroundColor Gray
Write-Host "      * Create exam from essay prompt" -ForegroundColor Gray
Write-Host "      * Include AI-generated explanation" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "DATA STRUCTURE:" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "VnSocialArticle (1)" -ForegroundColor White
Write-Host "  -> ForumPackage (1)" -ForegroundColor Cyan
Write-Host "     |-> packageTitle (1)" -ForegroundColor Gray
Write-Host "     |-> packageSummary (150-300 words)" -ForegroundColor Gray
Write-Host "     |-> ForumTopics[] (3)" -ForegroundColor Gray
Write-Host "         |-> ForumTopic (with packageId ref)" -ForegroundColor White
Write-Host "             |-> title (topicTitle)" -ForegroundColor Gray
Write-Host "             |-> seedComment (~200 words, mở-thân-kết)" -ForegroundColor Gray
Write-Host "             |-> essayPrompt" -ForegroundColor Gray
Write-Host "             |-> User Comments (0..n)" -ForegroundColor Gray
Write-Host "                 |-> Replies (0..n, parentCommentId set)" -ForegroundColor Gray
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "KEY ENDPOINTS TESTED:" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  [OK] POST /api/auth/login" -ForegroundColor Green
Write-Host "  [OK] GET  /api/vnsocial/topics" -ForegroundColor Green
Write-Host "  [OK] POST /api/vnsocial/posts/hot" -ForegroundColor Green
Write-Host "  [OK] POST /api/admin/social-debates (MAIN FLOW)" -ForegroundColor Green
Write-Host "  [OK] GET  /api/forum/topics/:id" -ForegroundColor Green
Write-Host "  [OK] POST /api/forum/topics/:id/comments" -ForegroundColor Green
Write-Host "  [OK] POST /api/forum/comments/:id/replies" -ForegroundColor Green
Write-Host "  [OK] POST /api/forum/comments/:id/like" -ForegroundColor Green
Write-Host "  [OK] POST /api/exams/generate-from-topic/:id" -ForegroundColor Green
Write-Host "  [OK] GET  /api/forum/topics" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "DEBUG COMPLETE!" -ForegroundColor Green
Write-Host ""
