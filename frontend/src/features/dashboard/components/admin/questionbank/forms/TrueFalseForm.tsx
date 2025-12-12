"use client";

import React, { useState } from "react";
import {
  TrueFalseQuestion,
  TrueFalseStatement,
} from "@/features/dashboard/types/question";
import CommonFields from "../CommonFields";
import Button from "@/components/ui/Button";

interface TrueFalseFormProps {
  initialData?: Partial<TrueFalseQuestion>;
  passageId?: string;
  onSave: (data: TrueFalseQuestion) => void;
  onCancel: () => void;
}

const TrueFalseForm: React.FC<TrueFalseFormProps> = ({
  initialData,
  passageId,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Partial<TrueFalseQuestion>>({
    type: "true_false",
    title: initialData?.title || "",
    tags: initialData?.tags || [],
    difficulty: initialData?.difficulty || "medium",
    points: initialData?.points || 1,
    timeLimit: initialData?.timeLimit,
    language: initialData?.language || "vi",
    statements: initialData?.statements || [
      { id: "1", text: "", isTrue: true },
    ],
  });

  const [bulkPasteMode, setBulkPasteMode] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addStatement = () => {
    const newStatements = [
      ...(formData.statements || []),
      { id: Date.now().toString(), text: "", isTrue: true },
    ];
    setFormData({ ...formData, statements: newStatements });
  };

  const removeStatement = (id: string) => {
    if (!formData.statements || formData.statements.length <= 1) return;
    const newStatements = formData.statements.filter((s) => s.id !== id);
    setFormData({ ...formData, statements: newStatements });
  };

  const updateStatement = (
    id: string,
    field: keyof TrueFalseStatement,
    value: any
  ) => {
    const newStatements = formData.statements?.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    setFormData({ ...formData, statements: newStatements });
  };

  const handleBulkPaste = () => {
    const lines = bulkText.split("\n").filter((line) => line.trim());
    const newStatements: TrueFalseStatement[] = lines.map((line, idx) => ({
      id: `${Date.now()}_${idx}`,
      text: line.trim(),
      isTrue: true,
    }));

    setFormData({ ...formData, statements: newStatements });
    setBulkPasteMode(false);
    setBulkText("");
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.statements || formData.statements.length === 0) {
      newErrors.statements = "Phải có ít nhất một câu phát biểu";
    } else {
      formData.statements.forEach((stmt, idx) => {
        if (!stmt.text.trim()) {
          newErrors[`statement_${idx}`] = "Câu phát biểu không được để trống";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      ...formData,
      passageId,
    } as TrueFalseQuestion);
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
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Câu phát biểu <span className="text-red-500">*</span>
          </label>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setBulkPasteMode(!bulkPasteMode)}
          >
            {bulkPasteMode ? "Hủy nhập nhanh" : "Nhập nhanh"}
          </Button>
        </div>

        {bulkPasteMode ? (
          <div className="space-y-3">
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={8}
              placeholder="Nhập mỗi câu phát biểu trên một dòng..."
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
            <Button variant="primary" onClick={handleBulkPaste}>
              Áp dụng
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {formData.statements?.map((statement, index) => (
              <div
                key={statement.id}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
              >
                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded border border-gray-300 font-semibold text-gray-700">
                  {index + 1}
                </span>
                <div className="flex-1 space-y-2">
                  <textarea
                    value={statement.text}
                    onChange={(e) =>
                      updateStatement(statement.id, "text", e.target.value)
                    }
                    rows={2}
                    placeholder="Nhập câu phát biểu..."
                    className={`block w-full rounded-lg border ${
                      errors[`statement_${index}`]
                        ? "border-red-500"
                        : "border-gray-300"
                    } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none`}
                  />
                  {errors[`statement_${index}`] && (
                    <p className="text-sm text-red-600">
                      {errors[`statement_${index}`]}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateStatement(statement.id, "isTrue", true)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        statement.isTrue
                          ? "bg-green-500 text-white shadow-md"
                          : "bg-white text-gray-600 border border-gray-300 hover:border-green-300"
                      }`}
                    >
                      ✓ Đúng
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatement(statement.id, "isTrue", false)}
                      className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                        !statement.isTrue
                          ? "bg-red-500 text-white shadow-md"
                          : "bg-white text-gray-600 border border-gray-300 hover:border-red-300"
                      }`}
                    >
                      ✕ Sai
                    </button>
                  </div>
                </div>
                {formData.statements && formData.statements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStatement(statement.id)}
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
            ))}
            {errors.statements && (
              <p className="text-sm text-red-600">{errors.statements}</p>
            )}
            <Button
              variant="secondary"
              onClick={addStatement}
              className="w-full"
            >
              + Thêm câu phát biểu
            </Button>
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

export default TrueFalseForm;
