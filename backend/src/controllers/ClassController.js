const ClassService = require('../services/ClassService');

class ClassController {
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

  // GET /classes/my-classes
  async getTeachingClasses(req, res) {
    try {
      const teacherId = req.user.userId;
      const result = await ClassService.getTeachingClasses(teacherId, req.query);
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

 // GET /classes/enrolled
  async getEnrolledClasses(req, res) {
    try {
      const studentUserId = req.user.userId;
      const data = await ClassService.getStudentEnrolledClasses(studentUserId);
      return res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /classes/my-enrolled
  async getLearningClasses(req, res) {
    try {
      const studentUserId = req.user.userId;
      const data = await ClassService.getStudentEnrolledClasses(studentUserId);
      return res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
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

  // GET /classes/:classId/assignments
  async getClassAssignments(req, res) {
    try {
      const { classId } = req.params;
      const currentUserId = req.user.userId;
      const result = await ClassService.getClassAssignments(classId, currentUserId, req.query);
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

  // GET /classes/:classId/members
  async getClassMembers(req, res) {
    try {
      const { classId } = req.params;
      const currentUserId = req.user.userId;
      const result = await ClassService.getClassMembers(classId, currentUserId, req.query);
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
      const { studentUserId } = req.body;
      const member = await ClassService.addMember(classId, teacherId, studentUserId);
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

  // DELETE /classes/:classId/members/:studentUserId
  async removeMember(req, res) {
    try {
      const { classId, studentUserId } = req.params;
      const teacherId = req.user.userId;
      const result = await ClassService.removeMember(classId, teacherId, studentUserId);
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

  // POST /classes/join
  async joinByCode(req, res) {
    try {
      const studentUserId = req.user.userId;
      const { classCode } = req.body;
      const result = await ClassService.joinByCode(studentUserId, classCode);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message,
      });
    }
  }
  
  // GET /classes/pending-requests
  async getPendingRequests(req, res) {
    try {
      const studentUserId = req.user.userId; 
      const data = await ClassService.getStudentPendingRequests(studentUserId);
      return res.status(200).json({
        success: true,
        data: data
      });
    } catch (error) {
      console.error("Controller Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error"
      });
    }
  }

 
  
  // GET /classes/:classId/join-requests
  async getJoinRequests(req, res) {
    try {
      const { classId } = req.params;
      const teacherId = req.user.userId;
      const result = await ClassService.getJoinRequests(classId, teacherId, req.query);
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

   // DELETE /classes/cancel-request/:requestId
  async cancelJoinRequest(req, res) {
    try {
      const { requestId } = req.params;
      const studentUserId = req.user.userId; 
      await ClassService.cancelJoinRequest(requestId, studentUserId);

      res.status(200).json({
        success: true,
        message: 'Join request has been cancelled.'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /classes/:classId/join-requests/:requestId
  async processJoinRequest(req, res) {
    try {
      const { classId, requestId } = req.params;
      const { action } = req.body;
      const teacherId = req.user.userId;

      if (!action || !['approve', 'reject'].includes(action)) {
        return res.status(400).json({
          success: false,
          message: 'Action must be either "approve" or "reject"',
        });
      }

      let result;
      if (action === 'approve') {
        result = await ClassService.approveJoinRequest(classId, teacherId, requestId);
      } else {
        result = await ClassService.rejectJoinRequest(classId, teacherId, requestId);
      }

      res.status(200).json({
        success: true,
        data: result,
        message: 'Request processed successfully',
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
