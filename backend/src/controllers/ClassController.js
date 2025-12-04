const ClassService = require('../services/ClassService');

class ClassController {
  // GET /classes - Get all classes
  async getAllClasses(req, res) {
    try {
      const classes = await ClassService.getAllClasses();
      res.status(200).json({
        success: true,
        data: classes,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /classes
  async createClass(req, res) {
    try {
      const teacherId = req.user.userId;
      const classData = await ClassService.createClass(teacherId, req.body);
      res.status(201).json({
        success: true,
        data: classData,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /classes/my-teaching
  async getTeachingClasses(req, res) {
    try {
      const teacherId = req.user.userId;
      const classes = await ClassService.getTeachingClasses(teacherId);
      res.status(200).json({
        success: true,
        data: classes,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /classes/my-learning
  async getLearningClasses(req, res) {
    try {
      const studentId = req.user.userId;
      const classes = await ClassService.getLearningClasses(studentId);
      res.status(200).json({
        success: true,
        data: classes,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /classes/:classId
  async getClassDetail(req, res) {
    try {
      const { classId } = req.params;
      const currentUserId = req.user.userId;
      const classData = await ClassService.getClassDetail(classId, currentUserId);
      res.status(200).json({
        success: true,
        data: classData,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // PUT /classes/:classId
  async updateClass(req, res) {
    try {
      const { classId } = req.params;
      const teacherId = req.user.userId;
      const classData = await ClassService.updateClass(classId, teacherId, req.body);
      res.status(200).json({
        success: true,
        data: classData,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE /classes/:classId
  async deleteClass(req, res) {
    try {
      const { classId } = req.params;
      const teacherId = req.user.userId;
      const result = await ClassService.deleteClass(classId, teacherId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /classes/:classId/members
  async addMember(req, res) {
    try {
      const { classId } = req.params;
      const teacherId = req.user.userId;
      const { studentId } = req.body;
      const member = await ClassService.addMember(classId, teacherId, studentId);
      res.status(201).json({
        success: true,
        data: member,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // DELETE /classes/:classId/members/:memberId
  async removeMember(req, res) {
    try {
      const { classId, memberId } = req.params;
      const teacherId = req.user.userId;
      const result = await ClassService.removeMember(classId, teacherId, memberId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /classes/join-by-code
  async joinByCode(req, res) {
    try {
      const studentId = req.user.userId;
      const { classCode } = req.body;
      const result = await ClassService.joinByCode(studentId, classCode);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /classes/:classId/join-requests
  async requestJoinClass(req, res) {
    try {
      const { classId } = req.params;
      const studentId = req.user.userId;
      const request = await ClassService.createJoinRequest(classId, studentId);
      res.status(201).json({
        success: true,
        data: request,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /classes/:classId/join-requests
  async getJoinRequests(req, res) {
    try {
      const { classId } = req.params;
      const teacherId = req.user.userId;
      const requests = await ClassService.getJoinRequests(classId, teacherId);
      res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /classes/:classId/join-requests/:requestId/approve
  async approveJoinRequest(req, res) {
    try {
      const { classId, requestId } = req.params;
      const teacherId = req.user.userId;
      const result = await ClassService.approveJoinRequest(classId, teacherId, requestId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // POST /classes/:classId/join-requests/:requestId/reject
  async rejectJoinRequest(req, res) {
    try {
      const { classId, requestId } = req.params;
      const teacherId = req.user.userId;
      const result = await ClassService.rejectJoinRequest(classId, teacherId, requestId);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // GET /classes/:classId/progress
  async getClassProgress(req, res) {
    try {
      const { classId } = req.params;
      const teacherId = req.user.userId;
      const progress = await ClassService.getClassProgress(classId, teacherId);
      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ClassController();
