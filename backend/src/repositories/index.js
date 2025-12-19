// Export all repositories
module.exports = {
  UserRepository: require('./UserRepository'),
  ClassRepository: require('./ClassRepository'),
  ClassMemberRepository: require('./ClassMemberRepository'),
  ClassJoinRequestRepository: require('./ClassJoinRequestRepository'),
  QuestionRepository: require('./QuestionRepository'),
  ExamRepository: require('./ExamRepository'),
  ExamQuestionRepository: require('./ExamQuestionRepository'),
  ExamAssignmentRepository: require('./ExamAssignmentRepository'),
  ExamSubmissionRepository: require('./ExamSubmissionRepository'),
  ExamAnswerRepository: require('./ExamAnswerRepository'),
  ManualGradingRepository: require('./ManualGradingRepository'),
  ContestRepository: require('./ContestRepository'),
  ContestExamRepository: require('./ContestExamRepository'),
  // Forum & VnSocial repositories
  ForumTopicRepository: require("./ForumTopicRepository"),
  ForumCommentRepository: require("./ForumCommentRepository"),
  VnsocialTopicRepository: require("./VnsocialTopicRepository"),
  VnsocialArticleRepository: require("./VnsocialArticleRepository"),
  UsedArticleRepository: require("./UsedArticleRepository"),
};
