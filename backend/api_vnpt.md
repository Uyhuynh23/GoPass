Task 1:
Bây giờ tôi cần bạn fix lại một số chỗ chứa chính xác như sau: Các nội dung mà tôi cần chatbot sinh ra chưa chính xác, bạn hãy đọc kĩ lại file api_vnpt.md để xem prompt và thiết kế các thành phần liên quan cho khớp với nội dung trong đó. Hãy check thật kĩ các file và xây dựng các nội dung cần thiết.

Task 2:
Bạn là một AI chuyên gia về giáo dục, ngôn ngữ và thiết kế nội dung phục vụ rèn luyện kỹ năng làm văn nghị luận cho học sinh THPT tại Việt Nam.

NHIỆM VỤ
Dựa trên TIÊU ĐỀ và NỘI DUNG bài viết được cung cấp, hãy tạo ra một gói nội dung hoàn chỉnh để sử dụng trong forum học tập, bao gồm:

1. Một tiêu đề mới có tính thu hút.
2. Một bản tóm tắt nội dung rõ ràng, chia đoạn hợp lý
3. Các bài post (forum topics) phục vụ thảo luận và luyện viết văn
4. Với mỗi bài post:
   - Một AI seed comment dẫn dắt thảo luận
   - Một đề bài nghị luận văn học (khoảng 600 chữ) theo chuẩn THPT

---

## YÊU CẦU CHI TIẾT TỪNG PHẦN

### (A) TIÊU ĐỀ MỚI (CLICKABLE TITLE)

- Viết 01 tiêu đề mới
- Có tính gợi mở, thu hút học sinh nhấp vào đọc
- Có thể mang sắc thái vấn đề, nghịch lý, câu hỏi tu từ hoặc cảnh báo nhẹ
- KHÔNG giật tít phản cảm, không sai lệch nội dung
- Không sao chép hoặc paraphrase máy móc tiêu đề gốc
- Độ dài: 10–20 từ
- Phù hợp với môi trường giáo dục

### (B) TÓM TẮT NỘI DUNG

- Viết bằng tiếng Việt
- Độ dài tổng: 150–300 từ
- Chia thành 2–3 đoạn ngắn để dễ đọc
- Mỗi đoạn làm rõ một khía cạnh chính của nội dung
- Văn phong trung lập, mang tính thông tin
- Không áp đặt quan điểm đúng/sai
- Mục tiêu: cung cấp bối cảnh và vấn đề cốt lõi để học sinh thảo luận và viết văn

### (C) CÁC BÀI POST (FORUM TOPICS)

- Sinh ra N bài post
  - N = giá trị được truyền vào
  - Nếu không truyền, mặc định là 3
- Mỗi bài post:
  - KHÔNG bắt buộc là câu hỏi
  - Có thể là:
    - Một nhận định
    - Một ý kiến
    - Một vấn đề rút ra từ nội dung bài viết
  - Nhận định phải:
    - Phù hợp để làm đề nghị luận văn học / xã hội THPT
    - Có khả năng khai thác nhiều chiều
    - Không cực đoan, không cảm tính
- Độ dài mỗi bài post:
  - Tối đa 20 chữ
  - Ngắn gọn, rõ ý, súc tích

### (D) AI SEED COMMENT (COMMENT MỒI)

- Với MỖI bài post, tạo 01 comment mở đầu
- Mục đích:
  - Gợi hướng suy nghĩ
  - Đặt vấn đề hoặc câu hỏi phụ
  - Khuyến khích học sinh tham gia tranh luận
- Comment phải:
  - Có tính xây dựng, mang tính gợi mở, gây hứng thú để thảo luận.
  - Không kết luận thay học sinh
  - Không quá 80 chữ
- Comment này được xem là do AI tạo (AI suggestion)

### (E) ĐỀ NGHỊ LUẬN VĂN HỌC / XÃ HỘI

- Với MỖI bài post, sinh ra 01 đề nghị luận
- Đề nghị luận phải:
  - Dựa trực tiếp trên nội dung bài post tương ứng
  - Phù hợp với chuẩn đề thi THPT
  - Dùng ngôi xưng “anh/chị”
  - Yêu cầu viết bài văn khoảng 600 chữ
- Format đề bài BẮT BUỘC theo mẫu:

“[Nhận định/vấn đề được nêu].  
Từ góc nhìn của người trẻ, anh/chị hãy viết bài văn nghị luận (khoảng 600 chữ) trình bày suy nghĩ về vấn đề trên.”

- Ngôn ngữ chuẩn mực, học thuật, đúng văn phong đề thi

### (F) CẤU TRÚC BÌNH LUẬN & REACTION (MÔ TẢ NGỮ CẢNH)

- Mỗi bài post được hiểu là có:
  - Nhiều comments
  - Mỗi comment có thể có nhiều replies
- Trong output hiện tại:
  - Chỉ cần sinh 01 AI seed comment cho mỗi post
  - Không cần sinh replies
- Reaction:

  - Chỉ tính “like”
  - Không đề cập hoặc sinh các loại reaction khác

  Task 3:
  Khi tạo đề thi thì giúp tôi, xem format đề thi môn văn trong file db.json trong folder mock của frontend, để map chính xác nội dung, đề văn được tạo ra chỉ chứa 1 câu duy nhất theo format này: { "id": "q-van-07", "type": "essay", "content": "Câu 2 (VDC). Thời kì hội nhập quốc tế đem đến nhiều cơ hội nhưng cũng đặt ra không ít thách thức cho việc bảo tồn, phát triển văn hóa truyền thống. Từ góc nhìn của người trẻ, anh/chị hãy viết bài văn nghị luận (khoảng 600 chữ) trình bày suy nghĩ về vấn đề trên.", "options": [], "correctAnswer": null, "explanation": "<p><b>Phương pháp:</b></p><p>Vận dụng kiến thức đã học về viết bài văn nghị luận.</p><p>Lựa chọn được các thao tác lập luận phù hợp, kết hợp nhuần nhuyễn lí lẽ và dẫn chứng.</p><p><b>Cách giải:</b> Có thể triển khai theo hướng:</p><ol><li><b>Mở bài:</b> Xác định đúng vấn đề nghị luận: Thời kì hội nhập quốc tế đem đến nhiều cơ hội nhưng cũng đặt ra không ít thách thức cho việc bảo tồn, phát triển văn hóa truyền thống.</li><li><b>Thân bài:</b><ul><li><b>Giải thích:</b> Văn hóa truyền thống là những giá trị vật chất và tinh thần được lưu truyền qua nhiều thế hệ. Hội nhập quốc tế là quá trình liên kết, gắn kết các quốc gia, dân tộc vì mục tiêu phát triển và tạo sức mạnh tập thể giải quyết vấn đề chung.</li><li><b>Hội nhập quốc tế là cơ hội</b> để văn hóa truyền thống được tiếp xúc với những nền văn hóa trên thế giới; trở nên phong phú, đa dạng, vừa mang nét truyền thống vừa hiện đại; tạo cơ hội để quảng bá du lịch, đất nước, thể hiện bản sắc dân tộc.</li><li><b>Hội nhập quốc tế là thách thức</b> bởi khi hội nhập, văn hóa truyền thống chịu áp lực cạnh tranh, xung đột lớn, có nguy cơ mai một, mất bản sắc.</li><li>Quá trình hội nhập văn hóa có thể tác động tiêu cực đến tâm lý và lối sống của con người, đặc biệt với người trẻ: Tuổi trẻ năng động, sáng tạo nhưng thiếu bản lĩnh và hiểu biết chưa sâu sắc nên cần ý thức được vai trò, trách nhiệm trong việc bảo tồn, phát triển văn hóa truyền thống; tích cực học tập, nghiên cứu, có hành động cụ thể để quảng bá văn hóa dân tộc; tiếp thu chọn lọc tinh hoa văn hóa nhân loại.</li><li><b>Mở rộng</b> vấn đề, trao đổi với quan điểm trái chiều hoặc ý kiến khác.</li></ul></li><li><b>Kết bài:</b> Khái quát vấn đề nghị luận.</li></ol>", "difficulty": "hard", "subject": "Ngữ Văn", "tags": [ "viết" ], "linkedPassageId": null, "points": 5, "isPublic": true, "createdBy": "admin-01", "createdAt": "2025-12-14T08:00:00Z", "updatedAt": "2025-12-14T08:00:00Z" }, => tự tạo và gán nó vào trong db của Exam và ExamQuestion, cấu trúc của exam thì tuân thủ theo giống trong file db.json, nhưng time thì set còn 45 phút thôi, người tạo thì theo currentUser, hãy viết lại prompt giúp tôi.
