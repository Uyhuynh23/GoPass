"use client";

import React, { useState } from "react";
import { Question } from "@/features/exam/types/question";
import CommonFields from "../CommonFields";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface ShortAnswerQuestion extends Question {
  title?: string;
  stem?: string;
  answerType?: "text" | "numeric" | "regex";
  acceptedAnswers?: string[];
  caseSensitive?: boolean;
  numericConfig?: {
    min: number;
    max: number;
    tolerance: number;
  };
  regexPattern?: string;
  autoGrading?: boolean;
  timeLimit?: number;
  language?: "vi" | "en";
}

interface ShortAnswerFormProps {
  initialData?: Partial<ShortAnswerQuestion>;
  passageId?: string;
  onSave: (data: ShortAnswerQuestion) => void;
  onCancel: () => void;
}

const ShortAnswerForm: React.FC<ShortAnswerFormProps> = ({
  initialData,
  passageId,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<ShortAnswerQuestion>>({
    type: "short_answer",
    title: initialData?.title || "",
    tags: initialData?.tags || [],
    difficulty: initialData?.difficulty || "medium",
    points: initialData?.points || 1,
    timeLimit: initialData?.timeLimit,
    language: initialData?.language || "vi",
    stem: initialData?.stem || "",
    answerType: initialData?.answerType || "text",
    acceptedAnswers: initialData?.acceptedAnswers || [""],
    caseSensitive: initialData?.caseSensitive ?? false,
    numericConfig: initialData?.numericConfig,
    regexPattern: initialData?.regexPattern,
    autoGrading: initialData?.autoGrading ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAnswerTypeChange = (type: "text" | "numeric" | "regex") => {
    setFormData({
      ...formData,
      answerType: type,
      numericConfig:
        type === "numeric" ? { min: 0, max: 100, tolerance: 0 } : undefined,
      regexPattern: type === "regex" ? "" : undefined,
    });
  };

  const addAcceptedAnswer = () => {
    setFormData({
      ...formData,
      acceptedAnswers: [...(formData.acceptedAnswers || []), ""],
    });
  };

  const removeAcceptedAnswer = (index: number) => {
    if (!formData.acceptedAnswers || formData.acceptedAnswers.length <= 1)
      return;
    const newAnswers = formData.acceptedAnswers.filter(
      (_: any, i: any) => i !== index
    );
    setFormData({ ...formData, acceptedAnswers: newAnswers });
  };

  const updateAcceptedAnswer = (index: number, value: string) => {
    const newAnswers = [...(formData.acceptedAnswers || [])];
    newAnswers[index] = value;
    setFormData({ ...formData, acceptedAnswers: newAnswers });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.stem?.trim()) {
      newErrors.stem = "Câu hỏi không được để trống";
    }

    if (formData.answerType === "text") {
      if (!formData.acceptedAnswers?.some((ans) => ans.trim())) {
        newErrors.answers = "Phải có ít nhất một đáp án được chấp nhận";
      }
    } else if (formData.answerType === "numeric") {
      if (!formData.numericConfig) {
        newErrors.numeric = "Cấu hình số không hợp lệ";
      }
    } else if (formData.answerType === "regex") {
      if (!formData.regexPattern?.trim()) {
        newErrors.regex = "Pattern regex không được để trống";
      } else {
        try {
          new RegExp(formData.regexPattern);
        } catch {
          newErrors.regex = "Pattern regex không hợp lệ";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      ...formData,
      passageId,
    } as ShortAnswerQuestion);
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại đáp án <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "text", label: "Văn bản", icon: "T" },
              { value: "numeric", label: "Số", icon: "123" },
              { value: "regex", label: "Pattern", icon: ".*" },
            ].map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleAnswerTypeChange(type.value as any)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.answerType === type.value
                    ? "border-teal-500 bg-teal-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="text-2xl font-bold mb-1">{type.icon}</div>
                <div className="text-sm font-medium">{type.label}</div>
              </button>
            ))}
          </div>
        </div>

        {formData.answerType === "text" && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Đáp án được chấp nhận <span className="text-red-500">*</span>
            </label>
            {formData.acceptedAnswers?.map((answer, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={answer}
                  onChange={(e) => updateAcceptedAnswer(index, e.target.value)}
                  placeholder={`Đáp án ${index + 1}`}
                  className="flex-1"
                />
                {formData.acceptedAnswers &&
                  formData.acceptedAnswers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAcceptedAnswer(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
              </div>
            ))}
            {errors.answers && (
              <p className="text-sm text-red-600">{errors.answers}</p>
            )}
            <Button variant="secondary" onClick={addAcceptedAnswer} size="sm">
              + Thêm đáp án khác
            </Button>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={formData.caseSensitive}
                onChange={(e) =>
                  setFormData({ ...formData, caseSensitive: e.target.checked })
                }
                className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
              />
              Phân biệt chữ hoa/thường
            </label>
          </div>
        )}

        {formData.answerType === "numeric" && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá trị nhỏ nhất
              </label>
              <Input
                type="number"
                value={formData.numericConfig?.min ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numericConfig: {
                      ...formData.numericConfig!,
                      min: parseFloat(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá trị lớn nhất
              </label>
              <Input
                type="number"
                value={formData.numericConfig?.max ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numericConfig: {
                      ...formData.numericConfig!,
                      max: parseFloat(e.target.value) || 100,
                    },
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sai số cho phép
              </label>
              <Input
                type="number"
                step="0.01"
                value={formData.numericConfig?.tolerance ?? ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    numericConfig: {
                      ...formData.numericConfig!,
                      tolerance: parseFloat(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
            {errors.numeric && (
              <p className="col-span-3 text-sm text-red-600">
                {errors.numeric}
              </p>
            )}
          </div>
        )}

        {formData.answerType === "regex" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Regular Expression Pattern <span className="text-red-500">*</span>
            </label>
            <Input
              value={formData.regexPattern || ""}
              onChange={(e) =>
                setFormData({ ...formData, regexPattern: e.target.value })
              }
              placeholder="^[A-Za-z0-9]+$"
              className={errors.regex ? "border-red-500" : ""}
            />
            {errors.regex && (
              <p className="mt-1 text-sm text-red-600">{errors.regex}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Ví dụ: ^[A-Za-z0-9]+$ (chỉ chấp nhận chữ cái và số)
            </p>
          </div>
        )}

        <div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.autoGrading}
              onChange={(e) =>
                setFormData({ ...formData, autoGrading: e.target.checked })
              }
              className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
            />
            <span className="font-medium">Tự động chấm điểm</span>
          </label>
          {!formData.autoGrading && (
            <p className="mt-1 text-xs text-gray-500">
              Câu hỏi sẽ cần được chấm thủ công bởi giảng viên
            </p>
          )}
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

export default ShortAnswerForm;
