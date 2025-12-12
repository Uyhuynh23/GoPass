"use client";

import React, { useState, useEffect } from "react";
import {
  QuestionType,
  QuestionDraft,
  Passage,
} from "@/features/dashboard/types/question";
import QuestionTypeSelector from "./QuestionTypeSelector";
import PassageSelector from "./PassageSelector";
import QuestionFormContainer from "./QuestionFormContainer";
import QuestionTypeSummary from "./QuestionTypeSummary";
import Button from "@/components/ui/Button";

interface CreateQuestionModalProps {
  onClose: () => void;
  onSave: (question: any) => void;
}

const CreateQuestionModal: React.FC<CreateQuestionModalProps> = ({
  onClose,
  onSave,
}) => {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<QuestionType | null>(null);
  const [passageOption, setPassageOption] = useState<
    "none" | "existing" | "new"
  >("none");
  const [selectedPassageId, setSelectedPassageId] = useState<
    string | undefined
  >();
  const [newPassage, setNewPassage] = useState<Partial<Passage> | undefined>();
  const [formData, setFormData] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save draft
  useEffect(() => {
    const saveDraft = () => {
      const draft: QuestionDraft = {
        step,
        type: selectedType || undefined,
        passage: passageOption,
        passageId: selectedPassageId,
        newPassage,
        formData,
        timestamp: Date.now(),
      };
      localStorage.setItem("question_draft", JSON.stringify(draft));
    };

    const interval = setInterval(saveDraft, 10000); // Auto-save every 10s

    return () => {
      clearInterval(interval);
      if (hasUnsavedChanges) {
        saveDraft(); // Save on unmount if has changes
      }
    };
  }, [
    step,
    selectedType,
    passageOption,
    selectedPassageId,
    newPassage,
    formData,
    hasUnsavedChanges,
  ]);

  // Load draft on mount
  useEffect(() => {
    const draftStr = localStorage.getItem("question_draft");
    if (draftStr) {
      try {
        const draft: QuestionDraft = JSON.parse(draftStr);
        // Show restore prompt
        const shouldRestore = window.confirm(
          "Bạn có muốn khôi phục câu hỏi đã lưu nháp?"
        );
        if (shouldRestore) {
          setStep(draft.step);
          setSelectedType(draft.type || null);
          setPassageOption(draft.passage || "none");
          setSelectedPassageId(draft.passageId);
          setNewPassage(draft.newPassage);
          setFormData(draft.formData || null);
        } else {
          localStorage.removeItem("question_draft");
        }
      } catch (e) {
        console.error("Failed to restore draft:", e);
      }
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [hasUnsavedChanges]);

  const handleClose = () => {
    if (hasUnsavedChanges) {
      const shouldClose = window.confirm(
        "Bạn có thay đổi chưa lưu. Bạn có chắc muốn đóng?"
      );
      if (!shouldClose) return;
    }
    setStep(1);
    setSelectedType(null);
    setPassageOption("none");
    setSelectedPassageId(undefined);
    setNewPassage(undefined);
    setFormData(null);
    setHasUnsavedChanges(false);
    onClose();
  };

  const handleNextStep = () => {
    if (step === 1 && selectedType) {
      setStep(2);
      setHasUnsavedChanges(true);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSaveQuestion = (data: any) => {
    const question = {
      ...data,
      passageId: selectedPassageId,
      newPassage,
    };
    onSave(question);
    localStorage.removeItem("question_draft");
    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className="relative bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Stepper */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Tạo câu hỏi mới
                </h2>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Stepper */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step === 1
                        ? "bg-teal-500 text-white"
                        : "bg-teal-100 text-teal-600"
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step === 1 ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    Chọn loại câu hỏi
                  </span>
                </div>

                <div className="flex-1 h-0.5 bg-gray-200">
                  <div
                    className={`h-full transition-all ${
                      step === 2 ? "bg-teal-500" : "bg-gray-200"
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      step === 2
                        ? "bg-teal-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step === 2 ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    Nhập nội dung
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6">
                {step === 1 ? (
                  <div className="space-y-6">
                    <QuestionTypeSelector
                      selectedType={selectedType}
                      onSelectType={setSelectedType}
                    />
                    <PassageSelector
                      option={passageOption}
                      onOptionChange={setPassageOption}
                      selectedPassageId={selectedPassageId}
                      onPassageSelect={setSelectedPassageId}
                      newPassage={newPassage}
                      onNewPassageChange={setNewPassage}
                    />
                  </div>
                ) : (
                  <>
                    <QuestionTypeSummary
                      questionType={selectedType!}
                      passageOption={passageOption}
                      passageTitle={newPassage?.title}
                      onEdit={handlePrevStep}
                    />
                    <QuestionFormContainer
                      questionType={selectedType!}
                      initialData={formData}
                      passageId={selectedPassageId}
                      onSave={handleSaveQuestion}
                      onCancel={handlePrevStep}
                    />
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            {step === 1 && (
              <div className="flex-shrink-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <Button variant="secondary" onClick={handleClose}>
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onClick={handleNextStep}
                  disabled={!selectedType}
                >
                  Tiếp theo
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateQuestionModal;
