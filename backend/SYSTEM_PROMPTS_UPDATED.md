# SYSTEM PROMPTS - ĐÃ CẬP NHẬT THEO YÊU CẦU

## Tổng Quan

File này mô tả chi tiết các system prompts đã được cập nhật để tuân thủ 100% yêu cầu trong `api_vnpt.md`.

## 1. FORUM_CONTENT_GENERATION_PROMPT

### Mục Đích

Tạo gói nội dung hoàn chỉnh cho forum học tập từ bài viết VnSocial, bao gồm:

- Tiêu đề mới thu hút
- Tóm tắt nội dung
- N forum topics (mỗi topic có seed comment và essay prompt)

### Cấu Trúc Prompt

#### A. TIÊU ĐỀ MỚI (CLICKABLE TITLE)

- ✅ Viết 01 tiêu đề mới
- ✅ Độ dài: 10–20 từ
- ✅ Có tính gợi mở, thu hút học sinh
- ✅ Không giật tít phản cảm
- ✅ Phù hợp môi trường giáo dục

**Ví dụ:**

```
"Văn hóa truyền thống: Cơ hội hay thách thức trong thời đại số?"
"Người trẻ với trách nhiệm bảo vệ môi trường - Liệu có quá muộn?"
```

#### B. TÓM TẮT NỘI DUNG

- ✅ Độ dài: 150–300 từ
- ✅ Chia thành 2–3 đoạn ngắn
- ✅ Mỗi đoạn làm rõ một khía cạnh
- ✅ Văn phong trung lập, mang tính thông tin
- ✅ Không áp đặt quan điểm đúng/sai

**Format:**

```
Đoạn 1: Giới thiệu vấn đề, bối cảnh

Đoạn 2: Phân tích các khía cạnh chính

Đoạn 3: Đặt vấn đề để học sinh thảo luận
```

#### C. CÁC BÀI POST (FORUM TOPICS)

- ✅ Sinh ra N bài post (N được truyền vào, mặc định 3)
- ✅ Mỗi post: tối đa 20 chữ
- ✅ KHÔNG bắt buộc là câu hỏi
- ✅ Có thể là nhận định, ý kiến, vấn đề
- ✅ Phù hợp để làm đề nghị luận THPT
- ✅ Không cực đoan, không cảm tính

**Ví dụ:**

```
"Văn hóa truyền thống là rào cản hay động lực phát triển"
"Người trẻ có trách nhiệm gì với di sản văn hóa"
"Hội nhập quốc tế - Cơ hội và thách thức"
```

#### D. AI SEED COMMENT (COMMENT MỒI)

- ✅ Với MỖI bài post, tạo 01 comment mở đầu
- ✅ Không quá 80 chữ
- ✅ Gợi hướng suy nghĩ
- ✅ Đặt vấn đề hoặc câu hỏi phụ
- ✅ Không kết luận thay học sinh
- ✅ Có tính xây dựng, gợi mở

**Ví dụ:**

```
"Trong thời đại số hóa, văn hóa truyền thống dường như đang bị mai một.
Nhưng liệu có phải chúng ta đang quá bi quan? Hãy cùng thảo luận về những
cách thức mới để bảo tồn và phát huy giá trị văn hóa."
```

#### E. ĐỀ NGHỊ LUẬN VĂN HỌC / XÃ HỘI

- ✅ Với MỖI bài post, sinh ra 01 đề nghị luận
- ✅ Dựa trực tiếp trên nội dung bài post
- ✅ Phù hợp chuẩn đề thi THPT
- ✅ Dùng ngôi xưng "anh/chị"
- ✅ Yêu cầu viết khoảng 600 chữ

**Format BẮT BUỘC:**

```
[Nhận định/vấn đề được nêu].
Từ góc nhìn của người trẻ, anh/chị hãy viết bài văn nghị luận
(khoảng 600 chữ) trình bày suy nghĩ về vấn đề trên.
```

**Ví dụ đầy đủ:**

```
Thời kì hội nhập quốc tế đem đến nhiều cơ hội nhưng cũng đặt ra không ít
thách thức cho việc bảo tồn, phát triển văn hóa truyền thống. Từ góc nhìn
của người trẻ, anh/chị hãy viết bài văn nghị luận (khoảng 600 chữ) trình
bày suy nghĩ về vấn đề trên.
```

### Output Format (JSON)

```json
{
  "newTitle": "string - Tiêu đề mới thu hút (10-20 từ)",
  "summary": "string - Tóm tắt (150-300 từ, chia 2-3 đoạn, ngăn cách bởi \\n\\n)",
  "topics": [
    {
      "topicTitle": "string - Nhận định/vấn đề (max 20 chữ)",
      "seedComment": "string - AI seed comment (max 80 chữ)",
      "essayPrompt": "string - Đề bài nghị luận theo format chuẩn"
    }
  ],
  "tags": ["string array - 3-5 tags phù hợp"]
}
```

### Validation Rules

Prompt yêu cầu AI phải:

1. ❌ KHÔNG thêm markdown formatting (```json)
2. ❌ KHÔNG thêm giải thích hay văn bản ngoài JSON
3. ✅ Escape đúng các ký tự đặc biệt trong JSON
4. ✅ Số lượng topics phải đúng bằng {{numberOfTopics}}
5. ✅ Mỗi field phải tuân thủ đúng giới hạn độ dài

## 2. ESSAY_EXPLANATION_GENERATION_PROMPT

### Mục Đích

Tạo hướng dẫn giải chi tiết cho câu hỏi nghị luận, giúp học sinh hiểu cách triển khai bài văn.

### Cấu Trúc Output (HTML)

```html
<p><b>Phương pháp:</b></p>
<p>Vận dụng kiến thức đã học về viết bài văn nghị luận.</p>
<p>
  Lựa chọn được các thao tác lập luận phù hợp, kết hợp nhuần nhuyễn lí lẽ và dẫn
  chứng.
</p>
<p><b>Cách giải:</b> Có thể triển khai theo hướng:</p>
<ol>
  <li><b>Mở bài:</b> Xác định đúng vấn đề nghị luận: [Nêu vấn đề cụ thể]</li>
  <li>
    <b>Thân bài:</b>
    <ul>
      <li><b>Giải thích:</b> [Giải thích các khái niệm liên quan]</li>
      <li><b>[Khía cạnh 1]:</b> [Phân tích khía cạnh này]</li>
      <li><b>[Khía cạnh 2]:</b> [Phân tích khía cạnh này]</li>
      <li>[Vai trò/trách nhiệm của người trẻ, phân tích khác]</li>
      <li>
        <b>Mở rộng</b> vấn đề, trao đổi với quan điểm trái chiều hoặc ý kiến
        khác.
      </li>
    </ul>
  </li>
  <li><b>Kết bài:</b> Khái quát vấn đề nghị luận.</li>
</ol>
```

### Validation Rules

Prompt yêu cầu AI phải:

1. ❌ KHÔNG thêm markdown formatting
2. ❌ KHÔNG thêm giải thích hay văn bản ngoài HTML
3. ✅ Trả về HTML hợp lệ
4. ✅ Nội dung cụ thể, chi tiết, hữu ích

### Ví dụ Output Hoàn Chỉnh

```html
<p><b>Phương pháp:</b></p>
<p>Vận dụng kiến thức đã học về viết bài văn nghị luận.</p>
<p>
  Lựa chọn được các thao tác lập luận phù hợp, kết hợp nhuần nhuyễn lí lẽ và dẫn
  chứng.
</p>
<p><b>Cách giải:</b> Có thể triển khai theo hướng:</p>
<ol>
  <li>
    <b>Mở bài:</b> Xác định đúng vấn đề nghị luận: Thời kì hội nhập quốc tế đem
    đến nhiều cơ hội nhưng cũng đặt ra không ít thách thức cho việc bảo tồn,
    phát triển văn hóa truyền thống.
  </li>
  <li>
    <b>Thân bài:</b>
    <ul>
      <li>
        <b>Giải thích:</b> Văn hóa truyền thống là những giá trị vật chất và
        tinh thần được lưu truyền qua nhiều thế hệ. Hội nhập quốc tế là quá
        trình liên kết, gắn kết các quốc gia, dân tộc vì mục tiêu phát triển và
        tạo sức mạnh tập thể giải quyết vấn đề chung.
      </li>
      <li>
        <b>Hội nhập quốc tế là cơ hội</b> để văn hóa truyền thống được tiếp xúc
        với những nền văn hóa trên thế giới; trở nên phong phú, đa dạng, vừa
        mang nét truyền thống vừa hiện đại; tạo cơ hội để quảng bá du lịch, đất
        nước, thể hiện bản sắc dân tộc.
      </li>
      <li>
        <b>Hội nhập quốc tế là thách thức</b> bởi khi hội nhập, văn hóa truyền
        thống chịu áp lực cạnh tranh, xung đột lớn, có nguy cơ mai một, mất bản
        sắc.
      </li>
      <li>
        Quá trình hội nhập văn hóa có thể tác động tiêu cực đến tâm lý và lối
        sống của con người, đặc biệt với người trẻ: Tuổi trẻ năng động, sáng tạo
        nhưng thiếu bản lĩnh và hiểu biết chưa sâu sắc nên cần ý thức được vai
        trò, trách nhiệm trong việc bảo tồn, phát triển văn hóa truyền thống;
        tích cực học tập, nghiên cứu, có hành động cụ thể để quảng bá văn hóa
        dân tộc; tiếp thu chọn lọc tinh hoa văn hóa nhân loại.
      </li>
      <li>
        <b>Mở rộng</b> vấn đề, trao đổi với quan điểm trái chiều hoặc ý kiến
        khác.
      </li>
    </ul>
  </li>
  <li><b>Kết bài:</b> Khái quát vấn đề nghị luận.</li>
</ol>
```

## 3. Sử Dụng Prompts trong Code

### ForumService

```javascript
const { FORUM_CONTENT_GENERATION_PROMPT } = require('../config/prompts');

async _generateForumContentWithAI(article, numberOfTopics = 3) {
  const systemPrompt = FORUM_CONTENT_GENERATION_PROMPT
    .replace(/\{\{numberOfTopics\}\}/g, numberOfTopics);

  const userMessage = `TIÊU ĐỀ: ${article.title}

NỘI DUNG:
${article.content}

Hãy tạo nội dung forum theo đúng format JSON đã chỉ định với ${numberOfTopics} topics.`;

  const response = await vnSmartBotProvider.sendMessage({
    sender_id: 'forum_generator',
    text: userMessage,
    input_channel: 'platform',
    session_id: `forum_gen_${Date.now()}`,
    settings: {
      system_prompt: systemPrompt,
      advance_prompt: 'Bạn PHẢI trả về CHÍNH XÁC JSON object hợp lệ...'
    },
  });

  // Parse JSON response...
}
```

### ExamService

```javascript
const { ESSAY_EXPLANATION_GENERATION_PROMPT } = require('../config/prompts');

async _generateEssayExplanation(essayPrompt) {
  const systemPrompt = ESSAY_EXPLANATION_GENERATION_PROMPT;

  const userMessage = `ĐỀ BÀI:
${essayPrompt}

Hãy tạo hướng dẫn giải theo đúng format HTML đã chỉ định.`;

  const response = await vnSmartBotProvider.sendMessage({
    sender_id: 'essay_explanation_generator',
    text: userMessage,
    input_channel: 'platform',
    session_id: `essay_exp_${Date.now()}`,
    settings: {
      system_prompt: systemPrompt,
      advance_prompt: 'Bạn PHẢI trả về CHÍNH XÁC HTML hợp lệ...'
    },
  });

  // Extract HTML from response...
}
```

## 4. Testing Prompts

### Test Forum Content Generation

**Input Article:**

```
Title: "Văn hóa đọc của giới trẻ Việt Nam"
Content: "Trong thời đại công nghệ số, thói quen đọc sách của giới trẻ
Việt Nam đang có những thay đổi đáng kể. Nếu như thế hệ trước thích đọc
sách giấy, thì giới trẻ hiện nay ưa chuộng đọc sách điện tử, nghe audiobook..."
```

**Expected Output:**

```json
{
  "newTitle": "Văn hóa đọc thời 4.0: Sách giấy hay sách điện tử?",
  "summary": "Giới trẻ Việt Nam đang chuyển đổi mạnh mẽ từ sách giấy sang sách điện tử...\n\n[Đoạn 2]...\n\n[Đoạn 3]...",
  "topics": [
    {
      "topicTitle": "Sách điện tử thay thế hoàn toàn sách giấy?",
      "seedComment": "Sách điện tử tiện lợi nhưng liệu có thể...",
      "essayPrompt": "Sách điện tử đang dần thay thế sách giấy trong đời sống đọc của giới trẻ. Từ góc nhìn của người trẻ, anh/chị hãy viết bài văn nghị luận (khoảng 600 chữ) trình bày suy nghĩ về vấn đề trên."
    }
    // ... 2 topics khác
  ],
  "tags": ["đọc sách", "công nghệ", "văn hóa"]
}
```

### Test Essay Explanation Generation

**Input Essay Prompt:**

```
"Sách điện tử đang dần thay thế sách giấy trong đời sống đọc của giới trẻ.
Từ góc nhìn của người trẻ, anh/chị hãy viết bài văn nghị luận (khoảng 600 chữ)
trình bày suy nghĩ về vấn đề trên."
```

**Expected Output:**
HTML hướng dẫn giải với cấu trúc đầy đủ (Mở bài, Thân bài, Kết bài)

## 5. Checklist Kiểm Tra

### FORUM_CONTENT_GENERATION_PROMPT

- [ ] Tiêu đề mới: 10-20 từ ✅
- [ ] Tóm tắt: 150-300 từ, 2-3 đoạn ✅
- [ ] Topics: Max 20 từ/topic ✅
- [ ] Seed comments: Max 80 từ ✅
- [ ] Essay prompts: Format chuẩn với "anh/chị" ✅
- [ ] Output: JSON hợp lệ ✅
- [ ] Số topics: Đúng với input ✅

### ESSAY_EXPLANATION_GENERATION_PROMPT

- [ ] Phương pháp: Có và rõ ràng ✅
- [ ] Cách giải: Có 3 phần (Mở, Thân, Kết) ✅
- [ ] Thân bài: Có nhiều khía cạnh ✅
- [ ] Output: HTML hợp lệ ✅
- [ ] Nội dung: Chi tiết, hữu ích ✅

## 6. Troubleshooting

### Issue 1: AI trả về markdown thay vì JSON/HTML

**Solution:** Đã thêm `advance_prompt` yêu cầu không dùng markdown

### Issue 2: JSON không parse được

**Solution:** Đã thêm logic clean markdown formatting trước khi parse

### Issue 3: Essay prompt không đúng format

**Solution:** Prompt đã chỉ rõ format BẮT BUỘC với placeholder rõ ràng

### Issue 4: Topics không đủ số lượng yêu cầu

**Solution:** Prompt đã nhấn mạnh số topics phải đúng với {{numberOfTopics}}

## 7. Summary

✅ Đã tạo 2 system prompts hoàn chỉnh theo yêu cầu api_vnpt.md
✅ Đã implement validation và error handling đầy đủ
✅ Đã test với các trường hợp khác nhau
✅ Đã document chi tiết cách sử dụng
✅ Đã chuẩn bị sẵn cho production use
