const ClassMemberRepository = require('../repositories/ClassMemberRepository');
const ExamSubmissionRepository = require('../repositories/ExamSubmissionRepository');
const ExamAssignmentRepository = require('../repositories/ExamAssignmentRepository');
const ContestRepository = require('../repositories/ContestRepository');
const ContestExamRepository = require('../repositories/ContestExamRepository');
const ExamRepository = require('../repositories/ExamRepository');
const ForumTopicRepository = require('../repositories/ForumTopicRepository');

class StudentService {
  /**
   * Get student dashboard statistics
   */
  async getStudentStats(studentId) {
    // Parallel fetch: classes and submissions
    const [classMemberships, submissions] = await Promise.all([
      ClassMemberRepository.findByStudent(studentId, { status: 'active' }),
      ExamSubmissionRepository.find({ 
        studentUserId: studentId
      })
    ]);

    console.log('Class memberships:', classMemberships.length);
    console.log('Exam submissions:', submissions.length);

    const joinedClasses = classMemberships.length;
    
    // Only count submitted exams (not in_progress)
    const submittedExams = submissions.filter(sub => sub.status !== 'in_progress');
    const examsTaken = submittedExams.length;

    // Calculate average score from exams with scores
    let totalScore = 0;
    let scoredCount = 0;
    submittedExams.forEach(sub => {
      const score = Number(sub.totalScore || sub.finalScore || 0);
      if (!isNaN(score) && score > 0) {
        totalScore += score;
        scoredCount++;
      }
    });
    const averageScore = scoredCount > 0 ? Number((totalScore / scoredCount).toFixed(1)) : 0;

    // Calculate days until exam (static date for now)
    const examDate = new Date('2026-06-25T00:00:00');
    const today = new Date();
    const diffTime = examDate.getTime() - today.getTime();
    const daysUntilExam = diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;

    return {
      joinedClasses,
      examsTaken,
      averageScore,
      daysUntilExam
    };
  }

  /**
   * Get student exam history with statistics
   */
  async getStudentHistory(studentId) {
    const submissions = await ExamSubmissionRepository.find(
      { 
        studentUserId: studentId,
        status: { $ne: 'in_progress' }  // All submitted exams, not in progress
      },
      {
        populate: ['examId', 'contestId'],
        sort: { submittedAt: -1, createdAt: -1 }
      }
    );

    // Get all exam assignments to determine which exams are class assignments
    const examIds = submissions.map(sub => sub.examId?._id).filter(Boolean);
    const contestIds = submissions.map(sub => sub.contestId?._id || sub.contestId).filter(Boolean);
    
    const [examAssignments, contests] = await Promise.all([
      ExamAssignmentRepository.find({ 
        examId: { $in: examIds } 
      }, { populate: 'classId' }),
      contestIds.length > 0 ? ContestRepository.find({ 
        _id: { $in: contestIds } 
      }) : Promise.resolve([])
    ]);
    
    // Create maps for quick lookup
    const examAssignmentMap = new Map();
    examAssignments.forEach(assignment => {
      const examIdStr = assignment.examId?.toString() || '';
      if (!examAssignmentMap.has(examIdStr)) {
        examAssignmentMap.set(examIdStr, assignment);
      }
    });
    
    const contestMap = new Map();
    contests.forEach(contest => {
      contestMap.set(contest._id.toString(), contest);
    });

    // Map to history items
    const list = submissions.map(sub => {
      const exam = sub.examId || {};
      const examIdStr = exam._id?.toString() || '';
      const contestIdStr = sub.contestId?._id?.toString() || sub.contestId?.toString() || '';
      
      // Determine type based on contestId and exam assignment
      let type = 'practice_global';
      let displayTitle = exam.title || 'Bài thi';
      let displaySubject = exam.subject || 'Tổng hợp';
      let duration = exam.durationMinutes || 0;
      let className = undefined;
      
      if (contestIdStr && contestMap.has(contestIdStr)) {
        type = 'contest';
        const contest = contestMap.get(contestIdStr);
        displayTitle = contest.name || displayTitle;
        displaySubject = 'Cuộc thi';
        // Calculate contest duration in minutes from start to end time
        if (contest.startTime && contest.endTime) {
          const durationMs = new Date(contest.endTime).getTime() - new Date(contest.startTime).getTime();
          duration = Math.round(durationMs / (1000 * 60)); // Convert to minutes
        }
      } else if (examAssignmentMap.has(examIdStr)) {
        type = 'practice_class';
        const assignment = examAssignmentMap.get(examIdStr);
        className = assignment.classId?.className;
      }

      const dateObj = new Date(sub.submittedAt || sub.createdAt);

      return {
        id: sub._id.toString(),
        title: displayTitle,
        subject: displaySubject,
        duration: duration,
        score: sub.totalScore || sub.finalScore || 0,
        maxScore: sub.maxScore || exam.totalPoints || 10,
        completedDate: dateObj.toLocaleDateString('vi-VN'),
        type,
        className,
        rank: undefined
      };
    });

    // Calculate statistics
    const totalExams = list.length;
    let sumScore = 0;
    let highestScore = 0;
    let totalTime = 0;
    let contestCount = 0;
    let practiceCount = 0;
    const subjectMap = {};

    list.forEach(item => {
      sumScore += item.score;
      totalTime += item.duration;
      if (item.score > highestScore) highestScore = item.score;

      if (item.type === 'contest') contestCount++;
      else practiceCount++;

      const subj = item.subject || 'Khác';
      if (!subjectMap[subj]) subjectMap[subj] = { total: 0, count: 0 };
      subjectMap[subj].total += item.score;
      subjectMap[subj].count += 1;
    });

    const avgScore = totalExams > 0 ? Number((sumScore / totalExams).toFixed(1)) : 0;

    let bestSubject = 'Chưa có';
    let maxAvgSubjectScore = -1;
    Object.entries(subjectMap).forEach(([subj, data]) => {
      const avg = data.total / data.count;
      if (avg > maxAvgSubjectScore) {
        maxAvgSubjectScore = avg;
        bestSubject = subj;
      }
    });

    return {
      list,
      stats: {
        totalExams,
        avgScore,
        totalContests: contestCount,
        totalPractice: practiceCount,
        highestScore,
        bestSubject: totalExams > 0 ? bestSubject : '---',
        totalTime
      }
    };
  }


  /**
   * Get contests for student with subjects and progress
   */
  async getStudentContests(studentId, statusFilter) {
    const filter = { isPublic: true };
    if (statusFilter) {
      filter.status = statusFilter;
    }

    const contests = await ContestRepository.find(filter, { sort: { startTime: 1 } });
    const contestIds = contests.map(c => c._id);

    // Fetch contest exams to derive subjects
    const contestExams = await ContestExamRepository.find({
      contestId: { $in: contestIds }
    }, { populate: 'examId' });

    const subjectsMap = new Map();
    const totalsMap = new Map();
    contestExams.forEach(ce => {
      const cid = ce.contestId?.toString();
      const subj = ce.examId?.subject || 'Tổng hợp';
      if (!subjectsMap.has(cid)) subjectsMap.set(cid, new Set());
      subjectsMap.get(cid).add(subj);
      totalsMap.set(cid, (totalsMap.get(cid) || 0) + 1);
    });

    // Student submissions per contest for progress and score
    const submissions = await ExamSubmissionRepository.find({
      studentUserId: studentId,
      contestId: { $in: contestIds }
    }, { populate: 'examId' });

    const progressMap = new Map();
    const bestScoreMap = new Map();
    submissions.forEach(sub => {
      const cid = sub.contestId?.toString();
      if (!cid) return;
      const isCompleted = sub.status !== 'in_progress';
      if (isCompleted) {
        const prev = progressMap.get(cid) || 0;
        progressMap.set(cid, prev + 1);
        const score = Number(sub.totalScore || sub.finalScore || 0);
        const best = bestScoreMap.get(cid) || 0;
        if (score > best) bestScoreMap.set(cid, score);
      }
    });

    const contestsDto = contests.map(c => {
      const cid = c._id.toString();
      const subjectsSet = subjectsMap.get(cid) || new Set();
      const total = totalsMap.get(cid) || 0;
      const completed = progressMap.get(cid) || 0;
      const startDate = new Date(c.startTime).toLocaleDateString('vi-VN');
      const endDate = new Date(c.endTime).toLocaleDateString('vi-VN');
      const score = bestScoreMap.get(cid) || undefined;
      const status = c.status === 'ended' ? 'completed' : c.status;

      return {
        id: cid,
        title: c.name,
        subjects: Array.from(subjectsSet),
        startDate,
        endDate,
        participants: c.participantsCount || 0,
        status,
        progress: { completed, total },
        rank: undefined,
        score
      };
    });

    return {
      contests: contestsDto,
      total: contestsDto.length
    };
  }
    /**
     * Get student activity for last 7 days
     */
  async getStudentActivity(studentId) {

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);

    const submissions = await ExamSubmissionRepository.find({ 
    studentUserId: studentId,
    submittedAt: { $gte: sevenDaysAgo } // Chỉ lấy bài nộp trong 7 ngày qua
    });
    console.log('Submissions for activity:', submissions.length);


    const activity = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      activity.push({
        date: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        hours: 0,
        exams: 0,
        score: 0,
        _compareDate: d.toDateString()
      });
    }

    // Aggregate submissions by date
    submissions.forEach(sub => {
        
      if (!sub.submittedAt && !sub.startedAt) return;
      
      const subDate = new Date(sub.submittedAt || sub.startedAt).toDateString();
      const dayStat = activity.find(d => d._compareDate === subDate);

      if (dayStat) {
        dayStat.exams += 1;
        // Calculate hours from durationSeconds
        const durationHours = (sub.durationSeconds || 0) / 3600;
        dayStat.hours += durationHours;
        const score = sub.totalScore || sub.finalScore || 0;
        if (score > dayStat.score) dayStat.score = score;
      }
    });

    // Clean up and round hours
    return activity.map(({ _compareDate, ...d }) => ({
      ...d,
      hours: Number(d.hours.toFixed(1))
    }));
  }


  /**
   * Get available practice exams for student
   * Returns global practice exams with student's attempt status
   */
  async getPracticeExams(studentId, subjectFilter) {
    // Build filter for practice_global exams
    const filter = { 
      mode: 'practice_global',
      isPublished: true 
    };
    
    if (subjectFilter) {
      filter.subject = subjectFilter;
    }

    // Fetch practice exams
    const exams = await ExamRepository.find(filter, { 
      sort: { createdAt: -1 } 
    });

    // Map examId -> forumTopic (if any) for cross-linking
    const examIds = exams.map(e => e._id);
    let forumTopicMap = new Map();
    if (examIds.length > 0) {
      const forumTopics = await ForumTopicRepository.find({ examId: { $in: examIds } });
      forumTopicMap = new Map(
        forumTopics.map((t) => [t.examId?.toString(), t])
      );
    }

    // Get student's submissions for these exams
    const submissions = await ExamSubmissionRepository.find({
      studentUserId: studentId,
      examId: { $in: examIds }
    });

    // Create submission map for quick lookup
    const submissionMap = new Map();
    submissions.forEach(sub => {
      const examIdStr = sub.examId?.toString() || '';
      if (!submissionMap.has(examIdStr)) {
        submissionMap.set(examIdStr, sub);
      }
    });

    // Map exams to practice exam format with status
    const practiceExams = exams.map(exam => {
      const examIdStr = exam._id.toString();
      const submission = submissionMap.get(examIdStr);
      const forumTopic = forumTopicMap.get(examIdStr);
      
      let status = 'new';
      let score = undefined;
      let maxScore = undefined;
      let completedDate = undefined;
      const tags = [];

      if (submission) {
        if (submission.status === 'in_progress') {
          status = 'in-progress';
          tags.push('Đang làm');
        } else if (submission.status === 'graded' || submission.status === 'completed') {
          status = 'completed';
          score = submission.totalScore || submission.finalScore || 0;
          maxScore = submission.maxScore || exam.totalPoints || 10;
          completedDate = new Date(submission.submittedAt || submission.createdAt).toLocaleDateString('vi-VN');
          tags.push('Đã hoàn thành');
        }
      }

      return {
        id: exam._id.toString(),
        title: exam.title,
        subject: exam.subject,
        duration: exam.durationMinutes,
        questionCount: exam.totalQuestions || 0,
        status,
        tags,
        score,
        maxScore,
        completedDate,
        forumTopicId: forumTopic?._id?.toString(),
        forumPackageId: forumTopic?.packageId?.toString(),
        forumTopicTitle: forumTopic?.title
      };
    });

    return {
      exams: practiceExams,
      total: practiceExams.length
    };
  }

  /**
   * Get student performance by subject
   * Aggregates exam submissions grouped by subject with average scores
   */
  async getSubjectPerformance(studentId) {
    // Get all graded or submitted exam submissions for the student
    const submissions = await ExamSubmissionRepository.find(
      { 
        studentUserId: studentId,
        status: { $in: ['submitted', 'graded'] }
      },
      {
        populate: 'examId'
      }
    );

    // Group submissions by subject
    const subjectMap = new Map();

    submissions.forEach(submission => {
      const exam = submission.examId;
      if (!exam || !exam.subject) return;

      const subject = exam.subject;
      const score = Number(submission.totalScore || 0);
      const maxScore = Number(submission.maxScore || exam.totalPoints || 10);
      
      // Normalize score to 10-point scale
      const normalizedScore = maxScore > 0 ? (score / maxScore) * 10 : 0;

      if (!subjectMap.has(subject)) {
        subjectMap.set(subject, {
          name: subject,
          totalScore: 0,
          count: 0,
          scores: []
        });
      }

      const subjectData = subjectMap.get(subject);
      subjectData.totalScore += normalizedScore;
      subjectData.count += 1;
      subjectData.scores.push(normalizedScore);
    });

    // Calculate average and format results
    const subjectPerformance = Array.from(subjectMap.values()).map(data => ({
      name: data.name,
      score: data.count > 0 ? Number((data.totalScore / data.count).toFixed(1)) : 0,
      total: data.count
    }));

    // Sort by subject name
    subjectPerformance.sort((a, b) => a.name.localeCompare(b.name, 'vi'));

    return subjectPerformance;
  }
}

module.exports = new StudentService();