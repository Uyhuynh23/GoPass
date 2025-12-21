"use client";

import React, { useState } from "react";
import { Question, QuestionOption } from "@/features/exam/types/question";
import CommonFields from "../CommonFields";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface MultipleChoiceOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

interface MultipleChoiceQuestion extends Question {
  title?: string;
  stem?: string;
  options?: MultipleChoiceOption[];
  allowMultipleCorrect?: boolean;
  explanation?: string;
  timeLimit?: number;
  language?: "vi" | "en";
  attachments?: string[];
}

interface MultipleChoiceFormProps {
  initialData?: Partial<MultipleChoiceQuestion>;
  passageId?: string;
  onSave: (data: MultipleChoiceQuestion) => void;
  onCancel: () => void;
}

const MultipleChoiceForm: React.FC<MultipleChoiceFormProps> = ({
  initialData,
  passageId,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<MultipleChoiceQuestion>>({
    type: "multiple_choice",
    title: initialData?.title || "",
    tags: initialData?.tags || [],
    difficulty: initialData?.difficulty || "medium",
    points: initialData?.points || 1,
    timeLimit: initialData?.timeLimit,
    language: initialData?.language || "vi",
    stem: initialData?.stem || "",
    options: initialData?.options || [
      { id: "1", content: "", isCorrect: false },
      { id: "2", content: "", isCorrect: false },
      { id: "3", content: "", isCorrect: false },
      { id: "4", content: "", isCorrect: false },
    ],
    allowMultipleCorrect: initialData?.allowMultipleCorrect || false,
    explanation: initialData?.explanation || "",
    attachments: initialData?.attachments || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleOptionChange = (index: number, content: string) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], content };
    setFormData({ ...formData, options: newOptions });
  };

  const toggleCorrectAnswer = (index: number) => {
    const newOptions = [...(formData.options || [])];

    if (formData.allowMultipleCorrect) {
      newOptions[index].isCorrect = !newOptions[index].isCorrect;
    } else {
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    }

    setFormData({ ...formData, options: newOptions });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.stem?.trim()) {
      newErrors.stem = "Câu hỏi không được để trống";
    }

    formData.options?.forEach((opt, idx) => {
      if (!opt.content.trim()) {
        newErrors[`option_${idx}`] = "Đáp án không được để trống";
      }
    });

    if (!formData.options?.some((opt) => opt.isCorrect)) {
      newErrors.correct = "Phải chọn ít nhất một đáp án đúng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      ...formData,
      passageId,
    } as MultipleChoiceQuestion);
  };

  return (
    <div className="space-y-6">
      <CommonFields
        title={formData.title || ""}
        onTitleChange={(val) => setFormData({ ...formData, title: val })}
        tags={formData.tags || []}
        onTagsChange={(val) => setFormData({ ...formData, tags: val })}
        difficulty={formData.difficulty!}
        onDifficultyChange={(val) =>
          setFormData({ ...formData, difficulty: val })
        }
        points={formData.points!}
        onPointsChange={(val) => setFormData({ ...formData, points: val })}
        timeLimit={formData.timeLimit}
        onTimeLimitChange={(val) =>
          setFormData({ ...formData, timeLimit: val })
        }
        language={formData.language!}
        onLanguageChange={(val) => setFormData({ ...formData, language: val })}
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Câu hỏi <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.stem}
            onChange={(e) => setFormData({ ...formData, stem: e.target.value })}
            rows={4}
            placeholder="Nhập nội dung câu hỏi..."
            className={`block w-full rounded-lg border ${
              errors.stem ? "border-red-500" : "border-gray-300"
            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none`}
          />
          {errors.stem && (
            <p className="mt-1 text-sm text-red-600">{errors.stem}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Đáp án <span className="text-red-500">*</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.allowMultipleCorrect}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allowMultipleCorrect: e.target.checked,
                  })
                }
                className="rounded"
              />
              Cho phép nhiều đáp án đúng
            </label>
          </div>

          <div className="space-y-3">
            {formData.options?.map((option, index) => (
              <div key={option.id} className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleCorrectAnswer(index)}
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center mt-2 transition-all ${
                    option.isCorrect
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-gray-300 hover:border-green-400"
                  }`}
                >
                  {option.isCorrect && (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 rounded font-semibold text-gray-700">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <input
                      type="text"
                      value={option.content}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                      className={`flex-1 rounded-lg border ${
                        errors[`option_${index}`]
                          ? "border-red-500"
                          : "border-gray-300"
                      } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500`}
                    />
                  </div>
                  {errors[`option_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors[`option_${index}`]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {errors.correct && (
            <p className="mt-2 text-sm text-red-600">{errors.correct}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giải thích (tùy chọn)
          </label>
          <textarea
            value={formData.explanation}
            onChange={(e) =>
              setFormData({ ...formData, explanation: e.target.value })
            }
            rows={3}
            placeholder="Giải thích đáp án đúng..."
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
        <Button variant="secondary" onClick={onCancel}>
          Quay lại
        </Button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => console.log("Save draft")}>
            Lưu nháp
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu câu hỏi
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceForm;
