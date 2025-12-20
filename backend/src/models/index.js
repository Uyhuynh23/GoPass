const ContestParticipation = require("./ContestParticipation");

// Export all models
module.exports = {
  User: require("./User"),
  Class: require("./Class"),
  ClassMember: require("./ClassMember"),
  ClassJoinRequest: require("./ClassJoinRequest"),
  Question: require("./Question"),
  Exam: require("./Exam"),
  ExamQuestion: require("./ExamQuestion"),
  ExamAssignment: require("./ExamAssignment"),
  ExamSubmission: require("./ExamSubmission"),
  ExamAnswer: require("./ExamAnswer"),
  ManualGrading: require("./ManualGrading"),
  Contest: require("./Contest"),
  ContestExam: require("./ContestExam"),
  ContestParticipation: require("./ContestParticipation"),

  // Forum & VnSocial models
  ForumPackage: require("./ForumPackage"),
  ForumTopic: require("./ForumTopic"),
  ForumComment: require("./ForumComment"),
  VnsocialTopic: require("./VnsocialTopic"),
  VnsocialArticle: require("./VnsocialArticle"),
  UsedArticle: require("./UsedArticle"),
};
