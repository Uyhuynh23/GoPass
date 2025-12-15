"use client";

import React from "react";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";

interface MathTextProps {
  content: string;
  className?: string;
}

const MathText: React.FC<MathTextProps> = ({ content, className = "" }) => {
  return (
    <div className={`math-text-container text-slate-800 ${className}`}>
      <Latex>{content}</Latex>
    </div>
  );
};

export default MathText;
