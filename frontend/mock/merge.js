// Script to merge an_db.json into db.json with proper naming conventions
const fs = require('fs');

// Read both JSON files
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
const an = JSON.parse(fs.readFileSync('an_db.json', 'utf8'));

// Helper to merge arrays and remove duplicates by id
const mergeArrays = (arr1, arr2, idField = 'id') => {
  const map = new Map();
  [...arr1, ...arr2].forEach(item => {
    const key = item[idField] || item.id;
    if (key && !map.has(key)) {
      map.set(key, item);
    }
  });
  return Array.from(map.values());
};

// Create merged database with correct naming conventions
const merged = {
  // Users: Merge both sources (use 'id' or 'user_id')
  users: mergeArrays(db.users || [], an.User || [], 'user_id'),
  
  // Classes: From an_db.json
  classes: an.Class || [],
  
  // Class Members: From an_db.json
  classmembers: an.ClassMember || [],
  
  // Class Join Requests: From an_db.json
  classjoinrequests: an.ClassJoinRequest || [],
  
  // Exams: Keep from db.json (has more detailed data)
  exams: db.exams || [],
  
  // Exam Assignments: From an_db.json
  examassignments: an.ExamAssignment || [],
  
  // Exam Questions: Keep from db.json
  examquestions: db.exam_questions || [],
  
  // Exam Submissions: From an_db.json
  examsubmissions: an.ExamSubmission || [],
  
  // Questions: Keep from db.json
  questions: db.questions || [],
  
  // Contests: Merge both
  contests: mergeArrays(db.contests || [], an.Contest || [], 'contest_id'),
  
  // Contest Exams: From an_db.json or db.json
  contestexams: (an.ContestExam || db.contest_exams || []),
  
  // Contest Participations: Keep from db.json
  contestparticipations: db.contest_participations || [],
  
  // Submissions: Keep from db.json (legacy)
  submissions: db.submissions || [],
  
  // Empty arrays for future use
  manualgradings: [],
  examanswers: []
};

// Write to new file
fs.writeFileSync('db.json', JSON.stringify(merged, null, 2), 'utf8');

// Print summary
console.log('✅ Merged database created successfully!');
console.log('\nTables in merged database:');
Object.keys(merged).forEach(key => {
  const count = Array.isArray(merged[key]) ? merged[key].length : 0;
  console.log(`  - ${key}: ${count} items`);
});
