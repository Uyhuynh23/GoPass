"use client";

import React from "react";
import { QuestionType } from "@/features/dashboard/types/question";
import MultipleChoiceForm from "./forms/MultipleChoiceForm";
import TrueFalseForm from "./forms/TrueFalseForm";
import ShortAnswerForm from "./forms/ShortAnswerForm";
import LongAnswerForm from "./forms/LongAnswerForm";

interface QuestionFormContainerProps {
  questionType: QuestionType;
  initialData?: any;
  passageId?: string;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const QuestionFormContainer: React.FC<QuestionFormContainerProps> = ({
  questionType,
  initialData,
  passageId,
  onSave,
  onCancel,
}) => {
  const renderForm = () => {
    const commonProps = {
      initialData,
      passageId,
      onSave,
      onCancel,
    };

    switch (questionType) {
      case "multiple_choice":
        return <MultipleChoiceForm {...commonProps} />;
      case "true_false":
        return <TrueFalseForm {...commonProps} />;
      case "short_answer":
        return <ShortAnswerForm {...commonProps} />;
      case "long_answer":
        return <LongAnswerForm {...commonProps} />;
      default:
        return null;
    }
  };

  return <div>{renderForm()}</div>;
};

export default QuestionFormContainer;
