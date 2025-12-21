const ContestService = require('../services/ContestService');

class ContestController {
  async createContest(req, res) {
    try {
      const contest = await ContestService.createContest(req.user.userId, req.body);
      res.status(201).json({ success: true, data: contest });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getContestDetail(req, res) {
    try {
      const userId = req.user ? req.user.userId : undefined;
      const contest = await ContestService.getContestDetail(req.params.contestId, userId);
      res.status(200).json({ success: true, data: contest });
    } catch (error) {
      res.status(404).json({ success: false, message: error.message });
    }
  }

  async updateContest(req, res) {
    try {
      const contest = await ContestService.updateContest(req.params.contestId, req.user.userId, req.body);
      res.status(200).json({ success: true, data: contest });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteContest(req, res) {
    try {
      const result = await ContestService.deleteContest(req.params.contestId, req.user.userId);
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async addExamToContest(req, res) {
    try {
      const contestExam = await ContestService.addExamToContest(
        req.params.contestId,
        req.body.examId,
        req.user.userId
      );
      res.status(201).json({ success: true, data: contestExam });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async removeExamFromContest(req, res) {
    try {
      const result = await ContestService.removeExamFromContest(
        req.params.contestId,
        req.params.contestExamId,
        req.user.userId
      );
      res.status(200).json({ success: true, message: result.message });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getLeaderboard(req, res) {
    try {
      const leaderboard = await ContestService.getLeaderboard(req.params.contestId);
      res.status(200).json({ success: true, data: leaderboard });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async joinContest(req, res) {
    try {
      const participation = await ContestService.joinContest(
        req.params.contestId,
        req.user.userId
      );
      res.status(200).json({ success: true, data: participation });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ContestController();
