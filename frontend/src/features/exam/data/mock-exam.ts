// src/features/exam/data/mock-exam.ts
import { ExamWithDetails, Exam } from "../types";

// =============================================================================
// ĐỀ 1: TOÁN HỌC (exam-001) - Cấu trúc chuẩn 2025
// =============================================================================
export const mockExamMath: ExamWithDetails = {
  _id: "exam-001",
  title: "Thi thử TN THPT 2025 - Môn Toán",
  description:
    "Đề thi thử tốt nghiệp THPT năm 2025 môn Toán. Thời gian làm bài: 90 phút.",
  subject: "Toán Học",
  durationMinutes: 90,
  mode: "test",
  shuffleQuestions: false,
  showResultsImmediately: false,
  createdBy: "teacher-001",
  isPublished: true,
  totalQuestions: 22,
  totalPoints: 10,
  createdAt: "2025-12-01T00:00:00Z",
  updatedAt: "2025-12-01T00:00:00Z",
  questions: [
    // -------------------------------------------------------------------------
    // PHẦN I: TRẮC NGHIỆM (12 Câu)
    // -------------------------------------------------------------------------
    {
      _id: "eq-math-01",
      examId: "exam-001",
      questionId: "q-math-01",
      order: 1,
      section: "Phần I: Trắc nghiệm",
      maxScore: 0.25,
      question: {
        _id: "q-math-01",
        type: "multiple_choice",
        content: "Nguyên hàm của hàm số $f(x) = e^x$ là:",
        correctAnswer: "B",
        options: [
          { id: "A", content: "$\\frac{e^{x+1}}{x+1} + C$" },
          { id: "B", content: "$e^x + C$" },
          { id: "C", content: "$\\frac{e^x}{x} + C$" },
          { id: "D", content: "$x.e^{x-1} + C$" },
        ],
        difficulty: "easy",
        subject: "Toán Học",
        tags: [],
        points: 0.25,
        createdBy: "teacher-001",
        isPublic: true,
        createdAt: "2025-11-01T00:00:00Z",
        updatedAt: "2025-11-01T00:00:00Z",
        // ✅ LỜI GIẢI CHI TIẾT
        explanation:
          "Áp dụng công thức nguyên hàm cơ bản. Ta có $\\int e^x dx = e^x + C$.",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    {
      _id: "eq-math-02",
      examId: "exam-001",
      questionId: "q-math-02",
      order: 2,
      section: "Phần I: Trắc nghiệm",
      maxScore: 0.25,
      question: {
        _id: "q-math-02",
        type: "multiple_choice",
        content:
          "Cho hàm số $y = f(x)$ liên tục, nhận giá trị dương trên đoạn $[a;b]$. Khối tròn xoay được tạo thành khi quay hình phẳng $(H)$ giới hạn bởi đồ thị hàm số $y = f(x)$, trục hoành và hai đường thẳng $x=a, x=b$ quanh trục $Ox$ có thể tích là:",
        correctAnswer: "C",
        options: [
          { id: "A", content: "$V = \\pi \\int_{a}^{b} |f(x)| dx$" },
          { id: "B", content: "$V = \\pi^2 \\int_{a}^{b} f(x) dx$" },
          { id: "C", content: "$V = \\pi \\int_{a}^{b} [f(x)]^2 dx$" },
          { id: "D", content: "$V = \\int_{a}^{b} [f(x)]^2 dx$" },
        ],
        difficulty: "medium",
        subject: "Toán Học",
        tags: [],
        points: 0.25,
        createdBy: "teacher-001",
        isPublic: true,
        createdAt: "2025-11-01T00:00:00Z",
        updatedAt: "2025-11-01T00:00:00Z",
        // ✅ LỜI GIẢI CHI TIẾT
        explanation:
          "Công thức tính thể tích vật thể tròn xoay khi quay quanh trục $Ox$ là $V = \\pi \\int_{a}^{b} [f(x)]^2 dx$.",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    {
      _id: "eq-math-03",
      examId: "exam-001",
      questionId: "q-math-03",
      order: 3,
      section: "Phần I: Trắc nghiệm",
      maxScore: 0.25,
      question: {
        _id: "q-math-03",
        type: "multiple_choice",
        content:
          "Cho hàm số $y = f(x)$ có đồ thị như hình vẽ bên. Hàm số đã cho đồng biến trên khoảng nào dưới đây?",
        image: {
          url: "https://lh3.googleusercontent.com/d/1jF3nARiz1sS4_PIOB5y8H_PP1tA6mVlW",
          caption: "Hình 1: Đồ thị hàm số y = f(x)",
        },
        correctAnswer: "A",
        options: [
          { id: "A", content: "$(0; +\\infty)$" },
          { id: "B", content: "$(-\\infty; 0)$" },
          { id: "C", content: "$(-1; 1)$" },
          { id: "D", content: "$(-\\infty; +\\infty)$" },
        ],
        difficulty: "easy",
        subject: "Toán Học",
        tags: [],
        points: 0.25,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-01T00:00:00Z",
        updatedAt: "2025-12-01T00:00:00Z",
        // ✅ LỜI GIẢI CHI TIẾT
        explanation:
          "Dựa vào đồ thị, hàm số đồng biến khi đồ thị đi lên (hướng từ trái sang phải). Quan sát thấy đồ thị đi lên khi $x \\in (0; +\\infty)$.",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    {
      _id: "eq-math-table",
      examId: "exam-001",
      questionId: "q-math-table",
      order: 24,
      section: "Phần I: Trắc nghiệm",
      maxScore: 0.25,
      question: {
        _id: "q-math-04",
        type: "multiple_choice",
        content:
          "Cho bảng số liệu về kết quả thi thử của một nhóm học sinh như sau. Số trung vị của mẫu số liệu là bao nhiêu?",
        tableData: {
          headers: ["Điểm số", "Số lượng HS", "Tần suất (%)"],
          rows: [
            ["5", "2", "5%"],
            ["6", "5", "12.5%"],
            ["7", "10", "25%"],
            ["8", "15", "37.5%"],
            ["9", "8", "20%"],
          ],
        },
        correctAnswer: "B",
        options: [
          { id: "A", content: "7.0" },
          { id: "B", content: "8.0" },
          { id: "C", content: "7.5" },
          { id: "D", content: "9.0" },
        ],
        difficulty: "medium",
        subject: "Toán Học",
        tags: [],
        points: 0.25,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-01T00:00:00Z",
        updatedAt: "2025-12-01T00:00:00Z",
        // ✅ LỜI GIẢI CHI TIẾT
        explanation:
          "Tổng số học sinh là $N = 2+5+10+15+8 = 40$. Trung vị là giá trị thứ $\\frac{N}{2} = 20$ và $\\frac{N}{2} + 1 = 21$. Cả hai giá trị này đều rơi vào nhóm có điểm số là $8$. Vậy Trung vị là $8.0$.",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    // Sinh tự động các câu từ 5 đến 12 cho đủ số lượng
    ...Array.from({ length: 8 }).map((_, idx) => ({
      _id: `eq-math-${idx + 3}`,
      examId: "exam-001",
      questionId: `q-math-${idx + 3}`,
      order: idx + 3,
      section: "Phần I: Trắc nghiệm",
      maxScore: 0.25,
      question: {
        _id: `q-math-${idx + 3}`,
        type: "multiple_choice" as const,
        content: `Câu hỏi trắc nghiệm số ${
          idx + 3
        } (Mô phỏng nội dung). Tính tích phân $I = \\int_0^1 (2x + 1) dx$.`,
        correctAnswer: "A",
        options: [
          { id: "A", content: "Đáp án A (Đúng): 2" },
          { id: "B", content: "Đáp án B: 1" },
          { id: "C", content: "Đáp án C: 3" },
          { id: "D", content: "Đáp án D: 0" },
        ],
        difficulty: "medium" as const,
        subject: "Toán Học",
        tags: [],
        points: 0.25,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-01T00:00:00Z",
        updatedAt: "2025-12-01T00:00:00Z",
        // ✅ LỜI GIẢI CHI TIẾT (cho các câu tự động sinh)
        explanation: `Lời giải cho câu ${
          idx + 3
        }: Ta có $I = \\left. (x^2 + x) \\right|_0^1 = (1^2 + 1) - (0^2 + 0) = 2$.`,
      },
      createdAt: "2025-12-01T00:00:00Z",
    })),

    // -------------------------------------------------------------------------
    // PHẦN II: ĐÚNG / SAI (4 Câu)
    // -------------------------------------------------------------------------
    {
      _id: "eq-math-13",
      examId: "exam-001",
      questionId: "q-math-13",
      order: 13,
      section: "Phần II: Đúng/Sai",
      maxScore: 1.0,
      question: {
        _id: "q-math-13",
        type: "true_false",
        content:
          "Một người điều khiển ô tô đang ở đường dẫn muốn nhập làn vào đường cao tốc...",
        correctAnswer: { a: true, b: false, c: true, d: false },
        options: [
          { id: "a", content: "Quãng đường ô tô đi được là 180m." },
          { id: "b", content: "Giá trị của b là 10." },
          { id: "c", content: "S(t) tính theo tích phân v(t)." },
          { id: "d", content: "Tốc độ không vượt quá 100 km/h." },
        ],
        difficulty: "hard",
        subject: "Toán Học",
        tags: [],
        points: 1.0,
        createdBy: "teacher-001",
        isPublic: true,
        createdAt: "2025-11-01T00:00:00Z",
        updatedAt: "2025-11-01T00:00:00Z",
        // ✅ LỜI GIẢI CHI TIẾT
        explanation:
          "Phân tích chuyển động: Quãng đường $S$ là tích phân của vận tốc $v(t)$. Phân tích từng mệnh đề dựa trên các điều kiện cho trước của bài toán vận dụng thực tế.",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    // Sinh tự động các câu 14, 15, 16
    ...Array.from({ length: 3 }).map((_, idx) => ({
      _id: `eq-math-${idx + 14}`,
      examId: "exam-001",
      questionId: `q-math-${idx + 14}`,
      order: idx + 14,
      section: "Phần II: Đúng/Sai",
      maxScore: 1.0,
      question: {
        _id: `q-math-${idx + 14}`,
        type: "true_false" as const,
        content: `Câu hỏi đúng sai số ${
          idx + 14
        } (Mô phỏng). Cho số phức $z = 1 + i$. Tính $|z|$.`,
        correctAnswer: { a: true, b: false, c: true, d: false },
        options: [
          { id: "a", content: "Mệnh đề A" },
          { id: "b", content: "Mệnh đề B" },
          { id: "c", content: "Mệnh đề C" },
          { id: "d", content: "Mệnh đề D" },
        ],
        difficulty: "medium" as const,
        subject: "Toán Học",
        tags: [],
        points: 1.0,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-01T00:00:00Z",
        updatedAt: "2025-12-01T00:00:00Z",
        // ✅ LỜI GIẢI CHI TIẾT (cho các câu tự động sinh)
        explanation: `Lời giải cho câu ${
          idx + 14
        }: Ta có $|z| = |1+i| = \\sqrt{1^2 + 1^2} = \\sqrt{2}$. Phân tích từng mệnh đề để kết luận Đúng/Sai.`,
      },
      createdAt: "2025-12-01T00:00:00Z",
    })),

    // -------------------------------------------------------------------------
    // PHẦN III: TRẢ LỜI NGẮN (6 Câu)
    // -------------------------------------------------------------------------
    {
      _id: "eq-math-17",
      examId: "exam-001",
      questionId: "q-math-17",
      order: 17,
      section: "Phần III: Trả lời ngắn",
      maxScore: 0.5,
      question: {
        _id: "q-math-17",
        type: "short_answer",
        content:
          "Cho hình lăng trụ đứng ABC.A'B'C' có AB = 5... Khoảng cách giữa AA' và BC?",
        correctAnswer: "12.3",
        options: [],
        difficulty: "medium",
        subject: "Toán Học",
        tags: [],
        points: 0.5,
        createdBy: "teacher-001",
        isPublic: true,
        createdAt: "2025-11-01T00:00:00Z",
        updatedAt: "2025-11-01T00:00:00Z",
        // ✅ LỜI GIẢI CHI TIẾT
        explanation:
          "Gọi $H$ là hình chiếu vuông góc của $A$ lên $BC$. Do $AA' \\perp (ABC)$, khoảng cách giữa $AA'$ và $BC$ chính là khoảng cách từ $A$ đến $BC$, tức là độ dài đoạn $AH$. Tính $AH$ bằng công thức hình học.",
      },
      createdAt: "2025-12-01T00:00:00Z",
    },
    // Sinh tự động các câu 18, 19, 20, 21, 22
    ...Array.from({ length: 5 }).map((_, idx) => ({
      _id: `eq-math-${idx + 18}`,
      examId: "exam-001",
      questionId: `q-math-${idx + 18}`,
      order: idx + 18,
      section: "Phần III: Trả lời ngắn",
      maxScore: 0.5,
      question: {
        _id: `q-math-${idx + 18}`,
        type: "short_answer" as const,
        content: `Câu trả lời ngắn số ${
          idx + 18
        } (Mô phỏng): Tính diện tích mặt cầu $(S)$ có bán kính $R=3$.`,
        correctAnswer: "1234",
        options: [],
        difficulty: "hard" as const,
        subject: "Toán Học",
        tags: [],
        points: 0.5,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-01T00:00:00Z",
        updatedAt: "2025-12-01T00:00:00Z",
        explanation: `Lời giải cho câu ${
          idx + 18
        }: Công thức tính diện tích mặt cầu là $S = 4\\pi R^2$. Với $R=3$, ta có $S = 4\\pi (3)^2 = 36\\pi$.`,
      },
      createdAt: "2025-12-01T00:00:00Z",
    })),
  ],
};

// =============================================================================
// ĐỀ 2: NGỮ VĂN (exam-002) - Sở GD Yên Bái
// =============================================================================
const mockExamLiterature: ExamWithDetails = {
  _id: "exam-002",
  title: "Thi thử TN THPT 2025 - Môn Ngữ Văn (Sở GD Yên Bái)",
  description:
    "Kì thi thử tốt nghiệp THPT năm 2025 môn Ngữ Văn. Thời gian làm bài: 120 phút.",
  subject: "Ngữ Văn",
  durationMinutes: 120,
  mode: "test",
  shuffleQuestions: false,
  showResultsImmediately: false,
  createdBy: "so-gd-yen-bai",
  isPublished: true,
  totalQuestions: 7,
  totalPoints: 10,
  createdAt: "2025-12-13T00:00:00Z",
  updatedAt: "2025-12-13T00:00:00Z",

  // Văn bản đọc hiểu (Dành cho Phần I - Layout chia đôi)
  readingPassages: [
    {
      id: "passage-van-01",
      title: "TIỆC XÒE VUI NHẤT (Trích)",
      content: `Hà Thị B là con gái trưởng bản Hà Văn Nó. Hiếm có người xinh đẹp như E. Lưng như lưng kiến vàng, mắt long lanh như sao Khun Lú - Nàng Ủa, tiếng nói của nàng dịu dàng. Khi nàng cười, tiếng cười trong vắt và vô tư lự. E xinh đẹp đã đành nhưng đức hạnh của nàng cũng ít có người bì kịp. Nàng là niềm tự hào của người Hua Tát. Cả bản mong nàng tìm được người chồng xứng đáng...

(Lược một đoạn: Mọi người bàn việc chọn chồng cho nàng E. Các bô lão quyết định sẽ làm một cuộc thi tài để chọn người nào có đức tính quý nhất mà khó kiếm nhất làm chồng của E.)

Một bữa kia có một chàng trai dáng vẻ hùng dũng đến nói với trưởng bản và các bô lão:
- Dũng cảm là đức tính quý nhất và khó kiếm nhất. Tôi là người có đức tính ấy!
- Cứ chứng mình xem! - Trưởng bản trả lời.

Chàng trai đi vào rừng. Đến chiều chàng vác về một con lợn lòi bị chàng bắn chết... E mỉm cười... E trả lời: "Đúng thế, thưa cha! Chàng trai đã chứng minh đức tính dũng cảm của mình... Nhưng thưa cha, đức tính ấy đáng quý nhưng chắc không khó kiếm vì mới từ sáng đến chiều chàng đã chứng minh được nó."

(Lược một đoạn: Các chàng trai khác đến nhưng không được chấp nhận).

Cuối cùng có một chàng trai trong bản Hua Tát đến tìm gặp trưởng bản và các bô lão. Đấy là Hặc, chàng trai mồ côi, người thợ săn xuất sắc nhất bản. Hặc nói: "Trung thực là đức tính đáng quý và khó kiếm nhất!".
- Cứ chứng minh xem! - Mọi người bảo chàng.
Hặc trả lời: "Trung thực không phải cái vòng bạc ở cổ đưa ra cho mọi người trông thấy, sờ tay vào nó".
Mọi người xôn xao, các bô lão bàn tán. Trưởng bản tức giận...:
- Phải chứng minh!
- Ai tin mày! Ai bảo mày có đức tính trung thực? - Trưởng bản hỏi.
- Then biết! - Hặc trả lời.
- Cả con cũng biết! - E nói nghiêm trang.
- Điên rồ! - Trưởng bản gầm lên... - Hãy cầu Then đi! Nếu con trung thực, con hãy cầu Then mưa xuống!

Trưa hôm sau, dân bản Hua tát lập đàn cầu đảo, không khí oi nồng ngột ngạt. Hặc bước lên đàn, chàng ngước đôi mắt trang nghiêm nhìn trời. Chàng nói: "Con sống trung thực, dầu biết trung thực bao giờ cũng chịu đau khổ thiệt thòi. Tuy nhiên nếu lòng trung thực chuộc được tội lỗi và mang tình yêu đến được cho thế gian này, xin trời mưa xuống."

Trời cao tĩnh lặng. Bỗng nhiên từ đâu đó xa xôi có một cơn gió mơ hồ thổi về. Tất cả ngọn cây trên rừng xào xạc. Mặt đất bắt đầu xuất hiện những cơn lốc nhỏ. Buổi chiều, bầu trời đầy mây vần vũ và khi đêm xuống thì mưa như trút.

Lần ấy, người ta đã xòe suốt một tuần trăng để mừng đám cưới của Hặc với con gái trưởng bản. Đấy là tiệc xòe vui nhất ở bản Hua Tát.

(Nguyễn Huy Thiệp, Truyện ngắn Nguyễn Huy Thiệp, NXB Văn học, Hà Nội, 2021)`,
    },
  ],

  questions: [
    // --- PHẦN I: ĐỌC HIỂU ---
    {
      _id: "eq-lit-01",
      examId: "exam-002",
      questionId: "q-lit-01",
      order: 1,
      section: "Phần I: Đọc hiểu",
      maxScore: 0.75,
      question: {
        _id: "q-lit-01",
        type: "essay",
        linkedPassageId: "passage-van-01",
        content: "Câu 1 (NB). Xác định điểm nhìn trần thuật của văn bản.",
        correctAnswer:
          "Điểm nhìn trần thuật: Điểm nhìn của người kể chuyện toàn tri (từ bên ngoài).",
        options: [],
        difficulty: "easy",
        subject: "Ngữ Văn",
        tags: ["đọc hiểu"],
        points: 0.75,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-13T00:00:00Z",
        updatedAt: "2025-12-13T00:00:00Z",
      },
      createdAt: "2025-12-13T00:00:00Z",
    },
    {
      _id: "eq-lit-02",
      examId: "exam-002",
      questionId: "q-lit-02",
      order: 2,
      section: "Phần I: Đọc hiểu",
      maxScore: 0.75,
      question: {
        _id: "q-lit-02",
        type: "essay",
        linkedPassageId: "passage-van-01",
        content:
          "Câu 2 (TH). Nêu những suy nghĩ của nàng E về đức tính dũng cảm.",
        correctAnswer:
          "Những suy nghĩ của nàng E: những người dũng cảm sẽ mải mê với sự nghiệp của mình; đức tính ấy đáng quý nhưng chắc không khó kiếm.",
        options: [],
        difficulty: "medium",
        subject: "Ngữ Văn",
        tags: ["đọc hiểu"],
        points: 0.75,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-13T00:00:00Z",
        updatedAt: "2025-12-13T00:00:00Z",
      },
      createdAt: "2025-12-13T00:00:00Z",
    },
    {
      _id: "eq-lit-03",
      examId: "exam-002",
      questionId: "q-lit-03",
      order: 3,
      section: "Phần I: Đọc hiểu",
      maxScore: 1.0,
      question: {
        _id: "q-lit-03",
        type: "essay",
        linkedPassageId: "passage-van-01",
        content:
          "Câu 3 (TH). Phân tích đặc điểm của ngôn ngữ nói trong đoạn trích sau: 'Mọi người xôn xao...'",
        correctAnswer:
          "- Yếu tố phi ngôn ngữ: hét lên, gầm lên.\n- Ngôn ngữ đối thoại.\n- Từ ngữ khẩu ngữ: Ai tin mày, Then biết.\n- Câu rút gọn: Phải chứng minh! Điên rồ!",
        options: [],
        difficulty: "medium",
        subject: "Ngữ Văn",
        tags: ["đọc hiểu"],
        points: 1.0,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-13T00:00:00Z",
        updatedAt: "2025-12-13T00:00:00Z",
      },
      createdAt: "2025-12-13T00:00:00Z",
    },
    {
      _id: "eq-lit-04",
      examId: "exam-002",
      questionId: "q-lit-04",
      order: 4,
      section: "Phần I: Đọc hiểu",
      maxScore: 1.0,
      question: {
        _id: "q-lit-04",
        type: "essay",
        linkedPassageId: "passage-van-01",
        content:
          "Câu 4 (TH). Trình bày ý nghĩa của chi tiết kì ảo trong văn bản (Hặc cầu mưa và trời mưa như trút).",
        correctAnswer:
          "Ý nghĩa:\n- Thể hiện đức tính trung thực của Hặc.\n- Ngợi ca lòng trung thực là thiên tính đáng quý nhất.\n- Thúc đẩy cốt truyện phát triển.",
        options: [],
        difficulty: "hard",
        subject: "Ngữ Văn",
        tags: ["đọc hiểu"],
        points: 1.0,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-13T00:00:00Z",
        updatedAt: "2025-12-13T00:00:00Z",
      },
      createdAt: "2025-12-13T00:00:00Z",
    },
    {
      _id: "eq-lit-05",
      examId: "exam-002",
      questionId: "q-lit-05",
      order: 5,
      section: "Phần I: Đọc hiểu",
      maxScore: 0.5,
      question: {
        _id: "q-lit-05",
        type: "essay",
        linkedPassageId: "passage-van-01",
        content:
          "Câu 5 (VD). Qua văn bản, anh/chị hãy nêu thông điệp có ý nghĩa nhất đối với cuộc sống hôm nay.",
        correctAnswer:
          "Gợi ý: Đức tính trung thực là giá trị cốt lõi. Người trung thực dù chịu thiệt thòi trước mắt nhưng sẽ được trân trọng và đền đáp.",
        options: [],
        difficulty: "hard",
        subject: "Ngữ Văn",
        tags: ["đọc hiểu"],
        points: 0.5,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-13T00:00:00Z",
        updatedAt: "2025-12-13T00:00:00Z",
      },
      createdAt: "2025-12-13T00:00:00Z",
    },

    // --- PHẦN II: VIẾT ---
    {
      _id: "eq-lit-06",
      examId: "exam-002",
      questionId: "q-lit-06",
      order: 6,
      section: "Phần II: Viết",
      maxScore: 2.0,
      question: {
        _id: "q-lit-06",
        type: "essay",
        content:
          "Câu 1 (VDC). Viết đoạn văn nghị luận (khoảng 200 chữ) phân tích nhân vật chàng Hặc.",
        correctAnswer:
          "Phân tích:\n- Hặc mồ côi, giỏi săn bắn, trọng trung thực.\n- Hành động cầu mưa thể hiện niềm tin.\n- Nhân vật đại diện cho quan điểm: người trung thực sẽ hạnh phúc.",
        options: [],
        difficulty: "hard",
        subject: "Ngữ Văn",
        tags: [],
        points: 2.0,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-13T00:00:00Z",
        updatedAt: "2025-12-13T00:00:00Z",
      },
      createdAt: "2025-12-13T00:00:00Z",
    },
    {
      _id: "eq-lit-07",
      examId: "exam-002",
      questionId: "q-lit-07",
      order: 7,
      section: "Phần II: Viết",
      maxScore: 4.0,
      question: {
        _id: "q-lit-07",
        type: "essay",
        content:
          "Câu 2 (VDC). Thời kì hội nhập quốc tế đem đến nhiều cơ hội nhưng cũng đặt ra không ít thách thức cho việc bảo tồn, phát triển văn hóa truyền thống...",
        correctAnswer:
          "Dàn ý:\n1. Giải thích.\n2. Cơ hội.\n3. Thách thức.\n4. Trách nhiệm người trẻ: 'Hòa nhập không hòa tan'.",
        options: [],
        difficulty: "hard",
        subject: "Ngữ Văn",
        tags: [],
        points: 4.0,
        createdBy: "system",
        isPublic: true,
        createdAt: "2025-12-13T00:00:00Z",
        updatedAt: "2025-12-13T00:00:00Z",
      },
      createdAt: "2025-12-13T00:00:00Z",
    },
  ],
};

const mockExamEnglish: ExamWithDetails = {
  _id: "exam-003",
  title: "KỲ THI TỐT NGHIỆP THPT NĂM 2025 - Môn TIẾNG ANH (Mã đề 1102)",
  description: "Đề thi chính thức. Thời gian: 50 phút.",
  subject: "Tiếng Anh",
  durationMinutes: 50,
  mode: "test",
  shuffleQuestions: false,
  showResultsImmediately: false,
  createdBy: "admin",
  isPublished: true,
  totalQuestions: 40,
  totalPoints: 10,
  createdAt: "2025-12-14T00:00:00Z",
  updatedAt: "2025-12-14T00:00:00Z",
  readingPassages: [
    {
      id: "passage-eng-01",
      title: "Passage 1 (Q1–Q8): Project Farming",
      content: `
        <p class="mb-4 text-justify">When several farmers merge plots into a single “project farm”, they use digital tools to make that teamwork far more effective. GPS mapping, drones, and in-field sensors build a live, shared picture of soil types, weather shifts, and plant growth. Because everyone works on the same data, the team can <b>settle</b> seeding dates, determine when to spray, and track machinery in real time. What once depended on guesswork is now driven by verifiable information.</p>
        
        <p class="mb-4 text-justify">With GPS technology, farmers can accurately map out their fields and create customised planting plans. Seeding machines change <b>their</b> rate on the fly, drones spray pests on targeted zones, and smart spreaders apply fertiliser only where data shows a need. <b>Because inputs go exactly where they help, fields yield more while chemical runoff falls.</b> Trials report considerable savings on seed, fuel, and sprays – benefits the partners split at the season’s end.</p>
        
        <p class="mb-4 text-justify">Water management is just as precise. Specialised equipment tracks moisture every hour, and forecast apps predict rain, wind, or heatwaves. Automated pumps deliver measured water amounts to thirsty zones and stop when a storm is coming, <b>slashing</b> waste and energy bills. The result is steadier yields in dry years, fewer nutrients washed away, and a smaller water footprint for the whole partnership. Smart irrigation also helps limit weed growth, reducing herbicide use.</p>
        
        <p class="mb-4 text-justify">The journey from field to market is equally digital. Cloud platforms record harvest weights, storage temperatures, and shipment times the moment they change, while blockchain records freeze each entry so customers can rely on it. Analytic tools browse the records to indicate weak points in the procedure, forecast prices, and suggest better planting plans for the next season to project partners. This makes project farming both profitable and sustainable.</p>
        
        <p class="text-right italic text-sm text-gray-500">(Adapted from https://www.consumersearch.com)</p>
      `,
    },
    {
      id: "passage-eng-02",
      title: "News (Q9–Q14): DIFF 2025",
      content: `
        <h3 class="font-bold text-center mb-4">Da Nang International Fireworks Festival (DIFF) 2025</h3>
        
        <p class="mb-4 text-justify leading-relaxed">
          With ten teams worldwide, DIFF 2025 features the largest <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(9) _______</span> of participating teams in its history, and is predicted to be the most thrilling <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(10) _______</span> so far.
        </p>
        
        <p class="mb-4 text-justify leading-relaxed">
          Z121 Vina Pyrotech, a company <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(11) _______</span> by Vietnam Ministry of National Defence, is a newcomer this year. With thirty years of experience in fireworks, Z121 Vina Pyrotech is expected to deliver a breathtaking performance. It is among the <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(12) _______</span> candidates to win the championship.
        </p>
        
        <p class="mb-4 text-justify leading-relaxed">
          From May 31st to July 12th, DIFF 2025 promises a series of spectacular fireworks displays, <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(13) _______</span> is hoped to bring spectators a world-class entertainment experience.
        </p>
        
        <p class="mb-4 text-justify leading-relaxed">
          Over the past twelve years, the Da Nang International Fireworks Festival has helped the city <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(14) _______</span> the reputation as “The City of Fireworks” and become an attractive tourist destination.
        </p>
        
        <p class="text-right italic text-sm text-gray-500">(Adapted from https://www.vietnamnews.vn)</p>
      `,
    },
    {
      id: "passage-eng-03",
      title: "Passage 2 (Q20–Q29): Greenwashing",
      content: `
        <p class="mb-4 text-justify">We seem to be entering a boom era for greenwashing – the tactic of covering routine pollution in eco-friendly language.</p> 
        
        <p class="mb-4 text-justify"><b>[I]</b> Picture running a high-emitting corporation: meaningful decarbonisation would demand painful negotiations, huge capital outlays, and a full redesign of the business model. Hiring an expert agency to splash “carbon-neutral” or “net-zero” across products is far easier, buying time while emissions remain untouched.</p>
        
        <p class="mb-4 text-justify">Consumers meet this sleight of hand everywhere. Airlines sell “carbon-neutral” flights, filling stations boast about “net-zero” fuel, and breakfast bacon is re-labelled as planet-safe. Advertising spin is old, yet today it is <b>manipulated</b> to conceal ongoing environmental damage. Social media influencers and glossy sustainability reports amplify these claims, broadcasting the narrative far beyond traditional marketing channels.</p>
        
        <p class="mb-4 text-justify">The term greenwashing emerged in the 1980s, an era of oil spills and growing climate science, but <b>the practice</b> has exploded only recently. <b>[II]</b> Intensifying public anxiety over global heating and ecosystem collapse has placed companies under sharp scrutiny; many boards therefore choose eye-catching PR over the tougher route of restructuring supply chains, energy sources, and product lines. Regulators on both sides of the Atlantic are struggling to police false eco-claims, yet enforcement still lags behind corporate ingenuity. Investors, eager to protect short-term returns, frequently applaud these surface-level initiatives, reinforcing the cycle. <b>[III]</b> No sector illustrates the issue better than oil and gas. Having realised that denying climate science now backfires, the industry has swapped denial for “green” paint. Press releases trumpet potential renewable ventures while drilling plans expand unabated.</p>
        
        <p class="mb-4 text-justify">Why does this matter? Greenwashing and climate denial share a core objective: to postpone the deep emission cuts claimed by scientists as urgent this decade. <b>[IV]</b> <u>Whereas denial disputes the crisis, greenwashing misleads the public into believing problems are solved, thereby eroding consumer advocacy of genuine environmental actions and stalling regulatory reforms.</u> In effect, it acts as a soothing lullaby, guiding society ever closer to ecological breakdown while fostering a false sense of progress. Exposing the facade – and insisting on verifiable, measurable carbon reductions – is essential if rhetoric is to give way to real action.</p>
        
        <p class="text-right italic text-sm text-gray-500">(Adapted from https://www.greenpeace.org.uk)</p>
      `,
    },
    {
      id: "passage-eng-04",
      title: "Leaflet (Q30–Q35): Money Management",
      content: `
        <h3 class="font-bold text-lg mb-3 text-teal-700">How to Manage Your Money Wisely?</h3>
        
        <p class="mb-4 text-justify leading-relaxed">
          Managing your finances properly is essential for a stable and secure life. <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(30) _______</span>, many people struggle with budgeting and saving and give up their financial plans sooner or later, eventually leading <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(31) _______</span> overspending and financial stress. Here are some tips to well manage your pocket:
        </p>
        
        <ul class="list-disc pl-5 space-y-2 mb-4">
          <li>Invest some of your money if possible.</li>
          <li>Have a bank account with an increasing amount of savings <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(32) _______</span> month by setting realistic financial goals.</li>
          <li>Buy <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(33) _______</span> within your price range.</li>
          <li>Track your spending carefully to avoid <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(34) _______</span> expenditure on unnecessary purchases.</li>
          <li>Prioritise things that bring you lasting happiness and financial security to get your money’s <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(35) _______</span>!</li>
        </ul>
        
        <p class="text-right italic text-sm text-gray-500">(Adapted from https://www.thebalancemoney.com)</p>
      `,
    },
    {
      id: "passage-eng-05",
      title: "Passage 3 (Q36–Q40): Holiday Buying Behaviour",
      content: `
        <p class="mb-4 text-justify leading-relaxed">
          The process of sorting through the various holidays on offer and determining which is the best for you is inevitably complex and individual personality traits will determine the eventual decision. Some people undertake a process of extensive problem solving, in which information is sought about a series of products, <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(36) _______</span>. Other consumers with no patience to explore a variety of choices <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(37) _______</span>, for the sake of their convenience rather than trying to guarantee that they buy the best possible product. This is known as limited problem solving.
        </p>
        
        <p class="mb-4 text-justify leading-relaxed">
          Many consumers engage in routinised response behaviour, in which choices change relatively little over time. <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(38) _______</span>. Also, some holidaymakers who have been content with a particular company or destination in the past may opt for the same experience again.
        </p>
        
        <p class="mb-4 text-justify leading-relaxed">
          Finally, some consumers will buy on impulse. <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(39) _______</span>. It is, in fact, a pattern of behaviour that is becoming increasingly prevalent – to the dismay of the operators, who then have less scope for forward planning and reduced opportunities to gain from investing deposits in the short term. <span class="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">(40) _______</span>, where ‘distressed stock’ needs to be cleared at short notice and this can be stimulated by late availability offers particularly.
        </p>
        
        <p class="text-right italic text-sm text-gray-500">(Adapted from The business of tourism)</p>
      `,
    },
  ],
  questions: [
    {
      _id: "eq-eng-01",
      examId: "exam-eng-1102",
      questionId: "q-01",
      order: 1,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-01",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-01",
        content: "The word settle in paragraph 1 mostly means _______.",
        options: [
          { id: "A", content: "exchange" },
          { id: "B", content: "announce" },
          { id: "C", content: "expect" },
          { id: "D", content: "decide" },
        ],
        correctAnswer: "D",
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-02",
      examId: "exam-eng-1102",
      questionId: "q-02",
      order: 2,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-02",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-01",
        content:
          "Which of the following is NOT mentioned in paragraph 1 as information displayed on a live, shared picture?",
        options: [
          { id: "A", content: "weather shifts" },
          { id: "B", content: "soil types" },
          { id: "C", content: "plant growth" },
          { id: "D", content: "drones" },
        ],
        correctAnswer: "D",
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-03",
      examId: "exam-eng-1102",
      questionId: "q-03",
      order: 3,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-03",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-01",
        content: "The word their in paragraph 2 refers to _______.",
        options: [
          { id: "A", content: "fields" },
          { id: "B", content: "planting plans" },
          { id: "C", content: "farmers" },
          { id: "D", content: "Seeding machines" },
        ],
        correctAnswer: "D",
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-04",
      examId: "exam-eng-1102",
      questionId: "q-04",
      order: 4,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-04",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-01",
        content:
          "Which of the following best paraphrases the underlined sentence in paragraph 2?",
        options: [
          {
            id: "A",
            content:
              "As resources are directed to the areas that need them, harvests increase and pollution from excess chemicals declines.",
          },
          {
            id: "B",
            content:
              "When chemicals are placed only where they are needed, productivity increases yet more overdue chemicals are released.",
          },
          {
            id: "C",
            content:
              "Precise application of fertilisers and sprays to required areas raises crop output but in turn increases chemical wastage.",
          },
          {
            id: "D",
            content:
              "There is an increase in chemical wastage and crop output though fewer resources are used for the indicated land area.",
          },
        ],
        correctAnswer: "A",
        difficulty: "hard",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-05",
      examId: "exam-eng-1102",
      questionId: "q-05",
      order: 5,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-05",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-01",
        content:
          "The word slashing in paragraph 3 is OPPOSITE in meaning to _______.",
        options: [
          { id: "A", content: "disposing" },
          { id: "B", content: "converting" },
          { id: "C", content: "increasing" },
          { id: "D", content: "reducing" },
        ],
        correctAnswer: "C",
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-06",
      examId: "exam-eng-1102",
      questionId: "q-06",
      order: 6,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-06",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-01",
        content: "Which of the following is TRUE according to paragraph 4?",
        options: [
          {
            id: "A",
            content:
              "Buyers have little reliable information on harvest weights and storage temperatures.",
          },
          {
            id: "B",
            content:
              "Farmers regard cloud platforms the best tools to improve the quality of their crops.",
          },
          {
            id: "C",
            content:
              "Project partners are unable to forecast prices of crops in the following season.",
          },
          {
            id: "D",
            content:
              "Analytic tools offer suggestions for better planting plans for the following season.",
          },
        ],
        correctAnswer: "D",
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-07",
      examId: "exam-eng-1102",
      questionId: "q-07",
      order: 7,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-07",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-01",
        content:
          "Which paragraph mentions approaches to different weather patterns?",
        options: [
          { id: "A", content: "Paragraph 2" },
          { id: "B", content: "Paragraph 3" },
          { id: "C", content: "Paragraph 4" },
          { id: "D", content: "Paragraph 1" },
        ],
        correctAnswer: "B",
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-08",
      examId: "exam-eng-1102",
      questionId: "q-08",
      order: 8,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-08",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-01",
        // ✅ SỬA LỖI: content của Q8 CHỈ chứa câu hỏi, KHÔNG được dính sang phần news/đoạn khác
        content: "Which paragraph mentions real-time tracking of produce?",
        options: [
          { id: "A", content: "Paragraph 2" },
          { id: "B", content: "Paragraph 1" },
          { id: "C", content: "Paragraph 4" },
          { id: "D", content: "Paragraph 3" },
        ],
        correctAnswer: "C",
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-09",
      examId: "exam-eng-1102",
      questionId: "q-09",
      order: 9,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-09",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-02",
        // Trích dẫn ngữ cảnh câu hỏi
        content:
          "With ten teams worldwide, DIFF 2025 features the largest <b>(9) _______</b> of participating teams in its history...",
        options: [
          { id: "A", content: "volume" },
          { id: "B", content: "amount" },
          { id: "C", content: "number" },
          { id: "D", content: "level" },
        ],
        correctAnswer: "C", // 9. C (the largest number of + countable noun)
        difficulty: "easy",
        subject: "Tiếng Anh",
        // Bổ sung tag về lượng từ
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-10",
      examId: "exam-eng-1102",
      questionId: "q-10",
      order: 10,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-10",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-02",
        content:
          "...and is predicted to be the most thrilling <b>(10) _______</b> so far.",
        options: [
          { id: "A", content: "competition" },
          { id: "B", content: "competitive" },
          { id: "C", content: "compete" },
          { id: "D", content: "competitively" },
        ],
        correctAnswer: "A", // 10. A (Noun phrase: thrilling competition)
        difficulty: "easy",
        subject: "Tiếng Anh",
        // Bổ sung tag về từ loại
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-11",
      examId: "exam-eng-1102",
      questionId: "q-11",
      order: 11,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-11",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-02",
        content:
          "Z121 Vina Pyrotech, a company <b>(11) _______</b> by Vietnam Ministry of National Defence, is a newcomer this year.",
        options: [
          { id: "A", content: "managed" },
          { id: "B", content: "managing" },
          { id: "C", content: "has managed" },
          { id: "D", content: "is managing" },
        ],
        correctAnswer: "A", // 11. A (Reduced relative clause - passive)
        difficulty: "easy",
        subject: "Tiếng Anh",
        // Bổ sung tag về mệnh đề quan hệ rút gọn
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-12",
      examId: "exam-eng-1102",
      questionId: "q-12",
      order: 12,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-12",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-02",
        content:
          "It is among the <b>(12) _______</b> candidates to win the championship.",
        options: [
          { id: "A", content: "top" },
          { id: "B", content: "quick" },
          { id: "C", content: "high" },
          { id: "D", content: "smart" },
        ],
        correctAnswer: "A", // 12. A (Collocation: top candidates)
        difficulty: "easy",
        subject: "Tiếng Anh",
        // Bổ sung tag về kết hợp từ
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-13",
      examId: "exam-eng-1102",
      questionId: "q-13",
      order: 13,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-13",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-02",
        content:
          "From May 31st to July 12th, DIFF 2025 promises a series of spectacular fireworks displays, <b>(13) _______</b> is hoped to bring spectators a world-class entertainment experience.",
        options: [
          { id: "A", content: "who" },
          { id: "B", content: "which" },
          { id: "C", content: "when" },
          { id: "D", content: "why" },
        ],
        correctAnswer: "B", // 13. B (Relative pronoun substituting clause)
        difficulty: "easy",
        subject: "Tiếng Anh",
        // Bổ sung tag về đại từ quan hệ
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-14",
      examId: "exam-eng-1102",
      questionId: "q-14",
      order: 14,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-14",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-02",
        content:
          "Over the past twelve years, the Da Nang International Fireworks Festival has helped the city <b>(14) _______</b> the reputation as “The City of Fireworks”...",
        options: [
          { id: "A", content: "build up" },
          { id: "B", content: "go up" },
          { id: "C", content: "come up" },
          { id: "D", content: "look up" },
        ],
        correctAnswer: "A", // 14. A (Phrasal verb: build up reputation)
        difficulty: "easy",
        subject: "Tiếng Anh",
        // Bổ sung tag về cụm động từ
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-15",
      examId: "exam-eng-1102",
      questionId: "q-15",
      order: 15,
      section: "Sentence/Utterance Arrangement",
      maxScore: 0.25,
      question: {
        _id: "q-15",
        type: "multiple_choice",
        // Format nội dung thành các dòng riêng biệt
        content: `
          <div class="space-y-2 text-justify">
            <p><strong>a.</strong> I had to burn the midnight oil to make engaging lesson plans, expecting to capture my students’ attention.</p>
            <p><strong>b.</strong> The reality, however, was not what I had expected when I completely failed to keep the class under control despite shouting loudly.</p>
            <p><strong>c.</strong> This valuable experience was indeed memorable and made me more confident in my career of choice.</p>
            <p><strong>d.</strong> Working as an intern at a local high school encouraged me to pursue a teaching career, a demanding yet rewarding one.</p>
            <p><strong>e.</strong> Instead of giving up, I reflected on what I had done and made improvements in the following lessons.</p>
          </div>
        `,
        options: [
          { id: "A", content: "c – b – e – a – d" },
          { id: "B", content: "c – a – e – d – b" },
          { id: "C", content: "d – a – b – e – c" },
          { id: "D", content: "d – b – e – c – a" },
        ],
        correctAnswer: "C", // Theo đáp án câu 15 là C
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: [],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-16",
      examId: "exam-eng-1102",
      questionId: "q-16",
      order: 16,
      section: "Sentence/Utterance Arrangement",
      maxScore: 0.25,
      question: {
        _id: "q-16",
        type: "multiple_choice",
        content: `
          <div class="space-y-2 text-justify">
            <p><strong>a. David:</strong> I used to, but now I use social media and news apps.</p>
            <p><strong>b. Lisa:</strong> Same here! It’s more convenient, but I think traditional newspapers have their own charm.</p>
            <p><strong>c. Lisa:</strong> Do you still read newspapers?</p>
            <p><strong>d. Lisa:</strong> I believe each type has its own value that we can make full use of.</p>
            <p><strong>e. David:</strong> You’re right. They fill us with nostalgia that’s hard to replace.</p>
          </div>
        `,
        options: [
          { id: "A", content: "d – a – c – e – b" },
          { id: "B", content: "c – a – b – e – d" },
          { id: "C", content: "d – e – b – a – c" },
          { id: "D", content: "c – e – d – a – b" },
        ],
        correctAnswer: "B", // Theo đáp án câu 16 là B
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: [],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-17",
      examId: "exam-eng-1102",
      questionId: "q-17",
      order: 17,
      section: "Sentence/Utterance Arrangement",
      maxScore: 0.25,
      question: {
        _id: "q-17",
        type: "multiple_choice",
        content: `
          <div class="space-y-2 text-justify">
            <p><strong>a. Tom:</strong> Then, text me when you’re home.</p>
            <p><strong>b. Tom:</strong> It’s getting late. Would you like me to give you a lift home?</p>
            <p><strong>c. Mary:</strong> Thanks, but I’m going to walk to the supermarket and then take a bus home.</p>
          </div>
        `,
        options: [
          { id: "A", content: "a – b – c" },
          { id: "B", content: "b – a – c" },
          { id: "C", content: "b – c – a" },
          { id: "D", content: "a – c – b" },
        ],
        correctAnswer: "C", // Theo đáp án câu 17 là C
        difficulty: "easy",
        subject: "Tiếng Anh",
        tags: [],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-18",
      examId: "exam-eng-1102",
      questionId: "q-18",
      order: 18,
      section: "Sentence/Utterance Arrangement",
      maxScore: 0.25,
      question: {
        _id: "q-18",
        type: "multiple_choice",
        content: `
          <div class="space-y-2 text-justify">
            <p class="font-semibold italic mb-2">Dear Ms Smith,</p>
            <p><strong>a.</strong> This has been pre-approved, but you need to have this letter and your identification card produced at the nearest branch to apply.</p>
            <p><strong>b.</strong> The offer is exclusive and expires on December 31st.</p>
            <p><strong>c.</strong> Your application will be processed, and your card will be issued within 48 hours for immediate use.</p>
            <p><strong>d.</strong> It is our honour to offer you credit facilities of 6000, affordable with the monthly instalment of \$99.</p>
            <p><strong>e.</strong> Should you require further details, please call 0123888888, or visit any of our branches.</p>
            <p class="font-semibold italic mt-2">Yours sincerely,<br>ABC Bank</p>
          </div>
        `,
        options: [
          { id: "A", content: "b – d – a – c – e" },
          { id: "B", content: "a – c – d – b – e" },
          { id: "C", content: "d – a – c – b – e" },
          { id: "D", content: "c – a – d – b – e" },
        ],
        correctAnswer: "C", // Theo đáp án câu 18 là C
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: [],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-19",
      examId: "exam-eng-1102",
      questionId: "q-19",
      order: 19,
      section: "Sentence/Utterance Arrangement",
      maxScore: 0.25,
      question: {
        _id: "q-19",
        type: "multiple_choice",
        content: `
          <div class="space-y-2 text-justify">
            <p><strong>a.</strong> The developments demonstrate a clear modernisation of the city of Paragon, transforming it from a primarily residential locality into a more diverse and economically vibrant area.</p>
            <p><strong>b.</strong> This shift was further evidenced by the industrialisation of the surrounding agricultural land, with the appearance of some plants and factories.</p>
            <p><strong>c.</strong> Residential areas were noticeably transformed, with the replacement of established terraced housing with new dwellings and the relocation of the original park.</p>
            <p><strong>d.</strong> Simultaneously, a significant expansion of commercial infrastructure took place, most prominently with the construction of a large supermarket and an accompanying car park where housing once stood.</p>
            <p><strong>e.</strong> Between 2000 and 2015, the outskirts of Paragon city underwent a dramatic reshaping, indicating a move towards urban regeneration and increased commercial activity.</p>
          </div>
        `,
        options: [
          { id: "A", content: "e – d – b – a – c" },
          { id: "B", content: "e – b – a – c – d" },
          { id: "C", content: "e – c – a – d – b" },
          { id: "D", content: "e – c – d – b – a" },
        ],
        correctAnswer: "D", // Theo đáp án câu 19 là D
        difficulty: "hard",
        subject: "Tiếng Anh",
        tags: [],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-20",
      examId: "exam-eng-1102",
      questionId: "q-20",
      order: 20,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-20",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-03",
        content:
          "According to paragraph 1, having products claimed as eco-friendly rather than conducting meaningful decarbonisation will _______.",
        options: [
          {
            id: "A",
            content:
              "bring about a full redesign of the business model of a company",
          },
          {
            id: "B",
            content:
              "lead to delays without solving the current emission problem",
          },
          {
            id: "C",
            content:
              "cause physical injuries to those involved in the negotiation",
          },
          {
            id: "D",
            content:
              "involve spending a huge amount of money paying the agency",
          },
        ],
        correctAnswer: "B", // 20. B
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-21",
      examId: "exam-eng-1102",
      questionId: "q-21",
      order: 21,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-21",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-03",
        content:
          "The word <b>manipulated</b> in paragraph 2 mostly means _______.",
        options: [
          { id: "A", content: "randomly deployed" },
          { id: "B", content: "legally regulated" },
          { id: "C", content: "purposely adjusted" },
          { id: "D", content: "hastily produced" },
        ],
        correctAnswer: "C", // 21. C
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-22",
      examId: "exam-eng-1102",
      questionId: "q-22",
      order: 22,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-22",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-03",
        content: "Which of the following best summarises paragraph 2?",
        options: [
          {
            id: "A",
            content:
              "The stories about greenwashing reach a much wider audience due to the joint effort of social media and traditional marketing channels.",
          },
          {
            id: "B",
            content:
              "Commercials for everyday products and services, ranging from holiday bookings to petrol pumps and bacon packs, are prevalent on unconventional marketing channels.",
          },
          {
            id: "C",
            content:
              "Social media influencers and impressive reports have a role to play in the dissemination of deceptive environmental claims.",
          },
          {
            id: "D",
            content:
              "Sustainability buzzwords now fill every sector, with their reach being amplified by influencers and polished reports.",
          },
        ],
        correctAnswer: "D", // 22. D
        difficulty: "hard",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-23",
      examId: "exam-eng-1102",
      questionId: "q-23",
      order: 23,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-23",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-03",
        content: "What causes corporate boards to adopt greenwashing?",
        options: [
          {
            id: "A",
            content: "Increasing public concern about environmental issues",
          },
          {
            id: "B",
            content: "Public pressure on corporations to opt for PR campaigns",
          },
          {
            id: "C",
            content:
              "Growing public interest in the development of climate science",
          },
          {
            id: "D",
            content: "Public belief that carbon reductions are unnecessary",
          },
        ],
        correctAnswer: "A", // 23. A
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-24",
      examId: "exam-eng-1102",
      questionId: "q-24",
      order: 24,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-24",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-03",
        content:
          "What challenge do regulators face in monitoring greenwashing claims?",
        options: [
          {
            id: "A",
            content: "Enforcement that falls behind corporate creativity",
          },
          { id: "B", content: "Insufficient public support" },
          { id: "C", content: "A lack of clear terminology" },
          {
            id: "D",
            content: "Conflicting laws on both sides of the Atlantic",
          },
        ],
        correctAnswer: "A", // 24. A
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-25",
      examId: "exam-eng-1102",
      questionId: "q-25",
      order: 25,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-25",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-03",
        content:
          "The phrase <b>the practice</b> in paragraph 3 refers to _______.",
        options: [
          { id: "A", content: "global heating" },
          { id: "B", content: "scrutiny" },
          { id: "C", content: "climate science" },
          { id: "D", content: "greenwashing" },
        ],
        correctAnswer: "D", // 25. D
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-26",
      examId: "exam-eng-1102",
      questionId: "q-26",
      order: 26,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-26",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-03",
        content:
          "Which of the following best paraphrases the underlined sentence in paragraph 4?",
        options: [
          {
            id: "A",
            content:
              "For empty slogans to be realised into moves, revelations about greenwashing and practical measures to reduce carbon are required.",
          },
          {
            id: "B",
            content:
              "Greenwashing is, in fact, a fallacy and therefore should be replaced by feasible actions which are encouraged through public movements.",
          },
          {
            id: "C",
            content:
              "To make way for meaningful activities in reality, it is vital to expose the public to proper and specific measures to reduce emissions.",
          },
          {
            id: "D",
            content:
              "The real solution to the issue of carbon is to verify and measure carbon reductions rather than just raise public awareness through campaigns.",
          },
        ],
        correctAnswer: "A", // 26. A
        difficulty: "hard",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-27",
      examId: "exam-eng-1102",
      questionId: "q-27",
      order: 27,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-27",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-03",
        content: "Which of the following can be inferred from the passage?",
        options: [
          {
            id: "A",
            content:
              "Regulators are effectively utilising the tools and resources to verify most environmental claims, tackling the wide spread of eco-labels.",
          },
          {
            id: "B",
            content:
              "Greenwashing brings corporations benefits in terms of finance and reputation without having to reform their core operations.",
          },
          {
            id: "C",
            content:
              "The shift from denying climate science to applying “green” paint reflects high-emitting industries’ genuine commitment to renewables.",
          },
          {
            id: "D",
            content:
              "Investors who value long-term environmental impact put pressure on companies to implement substantial structural reforms.",
          },
        ],
        correctAnswer: "B", // 27. B
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-28",
      examId: "exam-eng-1102",
      questionId: "q-28",
      order: 28,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-28",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-03",
        content: `Where in the passage does the following sentence best fit?
        <br/><br/>
        <i>"Yet greenwashing is arguably more insidious."</i>`,
        options: [
          { id: "A", content: "[IV]" },
          { id: "B", content: "[III]" },
          { id: "C", content: "[II]" },
          { id: "D", content: "[I]" },
        ],
        correctAnswer: "A", // 28. A
        difficulty: "hard",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-29",
      examId: "exam-eng-1102",
      questionId: "q-29",
      order: 29,
      section: "Reading Comprehension",
      maxScore: 0.25,
      question: {
        _id: "q-29",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-03",
        content: "Which of the following best summarises the passage?",
        options: [
          {
            id: "A",
            content:
              "Greenwashing is surging as firms cover ongoing pollution in eco-friendly rhetoric, distracting the public and postponing the deep emission cuts scientists deem urgent.",
          },
          {
            id: "B",
            content:
              "High-emitting sectors follow the trend of greenwashing, boasting about promising renewable ventures in press releases while quietly going on damaging the environment.",
          },
          {
            id: "C",
            content:
              "Instead of investing in meaningful decarbonisation, major emitters have a tendency to opt for denying the claim of “carbon-neutral” or “net-zero” on their product lines.",
          },
          {
            id: "D",
            content:
              "Once a prevalent strategy of corporations in response to public scrutiny, climate denial is losing its effectiveness and has to be replaced by greenwashing.",
          },
        ],
        correctAnswer: "A", // 29. A
        difficulty: "hard",
        subject: "Tiếng Anh",
        tags: ["reading"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-30",
      examId: "exam-eng-1102",
      questionId: "q-30",
      order: 30,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-30",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-04",
        content:
          "Managing your finances properly is essential for a stable and secure life. <b>(30) _______</b>, many people struggle with budgeting and saving...",
        options: [
          { id: "A", content: "However" },
          { id: "B", content: "Otherwise" },
          { id: "C", content: "Though" },
          { id: "D", content: "While" },
        ],
        correctAnswer: "A", // 30. A
        difficulty: "easy",
        subject: "Tiếng Anh",
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-31",
      examId: "exam-eng-1102",
      questionId: "q-31",
      order: 31,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-31",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-04",
        content:
          "...give up their financial plans sooner or later, eventually leading <b>(31) _______</b> overspending and financial stress.",
        options: [
          { id: "A", content: "on" },
          { id: "B", content: "at" },
          { id: "C", content: "in" },
          { id: "D", content: "to" },
        ],
        correctAnswer: "D", // 31. D (leading to)
        difficulty: "easy",
        subject: "Tiếng Anh",
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-32",
      examId: "exam-eng-1102",
      questionId: "q-32",
      order: 32,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-32",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-04",
        content:
          "Have a bank account with an increasing amount of savings <b>(32) _______</b> month by setting realistic financial goals.",
        options: [
          { id: "A", content: "many" },
          { id: "B", content: "some" },
          { id: "C", content: "much" },
          { id: "D", content: "each" },
        ],
        correctAnswer: "D", // 32. D
        difficulty: "easy",
        subject: "Tiếng Anh",
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-33",
      examId: "exam-eng-1102",
      questionId: "q-33",
      order: 33,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-33",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-04",
        content: "Buy <b>(33) _______</b> within your price range.",
        options: [
          { id: "A", content: "affordable products quality" },
          { id: "B", content: "products affordable quality" },
          { id: "C", content: "affordable quality products" },
          { id: "D", content: "products quality affordable" },
        ],
        correctAnswer: "C", // 33. C
        difficulty: "easy",
        subject: "Tiếng Anh",
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-34",
      examId: "exam-eng-1102",
      questionId: "q-34",
      order: 34,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-34",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-04",
        content:
          "Track your spending carefully to avoid <b>(34) _______</b> expenditure on unnecessary purchases.",
        options: [
          { id: "A", content: "possessive" },
          { id: "B", content: "restrictive" },
          { id: "C", content: "objective" },
          { id: "D", content: "excessive" },
        ],
        correctAnswer: "D", // 34. D
        difficulty: "easy",
        subject: "Tiếng Anh",
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-35",
      examId: "exam-eng-1102",
      questionId: "q-35",
      order: 35,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-35",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-04",
        content:
          "Prioritise things that bring you lasting happiness and financial security to get your money’s <b>(35) _______</b>!",
        options: [
          { id: "A", content: "worth" },
          { id: "B", content: "price" },
          { id: "C", content: "rate" },
          { id: "D", content: "cost" },
        ],
        correctAnswer: "A", // 35. A (money's worth)
        difficulty: "easy",
        subject: "Tiếng Anh",
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-36",
      examId: "exam-eng-1102",
      questionId: "q-36",
      order: 36,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-36",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-05",
        content:
          "Some people undertake a process of extensive problem solving, in which information is sought about a series of products, <b>(36) _______</b>.",
        options: [
          {
            id: "A",
            content:
              "each of which is evaluated and compared with similar products",
          },
          {
            id: "B",
            content:
              "every one of them undergoes evaluations and comparisons with similar products",
          },
          {
            id: "C",
            content:
              "when it is similarly evaluated and compared with other products",
          },
          {
            id: "D",
            content:
              "those with similarities to other products will be evaluated and compared carefully",
          },
        ],
        correctAnswer: "A", // 36. A
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-37",
      examId: "exam-eng-1102",
      questionId: "q-37",
      order: 37,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-37",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-05",
        content:
          "Other consumers with no patience to explore a variety of choices <b>(37) _______</b>, for the sake of their convenience rather than trying to guarantee that they buy the best possible product.",
        options: [
          {
            id: "A",
            content:
              "be deliberate to confine themselves to a small number of choices",
          },
          {
            id: "B",
            content: "being deliberately confined themselves to fewer choices",
          },
          {
            id: "C",
            content:
              "will deliberately confine themselves to a small number of choices",
          },
          {
            id: "D",
            content: "fewer choices are deliberately confined to themselves",
          },
        ],
        correctAnswer: "C", // 37. C
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-38",
      examId: "exam-eng-1102",
      questionId: "q-38",
      order: 38,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-38",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-05",
        content:
          "Many consumers engage in routinised response behaviour, in which choices change relatively little over time. <b>(38) _______</b>.",
        options: [
          {
            id: "A",
            content:
              "Common brands, by contrast, are a pattern among loyal consumers",
          },
          {
            id: "B",
            content:
              "This is a common pattern among brand-loyal consumers, for example",
          },
          {
            id: "C",
            content:
              "By contrast, a consumer-loyal pattern is seen among common brands",
          },
          {
            id: "D",
            content:
              "This is a common example of brands with loyalty to a consumer pattern",
          },
        ],
        correctAnswer: "B", // 38. B
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-39",
      examId: "exam-eng-1102",
      questionId: "q-39",
      order: 39,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-39",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-05",
        content:
          "Finally, some consumers will buy on impulse. <b>(39) _______</b>.",
        options: [
          {
            id: "A",
            content:
              "The products cost little, which means they are better known and more favoured by typical holiday purchasers",
          },
          {
            id: "B",
            content:
              "While this is more typical of products costing little, it is by no means unknown among holiday purchasers",
          },
          {
            id: "C",
            content:
              "It doesn’t matter whether products are unknown, it is typical of purchasers to have holidays costing little",
          },
          {
            id: "D",
            content:
              "In the meantime, holidays costing little are known to be products typically favoured by many purchasers",
          },
        ],
        correctAnswer: "B", // 39. B
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
    {
      _id: "eq-eng-40",
      examId: "exam-eng-1102",
      questionId: "q-40",
      order: 40,
      section: "Cloze Test",
      maxScore: 0.25,
      question: {
        _id: "q-40",
        type: "multiple_choice",
        linkedPassageId: "passage-eng-05",
        content:
          "<b>(40) _______</b>, where ‘distressed stock’ needs to be cleared at short notice and this can be stimulated by late availability offers particularly.",
        options: [
          {
            id: "A",
            content:
              "Though such trait of impulse purchasing proves to be valuable",
          },
          {
            id: "B",
            content:
              "So valuable is such purchasing trait that it proves to be impulsive",
          },
          {
            id: "C",
            content:
              "Such trait is so impulsive that it proves to be valuable to purchasers",
          },
          {
            id: "D",
            content:
              "Such impulse purchasing proves to be a valuable trait, though",
          },
        ],
        correctAnswer: "D", // 40. D
        difficulty: "medium",
        subject: "Tiếng Anh",
        tags: ["cloze"],
        points: 0.25,
        createdBy: "admin",
        isPublic: true,
        createdAt: "2025-12-14T00:00:00Z",
        updatedAt: "2025-12-14T00:00:00Z",
      },
      createdAt: "2025-12-14T00:00:00Z",
    },
  ],
};

// =============================================================================
// API GIẢ LẬP
// =============================================================================
const exams = [mockExamMath, mockExamLiterature, mockExamEnglish];

export const getMockExamById = (examId: string): ExamWithDetails | null => {
  const found = exams.find((e) => e._id === examId);
  return found || null;
};

// Export mặc định
export const mockExam = exams;
