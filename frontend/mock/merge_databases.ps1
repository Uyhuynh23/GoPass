# Script to merge an_db.json into db.json with proper naming conventions

# Load both JSON files
$db = Get-Content "db.json" -Raw | ConvertFrom-Json
$an = Get-Content "an_db.json" -Raw | ConvertFrom-Json

# Create new merged object with correct table names
$merged = [PSCustomObject]@{
    # Users: Merge both sources
    users = @($an.User) + @($db.users | Where-Object { $_.id -notin $an.User.id })
    
    # Classes: New from an_db.json
    classes = $an.Class
    
    # Class Members: New from an_db.json
    classmembers = $an.ClassMember
    
    # Class Join Requests: New from an_db.json
    classjoinrequests = $an.ClassJoinRequest
    
    # Exams: Keep from db.json (has more detailed exam data)
    exams = $db.exams
    
    # Exam Assignments: New from an_db.json
    examassignments = $an.ExamAssignment
    
    # Exam Questions: Keep from db.json
    examquestions = $db.exam_questions
    
    # Exam Submissions: New from an_db.json  
    examsubmissions = $an.ExamSubmission
    
    # Questions: Keep from db.json
    questions = $db.questions
    
    # Contests: Merge both
    contests = @($an.Contest) + @($db.contests | Where-Object { $_.contest_id -notin $an.Contest.contest_id })
    
    # Contest Exams: New from an_db.json
    contestexams = $an.ContestExam
    
    # Contest Participations: Keep from db.json
    contestparticipations = $db.contest_participations
    
    # Submissions: Keep from db.json (legacy table)
    submissions = $db.submissions
    
    # Manual Gradings: Empty array for future use
    manualgradings = @()
    
    # Exam Answers: Empty array for future use
    examanswers = @()
}

# Convert to JSON and save
$merged | ConvertTo-Json -Depth 100 | Set-Content "db_merged.json" -Encoding UTF8

Write-Host "✅ Merged database created as db_merged.json" -ForegroundColor Green
Write-Host ""
Write-Host "Tables in merged database:" -ForegroundColor Cyan
$merged.PSObject.Properties | ForEach-Object {
    $count = if ($_.Value) { $_.Value.Count } else { 0 }
    Write-Host "  - $($_.Name): $count items" -ForegroundColor Yellow
}
