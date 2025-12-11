1. Câu hỏi Toán - Phần Đúng sai:
   const renderSwitch = (id: string, value: boolean | null, correctValue?: boolean) => {
   return (
   <div className="flex gap-3">
   <button
   onClick={() => handleAnswerChange(id, true)}
   disabled={reviewMode}
   className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all ${
            reviewMode
              ? value === true && correctValue === true
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg ring-2 ring-green-400/50'
                : value === true && correctValue === false
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg ring-2 ring-red-400/50'
                : correctValue === true
                ? 'bg-white border-2 border-green-500 text-green-700 shadow-sm'
                : 'bg-white border-2 border-gray-300 text-gray-700 shadow-sm'
              : value === true
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg ring-2 ring-green-400/50 scale-105'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-green-400 hover:bg-green-50 shadow-sm'
          } ${reviewMode ? 'cursor-default' : ''}`} >
   <CheckCircle className={`h-4 w-4 ${value === true || (reviewMode && correctValue === true) ? 'fill-current' : 'group-hover:text-green-500'}`} />
   <span className="font-medium">Đúng</span>
   </button>
   <button
   onClick={() => handleAnswerChange(id, false)}
   disabled={reviewMode}
   className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all ${
            reviewMode
              ? value === false && correctValue === false
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg ring-2 ring-green-400/50'
                : value === false && correctValue === true
                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg ring-2 ring-red-400/50'
                : correctValue === false
                ? 'bg-white border-2 border-green-500 text-green-700 shadow-sm'
                : 'bg-white border-2 border-gray-300 text-gray-700 shadow-sm'
              : value === false
              ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg ring-2 ring-red-400/50 scale-105'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-400 hover:bg-red-50 shadow-sm'
          } ${reviewMode ? 'cursor-default' : ''}`} >
   <XCircle className={`h-4 w-4 ${value === false || (reviewMode && correctValue === false) ? 'fill-current' : 'group-hover:text-red-500'}`} />
   <span className="font-medium">Sai</span>
   </button>
   </div>
   );
   };

return (
<div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-purple-50/30 overflow-hidden">
{/_ Question Header _/}
<div className="bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
<div className="flex items-center gap-4">
<div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg text-lg text-white ${
            reviewMode 
              ? allCorrect 
                ? 'bg-gradient-to-br from-green-600 to-emerald-700' 
                : hasAnswer
                ? 'bg-gradient-to-br from-red-600 to-rose-700'
                : 'bg-gradient-to-br from-gray-400 to-gray-500'
              : 'bg-gradient-to-br from-purple-600 to-purple-700'
          }`}>
{question.number}
</div>
<div>
<div className="flex items-center gap-2">
<h2 className="text-lg text-gray-900">
<strong>Câu {question.number}</strong>
</h2>
{reviewMode && allCorrect && (
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
<CheckCircle className="h-3.5 w-3.5" />
<span>Đúng hoàn toàn</span>
</div>
)}
{reviewMode && !allCorrect && hasAnswer && (
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs">
<XCircle className="h-3.5 w-3.5" />
<span>Có sai sót</span>
</div>
)}
{reviewMode && !hasAnswer && (
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
<span>Chưa trả lời</span>
</div>
)}
</div>
<div className="flex items-center gap-3 text-sm text-gray-600">
<span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Phần II - Đúng/Sai</span>
<span className="text-purple-600">{question.points} điểm tối đa</span>
</div>
</div>
</div>

        {!reviewMode && (
          <button
            onClick={() => onToggleFlag(questionId)}
            className={`p-3 rounded-xl transition-all ${
              isFlagged
                ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200 ring-2 ring-yellow-400/50 shadow-md'
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
            }`}
            title="Đánh dấu xem lại"
          >
            <Flag className="h-5 w-5" fill={isFlagged ? 'currentColor' : 'none'} />
          </button>
        )}
        {reviewMode && isFlagged && (
          <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
            <Flag className="h-5 w-5" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Question Stem */}
          <div className="bg-white rounded-2xl border-2 border-purple-200 p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-2 h-full bg-gradient-to-b from-purple-600 to-pink-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-base text-gray-900 leading-relaxed">
                  {question.stem}
                </p>
              </div>
            </div>
          </div>

          {/* Sub-questions */}
          <div className="space-y-4">
            {question.subQuestions.map((sq) => {
              const value = answers[sq.id];
              const correctValue = reviewMode ? correctAnswer[sq.id] : undefined;
              const isCorrectAnswer = reviewMode && value === correctValue;
              const isWrongAnswer = reviewMode && value !== null && value !== correctValue;

              let borderColor = 'border-gray-300';
              let ringColor = '';

              if (reviewMode) {
                if (isCorrectAnswer) {
                  borderColor = 'border-green-400';
                  ringColor = 'ring-2 ring-green-200/50';
                } else if (isWrongAnswer) {
                  borderColor = 'border-red-400';
                  ringColor = 'ring-2 ring-red-200/50';
                }
              } else {
                if (value === true) {
                  borderColor = 'border-green-400';
                  ringColor = 'ring-2 ring-green-200/50';
                } else if (value === false) {
                  borderColor = 'border-red-400';
                  ringColor = 'ring-2 ring-red-200/50';
                }
              }

              return (
                <div
                  key={sq.id}
                  className={`bg-white rounded-2xl border-2 p-6 shadow-md transition-all ${borderColor} ${ringColor}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-700 rounded-xl flex items-center justify-center text-base shadow-sm border-2 border-purple-300">
                      <span className="font-bold">{sq.id})</span>
                    </div>
                    <p className="flex-1 text-base text-gray-800 leading-relaxed pt-1.5">
                      {sq.text}
                    </p>
                  </div>

                  <div className="ml-14 flex items-center gap-3 flex-wrap">
                    {renderSwitch(sq.id, value, correctValue)}
                    {!reviewMode && value !== null && (
                      <span className={`text-xs ml-2 ${
                        value === true ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ✓ Đã chọn
                      </span>
                    )}
                    {reviewMode && isCorrectAnswer && (
                      <span className="text-xs ml-2 text-green-600 font-medium">
                        ✓ Chính xác
                      </span>
                    )}
                    {reviewMode && isWrongAnswer && (
                      <span className="text-xs ml-2 text-red-600 font-medium">
                        ✗ Sai - Đáp án đúng: {correctValue ? 'Đúng' : 'Sai'}
                      </span>
                    )}
                    {reviewMode && value === null && (
                      <span className="text-xs ml-2 text-gray-600">
                        Chưa trả lời - Đáp án đúng: {correctValue ? 'Đúng' : 'Sai'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Instructions / Explanation */}
          {!reviewMode && (
            <div className="bg-purple-50 border-l-4 border-purple-500 rounded-r p-4 flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
              <div className="text-sm text-gray-700">
                <p><strong>Hướng dẫn:</strong> Trong mỗi ý a), b), c), d), thí sinh chọn <strong>Đúng</strong> hoặc <strong>Sai</strong>.</p>
              </div>
            </div>
          )}

          {/* Explanation in Review Mode */}
          {reviewMode && explanation && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-300 p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-base text-gray-900 pt-2"><strong>Lời giải chi tiết</strong></h4>
              </div>
              <div className="ml-13 text-sm text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap">{explanation}</p>
              </div>
            </div>
          )}

          {/* Teacher Comment in Review Mode */}
          {reviewMode && teacherComment && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-base text-gray-900 pt-2"><strong>Lời phê của giáo viên</strong></h4>
              </div>
              <div className="ml-13 text-sm text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap">{teacherComment}</p>
              </div>
            </div>
          )}

          {/* No Answer Warning in Review Mode */}
          {reviewMode && !hasAnswer && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <span>Bạn đã không trả lời câu hỏi này</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t-2 border-gray-200 px-6 py-4 flex justify-between flex-shrink-0 shadow-lg">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <ChevronLeft className="h-5 w-5" />
          Câu trước
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
        >
          Câu tiếp theo
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>

);
}

2. Câu hỏi Toán - Phần điền kết quả:
   import React, { useState, useRef, useEffect } from 'react';
   import { Flag, ChevronLeft, Info, Sparkles, CheckCircle, XCircle, Lightbulb, MessageSquare } from 'lucide-react';

interface MathExamQuestion3Props {
questionId: number;
onAnswerChange: (questionId: number, answer: string) => void;
onToggleFlag: (questionId: number) => void;
isFlagged: boolean;
currentAnswer: string;
onPrev: () => void;
reviewMode?: boolean;
correctAnswer?: string;
explanation?: string;
teacherComment?: string;
}

export function MathExamQuestion3({
questionId,
onAnswerChange,
onToggleFlag,
isFlagged,
currentAnswer,
onPrev,
reviewMode = false,
correctAnswer = '',
explanation = '',
teacherComment = ''
}: MathExamQuestion3Props) {
const [digits, setDigits] = useState<string[]>(
currentAnswer ? currentAnswer.split('').concat(Array(4 - currentAnswer.length).fill('')) : ['', '', '', '']
);
const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

const isCorrect = reviewMode && currentAnswer === correctAnswer;
const hasAnswer = currentAnswer !== null && currentAnswer !== '';

useEffect(() => {
// Focus first empty input
const firstEmptyIndex = digits.findIndex(d => d === '');
if (firstEmptyIndex !== -1 && inputRefs.current[firstEmptyIndex]) {
inputRefs.current[firstEmptyIndex]?.focus();
}
}, []);

const handleInputChange = (index: number, value: string) => {
if (reviewMode) return; // Disable input in review mode

    // Only allow digits, dot, and minus
    if (value && !/^[0-9.\-]$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Update answer
    const answer = newDigits.join('').trim();
    onAnswerChange(questionId, answer);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

};

const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
if (e.key === 'Backspace' && !digits[index] && index > 0) {
inputRefs.current[index - 1]?.focus();
}
if (e.key === 'ArrowLeft' && index > 0) {
inputRefs.current[index - 1]?.focus();
}
if (e.key === 'ArrowRight' && index < 3) {
inputRefs.current[index + 1]?.focus();
}
};

// Mock question data
const question = {
number: questionId - 16,
points: 0.5,
text: "Để đạt được một vật trang trí trên một bề mặt, người ta thiết kế một mô hình từ một khối hộp chữ nhật có kích thước 7,4 cm và 10,4 cm. Lấy một phần bề mặt của khối hộp đó để làm một vật trang trí. Khoảng cách giữa hai điểm G và H là bao nhiêu cm (làm tròn kết quả đến hàng phần mười)?",
hint: "Làm tròn đến hàng phần mười (ví dụ: 0.5)",
example: "Ví dụ: 12.3 → [1][2][.][3]"
};

return (
<div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-orange-50/30 overflow-hidden">
{/_ Question Header _/}
<div className="bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-sm">
<div className="flex items-center gap-4">
<div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-lg text-lg text-white ${
            reviewMode 
              ? isCorrect 
                ? 'bg-gradient-to-br from-green-600 to-emerald-700' 
                : hasAnswer
                ? 'bg-gradient-to-br from-red-600 to-rose-700'
                : 'bg-gradient-to-br from-gray-400 to-gray-500'
              : 'bg-gradient-to-br from-orange-600 to-orange-700'
          }`}>
{question.number}
</div>
<div>
<div className="flex items-center gap-2">
<h2 className="text-lg text-gray-900">
<strong>Câu {question.number}</strong>
</h2>
{reviewMode && isCorrect && (
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
<CheckCircle className="h-3.5 w-3.5" />
<span>Đúng</span>
</div>
)}
{reviewMode && !isCorrect && hasAnswer && (
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs">
<XCircle className="h-3.5 w-3.5" />
<span>Sai</span>
</div>
)}
{reviewMode && !hasAnswer && (
<div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs">
<span>Chưa trả lời</span>
</div>
)}
</div>
<div className="flex items-center gap-3 text-sm text-gray-600">
<span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">Phần III - Trả lời ngắn</span>
<span className="text-orange-600">{question.points} điểm</span>
</div>
</div>
</div>

        {!reviewMode && (
          <button
            onClick={() => onToggleFlag(questionId)}
            className={`p-3 rounded-xl transition-all ${
              isFlagged
                ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200 ring-2 ring-yellow-400/50 shadow-md'
                : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
            }`}
            title="Đánh dấu xem lại"
          >
            <Flag className="h-5 w-5" fill={isFlagged ? 'currentColor' : 'none'} />
          </button>
        )}
        {reviewMode && isFlagged && (
          <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
            <Flag className="h-5 w-5" fill="currentColor" />
          </div>
        )}
      </div>

      {/* Question Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Question Text */}
          <div className="bg-white rounded-2xl border-2 border-orange-200 p-8 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-2 h-full bg-gradient-to-b from-orange-600 to-amber-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-base text-gray-900 leading-relaxed">
                  {question.text}
                </p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700">
                  <strong>Lưu ý:</strong> {question.hint}
                </p>
              </div>
            </div>
          </div>

          {/* Answer Input Area */}
          <div className={`bg-gradient-to-br rounded-2xl border-2 p-10 shadow-2xl ${
            reviewMode
              ? isCorrect
                ? 'from-green-50 to-emerald-50/50 border-green-400'
                : hasAnswer
                ? 'from-red-50 to-rose-50/50 border-red-400'
                : 'from-gray-50 to-gray-100/50 border-gray-400'
              : 'from-white to-orange-50/50 border-orange-300'
          }`}>
            <div className="text-center mb-8">
              <h3 className="text-lg text-gray-900 mb-2 flex items-center justify-center gap-2">
                <Info className={`h-5 w-5 ${reviewMode ? isCorrect ? 'text-green-600' : 'text-red-600' : 'text-orange-600'}`} />
                <strong>{reviewMode ? 'Đáp án của bạn' : 'Nhập đáp án của bạn'}</strong>
              </h3>
              <p className="text-sm text-gray-600">Tối đa 4 ký tự</p>
            </div>

            {/* 4 Input Boxes */}
            <div className="flex justify-center gap-4 mb-8">
              {digits.map((digit, index) => (
                <div key={index} className="relative">
                  <input
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={reviewMode}
                    className={`w-20 h-20 text-center text-3xl border-4 rounded-2xl transition-all bg-white shadow-lg font-mono ${
                      reviewMode
                        ? isCorrect
                          ? 'border-green-500 text-green-700'
                          : hasAnswer
                          ? 'border-red-500 text-red-700'
                          : 'border-gray-400 text-gray-700'
                        : 'border-orange-400 focus:ring-4 focus:ring-orange-300 focus:border-orange-600'
                    } ${reviewMode ? 'cursor-not-allowed' : ''}`}
                    placeholder="_"
                  />
                  {digit && !reviewMode && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-md animate-bounce">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Example & Instructions */}
            {!reviewMode && (
              <div className="space-y-3 text-center">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-100 rounded-xl text-sm text-gray-700 shadow-sm">
                  <Info className="h-4 w-4 text-orange-600" />
                  <span>{question.example}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Nhấn phím số hoặc dấu chấm để tự động chuyển ô. Nhấn <kbd className="px-2 py-0.5 bg-gray-200 rounded text-xs">Backspace</kbd> để quay lại.
                </p>
              </div>
            )}

            {/* Progress Indicator / Review Status */}
            <div className="mt-6 flex justify-center gap-2">
              {reviewMode ? (
                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                  isCorrect
                    ? 'bg-green-100 text-green-700'
                    : hasAnswer
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {isCorrect ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : hasAnswer ? (
                    <XCircle className="h-4 w-4" />
                  ) : null}
                  <span className="text-sm font-medium">
                    {isCorrect ? 'Chính xác!' : hasAnswer ? 'Không chính xác' : 'Chưa trả lời'}
                  </span>
                </div>
              ) : (
                [0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full transition-all ${
                      digits[i] ? 'bg-gradient-to-r from-orange-600 to-amber-600 scale-110' : 'bg-gray-300'
                    }`}
                  />
                ))
              )}
            </div>
          </div>

          {/* Correct Answer Display in Review Mode */}
          {reviewMode && !isCorrect && correctAnswer && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-400 p-8 shadow-lg">
              <div className="text-center mb-6">
                <h4 className="text-lg text-gray-900 mb-2 flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <strong>Đáp án đúng</strong>
                </h4>
                <p className="text-sm text-gray-600">Đây là đáp án chính xác cho câu hỏi này</p>
              </div>
              <div className="flex justify-center gap-4">
                {correctAnswer.split('').concat(Array(Math.max(0, 4 - correctAnswer.length)).fill('')).slice(0, 4).map((char, index) => (
                  <div key={index} className="w-20 h-20 text-center text-3xl border-4 border-green-500 rounded-2xl flex items-center justify-center bg-white shadow-lg font-mono text-green-700">
                    {char || '_'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info / Explanation */}
          {!reviewMode && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r p-4 flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
              <div className="text-sm text-gray-700">
                <p><strong>Hướng dẫn:</strong> Thí sinh trả lời từ câu 1 đến câu 6. Mỗi câu, thí sinh điền đáp án vào ô trả lời tương ứng trong bài làm. Đáp án đúng đến đâu được tính điểm đến đó.</p>
              </div>
            </div>
          )}

          {/* Explanation in Review Mode */}
          {reviewMode && explanation && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-300 p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md">
                  <Lightbulb className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-base text-gray-900 pt-2"><strong>Lời giải chi tiết</strong></h4>
              </div>
              <div className="ml-13 text-sm text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap">{explanation}</p>
              </div>
            </div>
          )}

          {/* Teacher Comment in Review Mode */}
          {reviewMode && teacherComment && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 p-6 shadow-lg">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-600 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <h4 className="text-base text-gray-900 pt-2"><strong>Lời phê của giáo viên</strong></h4>
              </div>
              <div className="ml-13 text-sm text-gray-700 leading-relaxed">
                <p className="whitespace-pre-wrap">{teacherComment}</p>
              </div>
            </div>
          )}

          {/* No Answer Warning in Review Mode */}
          {reviewMode && !hasAnswer && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-3 rounded-lg border border-gray-300">
              <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
              <span>Bạn đã không trả lời câu hỏi này</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-t-2 border-gray-200 px-6 py-4 flex justify-start flex-shrink-0 shadow-lg">
        <button
          onClick={onPrev}
          className="px-6 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
        >
          <ChevronLeft className="h-5 w-5" />
          Câu trước
        </button>
      </div>
    </div>

);
}
