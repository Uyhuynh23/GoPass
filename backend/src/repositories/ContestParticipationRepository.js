const BaseRepository = require('./BaseRepository');
const ContestParticipation = require('../models/ContestParticipation');

class ContestParticipationRepository extends BaseRepository {
  constructor() {
    super(ContestParticipation);
  }

  async findByContest(contestId, options = {}) {
    return await this.find({ contestId }, options);
  }

  async findByStudent(userId, options = {}) {
    return await this.find({ userId }, options);
  }

  async findParticipation(contestId, userId) {
    return await this.findOne({ contestId, userId });
  }

  async addExamScore(participationId, examId, score) {
    const participation = await this.findById(participationId);
    if (!participation) {
      throw new Error('Participation not found');
    }

    // Add exam to completed exams if not already there
    if (!participation.completedExams.includes(examId.toString())) {
      participation.completedExams.push(examId.toString());
    }

    // Update total score
    participation.totalScore += score;

    await participation.save();
    return participation;
  }

  async updateRankings(contestId) {
    const participations = await this.find(
      { contestId },
      { sort: { totalScore: -1 } }
    );

    for (let i = 0; i < participations.length; i++) {
      const participation = participations[i];
      const rank = i + 1;
      const percentile = ((participations.length - i) / participations.length) * 100;

      await this.update(participation._id, {
        rank,
        percentile: parseFloat(percentile.toFixed(2)),
      });
    }
  }
}

module.exports = new ContestParticipationRepository();
