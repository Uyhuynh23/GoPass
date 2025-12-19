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
    const { className, description, requireApproval = false } = dto;

    // Generate unique class code
    const classCode = await ClassRepository.generateUniqueCode();

    const classData = await ClassRepository.create({
      className,
      classCode,
      teacherUserId: teacherId,
      description,
      requireApproval,
      isActive: true,
    });

    return classData;
  }

  // Get classes taught by teacher
  async getTeachingClasses(teacherId, query = {}) {
    const { page = 1, limit = 10, isActive } = query;
    const filter = { teacherUserId: teacherId };
    if (isActive !== undefined) filter.isActive = isActive;

    const skip = (page - 1) * limit;
    const classes = await ClassRepository.find(filter, {
      populate: 'teacherUserId',
      sort: { createdAt: -1 },
      limit: parseInt(limit),
      skip,
    });

    const total = await ClassRepository.count(filter);
    const membersCountPromises = classes.map(async (classItem) => {
      const count = await ClassMemberRepository.countClassMembers(classItem._id);
      return {
        ...classItem.toObject(),
        studentCount: count,
      };
    });

    const classesWithCounts = await Promise.all(membersCountPromises);

    return {
      classes: classesWithCounts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    };
  }

  // Get classes where student is enrolled
  async getLearningClasses(studentUserId) {
    const memberships = await ClassMemberRepository.findByStudent(studentUserId, {
      populate: 'classId',
    });

    const classesData = await Promise.all(
      memberships.map(async (m) => {
        const classItem = m.classId;
        const studentCount = await ClassMemberRepository.countClassMembers(classItem._id);
        
        // Get teacher info
        const UserRepository = require('../repositories/UserRepository');
        const teacher = await UserRepository.findById(classItem.teacherUserId);

        // Get assignment stats (optional - simplified version)
        const ExamAssignmentRepository = require('../repositories/ExamAssignmentRepository');
        const ExamSubmissionRepository = require('../repositories/ExamSubmissionRepository');
        
        const assignments = await ExamAssignmentRepository.findByClass(classItem._id);
        const submissions = await ExamSubmissionRepository.find({
          classId: classItem._id,
          studentUserId,
          status: 'graded',
        });

        const totalAssignments = assignments.length;
        const completedAssignments = new Set(submissions.map(s => s.examId.toString())).size;
        
        let avgScore = 0;
        if (submissions.length > 0) {
          const totalScore = submissions.reduce((sum, s) => sum + (s.finalScore || 0), 0);
          avgScore = totalScore / submissions.length;
        }

        return {
          _id: classItem._id,
          className: classItem.className,
          classCode: classItem.classCode,
          teacher: {
            name: teacher?.name || 'Unknown',
            avatar: teacher?.avatar || '',
          },
          studentCount,
          status: m.status,
          joinedDate: m.createdAt,
          stats: {
            totalAssignments,
            completedAssignments,
            avgScore: Number(avgScore.toFixed(1)),
          },
        };
      })
    );

    return { classes: classesData };
  }

  // Get class detail
  async getClassDetail(classId, currentUserId) {
    const classData = await ClassRepository.findById(classId, {
      populate: 'teacherUserId',
    });
    if (!classData) {
      throw new Error('Class not found');
    }

    // Get members count
    const studentCount = await ClassMemberRepository.countClassMembers(classId);

    const classObj = classData.toObject();
    const teacher = classObj.teacherUserId;

    return {
      _id: classObj._id,
      className: classObj.className,
      classCode: classObj.classCode,
      teacherUserId: teacher._id,
      teacher: {
        _id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        avatar: teacher.avatar || '',
      },
      description: classObj.description || '',
      requireApproval: classObj.requireApproval,
      isActive: classObj.isActive,
      studentCount,
      createdAt: classObj.createdAt,
      updatedAt: classObj.updatedAt,
    };
  }

  // Get class assignments (student/teacher)
  async getClassAssignments(classId, currentUserId, query = {}) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    const assignments = await ExamAssignmentRepository.findByClass(classId, {
      populate: 'examId',
      sort: { startTime: 1 },
    });

    const examIds = assignments
      .map((a) => (a.examId?._id ? a.examId._id.toString() : a.examId?.toString()))
      .filter(Boolean);

    const userSubmissions = await ExamSubmissionRepository.find(
      { examId: { $in: examIds }, studentUserId: currentUserId },
      { sort: { submittedAt: 1 } }
    );

    const now = Date.now();
    const mapped = await Promise.all(
      assignments.map(async (a) => {
        const exam = a.examId;
        const examId = exam?._id?.toString() || exam?.toString() || '';

        const startMs = a.startTime ? new Date(a.startTime).getTime() : 0;
        const endMs = a.endTime ? new Date(a.endTime).getTime() : 0;
        let status = 'upcoming';
        if (now >= startMs && now <= endMs) status = 'ongoing';
        else if (now > endMs) status = 'completed';

        const mySubs = userSubmissions.filter(
          (s) => s.examId?.toString() === examId
        );
        const myLatest = mySubs[mySubs.length - 1];

        const submittedCount = await ExamSubmissionRepository.count({ examId });

        return {
          _id: a._id,
          assignmentId: a._id,
          examId,
          title: exam?.title || 'Exam',
          startTime: a.startTime,
          endTime: a.endTime,
          allowLateSubmission: a.allowLateSubmission,
          shuffleQuestions: a.shuffleQuestions,
          attemptLimit: a.attemptLimit,
          duration: exam?.durationMinutes || 0,
          questionCount: exam?.totalQuestions || 0,
          status,
          myScore: myLatest?.totalScore ?? null,
          maxScore: myLatest?.maxScore ?? exam?.totalPoints ?? 0,
          myAttemptCount: mySubs.length,
          submittedCount,
        };
      })
    );

    if (query.status) {
      return { assignments: mapped.filter((a) => a.status === query.status) };
    }

    return { assignments: mapped };
  }

  // Get class members
  async getClassMembers(classId, currentUserId, query = {}) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    const { status } = query;
    const filter = { classId };
    if (status) filter.status = status;
    else filter.status = 'active'; // Default to active members

    const members = await ClassMemberRepository.find(filter, {
      populate: 'studentUserId',
      sort: { createdAt: -1 },
    });

    const formattedMembers = members.map(member => {
      const memberObj = member.toObject();
      const student = memberObj.studentUserId;
      return {
        _id: memberObj._id,
        studentUserId: student._id,
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          avatar: student.avatar || '',
        },
        status: memberObj.status,
        joinedDate: memberObj.createdAt,
      };
    });

    return { members: formattedMembers };
  }

  // Update class
  async updateClass(classId, teacherId, dto) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Check ownership
    if (classData.teacherUserId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to update this class');
    }

    const { className, description, requireApproval, isActive } = dto;
    const updateData = {};
    if (className !== undefined) updateData.className = className;
    if (description !== undefined) updateData.description = description;
    if (requireApproval !== undefined) updateData.requireApproval = requireApproval;
    if (isActive !== undefined) updateData.isActive = isActive;

    return await ClassRepository.update(classId, updateData);
  }

  // Delete class
  async deleteClass(classId, teacherId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Check ownership
    if (classData.teacherUserId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to delete this class');
    }

    // Soft delete - set isActive to false
    await ClassRepository.update(classId, { isActive: false });
    return { message: 'Class deleted successfully' };
  }

  // Add member to class (teacher action)
  async addMember(classId, teacherId, studentUserId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Check ownership
    if (classData.teacherUserId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to add members');
    }

    // Check if already a member
    const existing = await ClassMemberRepository.findMember(classId, studentUserId);
    if (existing && existing.status === 'active') {
      throw new Error('Student is already a member');
    }

    const member = await ClassMemberRepository.create({
      classId,
      studentUserId,
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

    await ClassMemberRepository.removeMember(classId, studentUserId);
    return { message: 'Student removed from class successfully' };
  }

  // Join class by code
  async joinByCode(studentUserId, classCode) {
    const classData = await ClassRepository.findByCode(classCode);
    if (!classData) {
      throw new Error('Class not found');
    }

    if (!classData.isActive) {
      throw new Error('This class is not active');
    }

    // Check if already a member
    const existing = await ClassMemberRepository.findMember(classData._id, studentUserId);
    if (existing && existing.status === 'active') {
      throw new Error('You are already a member of this class');
    }

    // If requires approval, create join request
    if (classData.requireApproval) {
      const existingRequest = await ClassJoinRequestRepository.findRequest(classData._id, studentUserId);
      if (existingRequest && existingRequest.status === 'pending') {
        return {
          classId: classData._id,
          className: classData.className,
          status: 'pending',
          message: 'Join request already sent',
        };
      }

      await ClassJoinRequestRepository.create({
        classId: classData._id,
        studentUserId,
        status: 'pending',
      });

      return {
        classId: classData._id,
        className: classData.className,
        status: 'pending',
        message: 'Join request sent successfully',
      };
    }

    // Otherwise, add directly
    await ClassMemberRepository.create({
      classId: classData._id,
      studentUserId,
      status: 'active',
    });

    return {
      classId: classData._id,
      className: classData.className,
      status: 'approved',
      message: 'Joined class successfully',
    };
  }

  // Create join request
  async createJoinRequest(classId, studentUserId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Check if already has pending request
    const existing = await ClassJoinRequestRepository.findRequest(classId, studentUserId);
    if (existing && existing.status === 'pending') {
      throw new Error('You already have a pending request');
    }

    return await ClassJoinRequestRepository.create({
      classId,
      studentUserId,
      status: 'pending',
    });
  }

  // Get join requests for a class
  async getJoinRequests(classId, teacherId, query = {}) {
    const classData = await ClassRepository.findById(classId);
    if (!classData) {
      throw new Error('Class not found');
    }

    // Check ownership
    if (classData.teacherUserId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized to view join requests');
    }

    const { status } = query;
    const filter = { classId };
    if (status) filter.status = status;

    const requests = await ClassJoinRequestRepository.find(filter, {
      populate: 'studentUserId',
      sort: { createdAt: -1 },
    });

    const formattedRequests = requests.map(req => {
      const reqObj = req.toObject();
      const student = reqObj.studentUserId;
      return {
        _id: reqObj._id,
        classId: reqObj.classId,
        studentUserId: student._id,
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          avatar: student.avatar || '',
        },
        status: reqObj.status,
        requestedAt: reqObj.createdAt,
        processedAt: reqObj.processedAt,
        processedBy: reqObj.processedBy,
      };
    });

    return { requests: formattedRequests };
  }

  // Approve join request
  async approveJoinRequest(classId, teacherId, requestId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData || classData.teacherUserId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized');
    }

    const request = await ClassJoinRequestRepository.findById(requestId);
    if (!request || request.classId.toString() !== classId.toString()) {
      throw new Error('Request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request has already been processed');
    }

    // Approve request
    const updatedRequest = await ClassJoinRequestRepository.update(requestId, {
      status: 'approved',
      processedBy: teacherId,
      processedAt: new Date(),
    });

    // Add member
    await ClassMemberRepository.create({
      classId,
      studentUserId: request.studentUserId,
      status: 'active',
    });

    return {
      _id: updatedRequest._id,
      status: updatedRequest.status,
      processedAt: updatedRequest.processedAt,
      processedBy: updatedRequest.processedBy,
    };
  }

  // Reject join request
  async rejectJoinRequest(classId, teacherId, requestId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData || classData.teacherUserId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized');
    }

    const request = await ClassJoinRequestRepository.findById(requestId);
    if (!request || request.classId.toString() !== classId.toString()) {
      throw new Error('Request not found');
    }

    if (request.status !== 'pending') {
      throw new Error('Request has already been processed');
    }

    const updatedRequest = await ClassJoinRequestRepository.update(requestId, {
      status: 'rejected',
      processedBy: teacherId,
      processedAt: new Date(),
    });

    return {
      _id: updatedRequest._id,
      status: updatedRequest.status,
      processedAt: updatedRequest.processedAt,
      processedBy: updatedRequest.processedBy,
    };
  }


  // Get student's enrolled classes
  async getStudentEnrolledClasses(studentUserId) {
    // 1. Define filter to find only active memberships for this specific student
    const filter = { studentUserId, status: 'active' }; 
    
    const options = {
      populate: { 
        path: 'classId', 
        select: 'className classCode teacherUserId', 
        populate: {
          path: 'teacherUserId',
          select: 'name avatar'
        }
      },
      sort: { createdAt: -1 },
      lean: true
    };

    // 2. Fetch all raw membership records
    const memberships = await ClassMemberRepository.find(filter, options);
    
    // Safety filter: ensure the associated class object exists (in case of hard deletes)
    const activeMemberships = memberships.filter(m => m.classId);

    // 3. Extract unique Class IDs to perform a bulk count operation
    const classIds = activeMemberships.map(m => m.classId._id);

    // 4. Perform Aggregation to calculate the real-time student count for each class
    // This is highly efficient as it executes a single query for the entire list
    const counts = await ClassMemberRepository.model.aggregate([
      { 
        $match: { 
          classId: { $in: classIds }, 
          status: 'active' 
        } 
      },
      { 
        $group: { 
          _id: "$classId", 
          count: { $sum: 1 } // Increment count for every active member found
        } 
      }
    ]);

    // 5. Convert aggregation result array into a Lookup Map { "classId": count }
    // This allows O(1) complexity when mapping the final data
    const countMap = counts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    // 6. Map the internal database results to the standardized Frontend Interface
    return activeMemberships.map(m => {
      const classIdStr = m.classId._id.toString();
      
      return {
        _id: m.classId._id,
        className: m.classId.className,
        classCode: m.classId.classCode,
        teacher: {
          name: m.classId.teacherUserId?.name || "Instructor",
          avatar: m.classId.teacherUserId?.avatar || ""
        },
        // Assign the live count from the map, defaulting to 0 if no members are found
        studentCount: countMap[classIdStr] || 0, 
        status: 'active',
        joinedDate: m.createdAt,
      };
    });
  }

// Get student's pending join requests
  async getStudentPendingRequests(studentUserId) {
    const filter = { 
      studentUserId: studentUserId, 
      status: 'pending' 
    };

    const options = {
      populate: {
        path: 'classId',
        select: 'className classCode teacherUserId studentCount',
        populate: { 
          path: 'teacherUserId', 
          select: 'name avatar' 
        }
      },
      sort: { requestedAt: -1 }, 
      lean: true
    };

    const requests = await ClassJoinRequestRepository.find(filter, options);

    return requests
      .filter(req => req.classId) 
      .map(req => ({
        _id: req.classId._id,      
        className: req.classId.className,
        classCode: req.classId.classCode,
        teacher: {
          name: req.classId.teacherUserId?.name || "Instructor",
          avatar: req.classId.teacherUserId?.avatar || ""
        },
        studentCount: req.classId.studentCount || 0,
        status: 'pending',
        requestDate: req.requestedAt || req.createdAt, 
        requestId: req._id  
      }));
  }

  async cancelJoinRequest(requestId, studentUserId) {

    console.log("DEBUG: RequestID from Frontend:", requestId);
    console.log("DEBUG: UserID from Middleware:", studentUserId);

    const deletedRequest = await ClassJoinRequestRepository.deleteRequest(requestId, studentUserId);
    
    if (!deletedRequest) {
      throw new Error('Request not found or you are not authorized to cancel it');
    }
    
    return true;
  }

  // Get class progress
  async getClassProgress(classId, teacherId) {
    const classData = await ClassRepository.findById(classId);
    if (!classData || classData.teacherUserId.toString() !== teacherId.toString()) {
      throw new Error('Unauthorized');
    }

    const assignments = await ExamAssignmentRepository.findByClass(classId);
    const members = await ClassMemberRepository.findByClass(classId);

    const progress = [];
    for (const assignment of assignments) {
      const submissions = await ExamSubmissionRepository.find({
        examAssignmentId: assignment._id,
        status: 'graded',
      });
      const completedCount = submissions.length;

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
