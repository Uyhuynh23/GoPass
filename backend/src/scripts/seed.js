/**
 * Seed script để tạo dữ liệu mẫu cho database
 * Chạy: node src/scripts/seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { User, Class, ClassMember, Question, Exam, ExamQuestion, ExamAssignment } = require('../models');
const passwordHasher = require('../providers/PasswordHasher');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  console.log('🗑️  Clearing existing data...');
  await User.deleteMany({});
  await Class.deleteMany({});
  await ClassMember.deleteMany({});
  await Question.deleteMany({});
  await Exam.deleteMany({});
  await ExamQuestion.deleteMany({});
  await ExamAssignment.deleteMany({});
  console.log('✅ Database cleared');
};

const seedUsers = async () => {
  console.log('👥 Creating users...');
  
  const hashedPassword = await passwordHasher.hash('123456');

  const users = await User.create([
    {
      email: 'admin@gopass.com',
      passwordHash: hashedPassword,
      name: 'System Admin',
      role: 'admin',
      status: 'active'
    },
    {
      email: 'teacher1@gopass.com',
      passwordHash: hashedPassword,
      name: 'Nguyễn Văn A',
      role: 'teacher',
      status: 'active'
    },
    {
      email: 'teacher2@gopass.com',
      passwordHash: hashedPassword,
      name: 'Trần Thị B',
      role: 'teacher',
      status: 'active'
    },
    {
      email: 'student1@gopass.com',
      passwordHash: hashedPassword,
      name: 'Lê Văn C',
      role: 'student',
      status: 'active'
    },
    {
      email: 'student2@gopass.com',
      passwordHash: hashedPassword,
      name: 'Phạm Thị D',
      role: 'student',
      status: 'active'
    },
    {
      email: 'student3@gopass.com',
      passwordHash: hashedPassword,
      name: 'Hoàng Văn E',
      role: 'student',
      status: 'active'
    }
  ]);

  console.log(`✅ Created ${users.length} users`);
  return users;
};

const seedClasses = async (users) => {
  console.log('📚 Creating classes...');
  
  const teacher1 = users.find(u => u.email === 'teacher1@gopass.com');
  const teacher2 = users.find(u => u.email === 'teacher2@gopass.com');

  const classes = await Class.create([
    {
      name: 'Lập trình Web nâng cao',
      code: 'WEB301',
      description: 'Khóa học về React, Node.js và MongoDB',
      teacherId: teacher1._id,
      isActive: true
    },
    {
      name: 'Cơ sở dữ liệu',
      code: 'DB201',
      description: 'Học về SQL, NoSQL và thiết kế database',
      teacherId: teacher1._id,
      isActive: true
    },
    {
      name: 'Trí tuệ nhân tạo',
      code: 'AI401',
      description: 'Machine Learning và Deep Learning cơ bản',
      teacherId: teacher2._id,
      isActive: true
    },
    {
      name: 'Thuật toán nâng cao',
      code: 'ALG301',
      description: 'Dynamic Programming, Graph Algorithms',
      teacherId: teacher2._id,
      isActive: true
    }
  ]);

  console.log(`✅ Created ${classes.length} classes`);
  return classes;
};

const seedClassMembers = async (users, classes) => {
  console.log('👨‍🎓 Adding students to classes...');
  
  const students = users.filter(u => u.role === 'student');
  const classMembers = [];

  // Thêm sinh viên vào các lớp
  for (const classItem of classes) {
    for (const student of students) {
      classMembers.push({
        classId: classItem._id,
        studentId: student._id,
        status: 'active',
        joinedAt: new Date()
      });
    }
  }

  await ClassMember.create(classMembers);
  console.log(`✅ Added ${classMembers.length} class memberships`);
};

const seedQuestions = async (users) => {
  console.log('❓ Creating questions...');
  
  const teacher1 = users.find(u => u.email === 'teacher1@gopass.com');
  const teacher2 = users.find(u => u.email === 'teacher2@gopass.com');

  const questions = await Question.create([
    // Web questions
    {
      content: 'React là gì?',
      type: 'multiple_choice',
      options: [
        { text: 'Một thư viện JavaScript để xây dựng UI', isCorrect: true },
        { text: 'Một framework CSS', isCorrect: false },
        { text: 'Một database', isCorrect: false },
        { text: 'Một ngôn ngữ lập trình', isCorrect: false }
      ],
      difficulty: 'easy',
      subject: 'Web Development',
      tags: ['react', 'javascript', 'frontend'],
      createdBy: teacher1._id
    },
    {
      content: 'Node.js chạy trên môi trường nào?',
      type: 'multiple_choice',
      options: [
        { text: 'Browser', isCorrect: false },
        { text: 'Server-side', isCorrect: true },
        { text: 'Mobile', isCorrect: false },
        { text: 'Desktop', isCorrect: false }
      ],
      difficulty: 'easy',
      subject: 'Web Development',
      tags: ['nodejs', 'backend'],
      createdBy: teacher1._id
    },
    // Database questions
    {
      content: 'SQL là gì?',
      type: 'multiple_choice',
      options: [
        { text: 'Structured Query Language', isCorrect: true },
        { text: 'Simple Question Language', isCorrect: false },
        { text: 'Standard Quality Level', isCorrect: false },
        { text: 'System Query Library', isCorrect: false }
      ],
      difficulty: 'easy',
      subject: 'Database',
      tags: ['sql', 'database'],
      createdBy: teacher1._id
    },
    // AI questions
    {
      content: 'Supervised Learning là gì?',
      type: 'essay',
      correctAnswer: 'Supervised Learning là phương pháp học máy sử dụng dữ liệu có nhãn để huấn luyện mô hình.',
      difficulty: 'medium',
      subject: 'Artificial Intelligence',
      tags: ['ml', 'ai', 'supervised-learning'],
      createdBy: teacher2._id
    },
    {
      content: 'Neural Network có mấy layer cơ bản?',
      type: 'multiple_choice',
      options: [
        { text: '2 layers', isCorrect: false },
        { text: '3 layers (Input, Hidden, Output)', isCorrect: true },
        { text: '4 layers', isCorrect: false },
        { text: '5 layers', isCorrect: false }
      ],
      difficulty: 'medium',
      subject: 'Artificial Intelligence',
      tags: ['neural-network', 'deep-learning'],
      createdBy: teacher2._id
    }
  ]);

  console.log(`✅ Created ${questions.length} questions`);
  return questions;
};

const seedExams = async (users, classes, questions) => {
  console.log('📝 Creating exams...');
  
  const webClass = classes.find(c => c.code === 'WEB301');
  const dbClass = classes.find(c => c.code === 'DB201');
  const aiClass = classes.find(c => c.code === 'AI401');
  
  const teacher1 = users.find(u => u.email === 'teacher1@gopass.com');
  const teacher2 = users.find(u => u.email === 'teacher2@gopass.com');

  const exams = await Exam.create([
    {
      title: 'Kiểm tra giữa kỳ - Web Development',
      description: 'Bài kiểm tra kiến thức React và Node.js',
      subject: 'Web Development',
      createdBy: teacher1._id,
      durationMinutes: 60,
      mode: 'test',
      shuffleQuestions: true,
      showResultsImmediately: false,
      isPublished: true
    },
    {
      title: 'Bài tập Database tuần 5',
      description: 'Thực hành SQL queries',
      subject: 'Database',
      createdBy: teacher1._id,
      durationMinutes: 45,
      mode: 'practice',
      shuffleQuestions: false,
      showResultsImmediately: true,
      isPublished: true
    },
    {
      title: 'Final Exam - AI Fundamentals',
      description: 'Thi cuối kỳ môn Trí tuệ nhân tạo',
      subject: 'Artificial Intelligence',
      createdBy: teacher2._id,
      durationMinutes: 120,
      mode: 'test',
      shuffleQuestions: true,
      showResultsImmediately: false,
      isPublished: true
    }
  ]);

  console.log(`✅ Created ${exams.length} exams`);
  return exams;
};

const seedExamQuestions = async (exams, questions) => {
  console.log('🔗 Linking questions to exams...');
  
  const webExam = exams.find(e => e.title.includes('Web Development'));
  const dbExam = exams.find(e => e.title.includes('Database'));
  const aiExam = exams.find(e => e.title.includes('AI'));

  const webQuestions = questions.filter(q => q.subject === 'Web Development');
  const dbQuestions = questions.filter(q => q.subject === 'Database');
  const aiQuestions = questions.filter(q => q.subject === 'Artificial Intelligence');

  const examQuestions = [];

  // Add questions to web exam
  webQuestions.forEach((q, index) => {
    examQuestions.push({
      examId: webExam._id,
      questionId: q._id,
      order: index + 1,
      points: 50
    });
  });

  // Add questions to db exam
  dbQuestions.forEach((q, index) => {
    examQuestions.push({
      examId: dbExam._id,
      questionId: q._id,
      order: index + 1,
      points: 50
    });
  });

  // Add questions to ai exam
  aiQuestions.forEach((q, index) => {
    examQuestions.push({
      examId: aiExam._id,
      questionId: q._id,
      order: index + 1,
      points: 100
    });
  });

  await ExamQuestion.create(examQuestions);
  console.log(`✅ Linked ${examQuestions.length} questions to exams`);
};

const seed = async () => {
  try {
    await connectDB();
    await clearDatabase();
    
    const users = await seedUsers();
    const classes = await seedClasses(users);
    await seedClassMembers(users, classes);
    const questions = await seedQuestions(users);
    const exams = await seedExams(users, classes, questions);
    await seedExamQuestions(exams, questions);

    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Classes: ${classes.length}`);
    console.log(`   Questions: ${questions.length}`);
    console.log(`   Exams: ${exams.length}`);
    console.log('\n🔑 Test accounts (password: 123456):');
    console.log('   Admin: admin@gopass.com');
    console.log('   Teacher: teacher1@gopass.com, teacher2@gopass.com');
    console.log('   Student: student1@gopass.com, student2@gopass.com, student3@gopass.com');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
