"use client";

import React, { useState } from "react";
import { Question } from "@/features/exam/types/question";
import CommonFields from "../CommonFields";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface GradingCriterion {
  id: string;
  criterion: string;
  description: string;
  points: number;
}

interface LongAnswerQuestion extends Question {
  title?: string;
  prompt?: string;
  wordLimit?: number;
  timeLimit?: number;
  language?: "vi" | "en";
  gradingType?: "manual" | "ai_assisted";
  rubric?: GradingCriterion[];
}

interface LongAnswerFormProps {
  initialData?: Partial<LongAnswerQuestion>;
  passageId?: string;
  onSave: (data: LongAnswerQuestion) => void;
  onCancel: () => void;
}

const LongAnswerForm: React.FC<LongAnswerFormProps> = ({
  initialData,
  passageId,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<LongAnswerQuestion>>({
    type: "essay",
    title: initialData?.title || "",
    tags: initialData?.tags || [],
    difficulty: initialData?.difficulty || "medium",
    points: initialData?.points || 1,
    timeLimit: initialData?.timeLimit,
    language: initialData?.language || "vi",
    prompt: initialData?.prompt || "",
    wordLimit: initialData?.wordLimit,
    gradingType: initialData?.gradingType || "manual",
    rubric: initialData?.rubric || [
      { id: "1", criterion: "Nội dung", description: "", points: 0 },
    ],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addCriterion = () => {
    const newRubric = [
      ...(formData.rubric || []),
      { id: Date.now().toString(), criterion: "", description: "", points: 0 },
    ];
    setFormData({ ...formData, rubric: newRubric });
  };

  const removeCriterion = (id: string) => {
    if (!formData.rubric || formData.rubric.length <= 1) return;
    const newRubric = formData.rubric.filter((r) => r.id !== id);
    setFormData({ ...formData, rubric: newRubric });
  };

  const updateCriterion = (
    id: string,
    field: keyof GradingCriterion,
    value: any
  ) => {
    const newRubric = formData.rubric?.map((r) =>
      r.id === id ? { ...r, [field]: value } : r
    );
    setFormData({ ...formData, rubric: newRubric });
  };

  const getTotalPoints = () => {
    return formData.rubric?.reduce((sum, r) => sum + (r.points || 0), 0) || 0;
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.prompt?.trim()) {
      newErrors.prompt = "Yêu cầu bài viết không được để trống";
    }

    if (!formData.rubric || formData.rubric.length === 0) {
      newErrors.rubric = "Phải có ít nhất một tiêu chí chấm điểm";
    } else {
      formData.rubric.forEach((r, idx) => {
        if (!r.criterion.trim()) {
          newErrors[`criterion_${idx}`] = "Tiêu chí không được để trống";
        }
        if (r.points <= 0) {
          newErrors[`points_${idx}`] = "Điểm phải lớn hơn 0";
        }
      });
    }

    const totalPoints = getTotalPoints();
    if (totalPoints !== formData.points) {
      newErrors.totalPoints = `Tổng điểm tiêu chí (${totalPoints}) phải bằng điểm câu hỏi (${formData.points})`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      ...formData,
      passageId,
    } as LongAnswerQuestion);
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
            Yêu cầu bài viết <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.prompt}
            onChange={(e) =>
              setFormData({ ...formData, prompt: e.target.value })
            }
            rows={6}
            placeholder="Nhập yêu cầu chi tiết cho bài viết của học sinh..."
            className={`block w-full rounded-lg border ${
              errors.prompt ? "border-red-500" : "border-gray-300"
            } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none`}
          />
          {errors.prompt && (
            <p className="mt-1 text-sm text-red-600">{errors.prompt}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giới hạn từ (tùy chọn)
            </label>
            <Input
              type="number"
              value={formData.wordLimit ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  wordLimit: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              placeholder="Ví dụ: 500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại chấm điểm <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.gradingType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  gradingType: e.target.value as "manual" | "ai_assisted",
                })
              }
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="manual">Chấm thủ công</option>
              <option value="ai_assisted">AI hỗ trợ</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Tiêu chí chấm điểm <span className="text-red-500">*</span>
            </label>
            <div className="text-sm">
              <span className="text-gray-500">Tổng điểm: </span>
              <span
                className={`font-semibold ${
                  errors.totalPoints ? "text-red-600" : "text-teal-600"
                }`}
              >
                {getTotalPoints()} / {formData.points}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {formData.rubric?.map((criterion, index) => (
              <div
                key={criterion.id}
                className="p-4 bg-gray-50 rounded-lg space-y-3"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded border border-gray-300 font-semibold text-gray-700">
                    {index + 1}
                  </span>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <Input
                      value={criterion.criterion}
                      onChange={(e) =>
                        updateCriterion(
                          criterion.id,
                          "criterion",
                          e.target.value
                        )
                      }
                      placeholder="Tên tiêu chí"
                      className={
                        errors[`criterion_${index}`] ? "border-red-500" : ""
                      }
                    />
                    <Input
                      type="number"
                      value={criterion.points}
                      onChange={(e) =>
                        updateCriterion(
                          criterion.id,
                          "points",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      placeholder="Điểm"
                      className={
                        errors[`points_${index}`] ? "border-red-500" : ""
                      }
                    />
                  </div>
                  {formData.rubric && formData.rubric.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCriterion(criterion.id)}
                      className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
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
                <textarea
                  value={criterion.description}
                  onChange={(e) =>
                    updateCriterion(criterion.id, "description", e.target.value)
                  }
                  rows={2}
                  placeholder="Mô tả chi tiết tiêu chí này..."
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
                {errors[`criterion_${index}`] && (
                  <p className="text-sm text-red-600">
                    {errors[`criterion_${index}`]}
                  </p>
                )}
                {errors[`points_${index}`] && (
                  <p className="text-sm text-red-600">
                    {errors[`points_${index}`]}
                  </p>
                )}
              </div>
            ))}
            {errors.rubric && (
              <p className="text-sm text-red-600">{errors.rubric}</p>
            )}
            {errors.totalPoints && (
              <p className="text-sm text-red-600">{errors.totalPoints}</p>
            )}
            <Button
              variant="secondary"
              onClick={addCriterion}
              className="w-full"
            >
              + Thêm tiêu chí
            </Button>
          </div>
        </div>

        {formData.gradingType === "ai_assisted" && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">AI hỗ trợ chấm điểm</p>
                <p className="text-blue-700">
                  AI sẽ đưa ra gợi ý điểm dựa trên tiêu chí đã thiết lập. Giảng
                  viên vẫn cần xem xét và xác nhận cuối cùng.
                </p>
              </div>
            </div>
          </div>
        )}
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

export default LongAnswerForm;
