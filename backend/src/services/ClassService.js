const ClassRepository = require('../repositories/ClassRepository');
const ClassMemberRepository = require('../repositories/ClassMemberRepository');
const ClassJoinRequestRepository = require('../repositories/ClassJoinRequestRepository');
const ExamAssignmentRepository = require('../repositories/ExamAssignmentRepository');
const ExamSubmissionRepository = require('../repositories/ExamSubmissionRepository');
const MailProvider = require('../providers/MailProvider');

class ClassService {
  // Get all classes
  async getAllClasses() {
    return await ClassRepository.find({}, {
      populate: 'teacherId',
      sort: { createdAt: -1 },
    });
  }

  // Create new class
  async createClass(teacherId, dto) {
    const { name, description, requireApproval = false } = dto;

    // Generate unique class code
    const code = await ClassRepository.generateUniqueCode();

    const classData = await ClassRepository.create({
      name,
      code,
      teacherId,
      description,
      requireApproval,
      isActive: true,
    });

    return classData;
  }

  // Get classes taught by teacher
  async getTeachingClasses(teacherId) {
    return await ClassRepository.findByTeacher(teacherId, {
      populate: 'teacherId',
      sort: { createdAt: -1 },
    });
  }

  // Get classes where student is enrolled
  async getLearningClasses(studentId) {
    const memberships = await ClassMemberRepository.findByStudent(studentId, {
      populate: 'classId',
    });

    return memberships.map(m => m.classId);
  }

  // Get class detail
  async getClassDetail(classId, currentUserId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Get members count
    const membersCount = await ClassMemberRepository.countClassMembers(classId);

    // Get members if user is teacher
    let members = [];
    if (classData.teacherId.toString() === currentUserId.toString()) {
      members = await ClassMemberRepository.findByClass(classId, {
        populate: 'studentId',
      });
    }

    return {
      ...classData.toObject(),
      membersCount,
      members,
    };
  }

  // Update class
  async updateClass(classId, teacherId, dto) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Check ownership
    if (classData.teacherId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to update this class');
    }

    const { name, description, requireApproval } = dto;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (requireApproval !== undefined) updateData.requireApproval = requireApproval;

    return await ClassRepository.update(classId, updateData);
  }

  // Delete class
  async deleteClass(classId, teacherId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Check ownership
    if (classData.teacherId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to delete this class');
    }

    await ClassRepository.delete(classId);
    return { message: 'Class deleted successfully' };
  }

  // Add member to class (teacher action)
  async addMember(classId, teacherId, studentId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Check ownership
    if (classData.teacherId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to add members');
    }

    // Check if already a member
    const existing = await ClassMemberRepository.findMember(classId, studentId);
    if (existing && existing.status === 'active') {
      throw new Error('Student is already a member');
    }

    const member = await ClassMemberRepository.create({
      classId,
      studentId,
      status: 'active',
    });

    return member;
  }

  // Remove member from class
  async removeMember(classId, teacherId, memberId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Check ownership
    if (classData.teacherId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to remove members');
    }

    await ClassMemberRepository.removeMember(classId, memberId);
    return { message: 'Member removed successfully' };
  }

  // Join class by code
  async joinByCode(studentId, classCode) {
    const classData = await ClassRepository.findByCode(classCode);
    if (!classData) {
      throw new Error('Invalid class code');
    }

    if (!classData.isActive) {
      throw new Error('This class is not active');
    }

    // Check if already a member
    const existing = await ClassMemberRepository.findMember(classData._id, studentId);
    if (existing && existing.status === 'active') {
      throw new Error('You are already a member of this class');
    }

    // If requires approval, create join request
    if (classData.requireApproval) {
      const request = await ClassJoinRequestRepository.create({
        classId: classData._id,
        studentId,
        status: 'pending',
      });
      return { type: 'request', data: request };
    }

    // Otherwise, add directly
    const member = await ClassMemberRepository.create({
      classId: classData._id,
      studentId,
      status: 'active',
    });

    return { type: 'member', data: member };
  }

  // Create join request
  async createJoinRequest(classId, studentId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Check if already has pending request
    const existing = await ClassJoinRequestRepository.findRequest(classId, studentId);
    if (existing) {
      throw new Error('You already have a pending request');
    }

    return await ClassJoinRequestRepository.create({
      classId,
      studentId,
      status: 'pending',
    });
  }

  // Get join requests for a class
  async getJoinRequests(classId, teacherId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Check ownership
    if (classData.teacherId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to view join requests');
    }

    return await ClassJoinRequestRepository.findPendingRequests(classId);
  }

  // Approve join request
  async approveJoinRequest(classId, teacherId, requestId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData || classData.teacherId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized');
    }

    const request = await ClassJoinRequestRepository.findById(requestId);
    if (!request || request.classId.toString() !== classId.toString()) {
      throw new Error('Request not found');
    }

    // Approve request
    await ClassJoinRequestRepository.approveRequest(requestId, teacherId);

    // Add member
    await ClassMemberRepository.create({
      classId,
      studentId: request.studentId,
      status: 'active',
    });

    return { message: 'Request approved successfully' };
  }

  // Reject join request
  async rejectJoinRequest(classId, teacherId, requestId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData || classData.teacherId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized');
    }

    const request = await ClassJoinRequestRepository.findById(requestId);
    if (!request || request.classId.toString() !== classId.toString()) {
      throw new Error('Request not found');
    }

    await ClassJoinRequestRepository.rejectRequest(requestId, teacherId);
    return { message: 'Request rejected successfully' };
  }

  // Get class progress
  async getClassProgress(classId, teacherId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData || classData.teacherId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized');
    }

    const assignments = await ExamAssignmentRepository.findByClass(classId);
    const members = await ClassMemberRepository.findByClass(classId);

    const progress = [];
    for (const assignment of assignments) {
      const submissions = await ExamSubmissionRepository.findByAssignment(assignment._id);
      const completedCount = submissions.filter(s => s.status === 'graded').length;

      progress.push({
        assignmentId: assignment._id,
        examId: assignment.examId,
        totalStudents: members.length,
        completed: completedCount,
        completionRate: members.length > 0 ? (completedCount / members.length) * 100 : 0,
      });
    }

    return progress;
  }
}

module.exports = new ClassService();
