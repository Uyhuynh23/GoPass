"use client";

import React from "react";
import Input from "@/components/ui/Input";

interface Passage {
  title: string;
  content: string;
}

interface PassageSelectorProps {
  option: "none" | "existing" | "new";
  onOptionChange: (option: "none" | "existing" | "new") => void;
  selectedPassageId?: string;
  onPassageSelect: (id: string) => void;
  newPassage?: Partial<Passage>;
  onNewPassageChange: (passage: Partial<Passage>) => void;
}

// TODO: Fetch from API
const passages: Array<{ id: string; title: string }> = [];

const PassageSelector: React.FC<PassageSelectorProps> = ({
  option,
  onOptionChange,
  selectedPassageId,
  onPassageSelect,
  newPassage,
  onNewPassageChange,
}) => {
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Ngữ liệu (Passage)
      </h3>

      <div className="space-y-4">
        {/* Option 1: No passage */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="passage"
            checked={option === "none"}
            onChange={() => onOptionChange("none")}
            className="mt-1"
          />
          <div>
            <div className="font-medium text-gray-900">Không dùng ngữ liệu</div>
            <div className="text-sm text-gray-500">Câu hỏi độc lập</div>
          </div>
        </label>

        {/* Option 2: Existing passage */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="passage"
            checked={option === "existing"}
            onChange={() => onOptionChange("existing")}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 mb-2">
              Chọn passage hiện có
            </div>
            {option === "existing" && (
              <select
                value={selectedPassageId || ""}
                onChange={(e) => onPassageSelect(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">-- Chọn passage --</option>
                {passages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </label>

        {/* Option 3: New passage */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="radio"
            name="passage"
            checked={option === "new"}
            onChange={() => onOptionChange("new")}
            className="mt-1"
          />
          <div className="flex-1">
            <div className="font-medium text-gray-900 mb-2">
              Tạo passage mới
            </div>
            {option === "new" && (
              <div className="space-y-3 mt-3">
                <Input
                  label="Tiêu đề"
                  value={newPassage?.title || ""}
                  onChange={(e) =>
                    onNewPassageChange({ ...newPassage, title: e.target.value })
                  }
                  placeholder="VD: Đoạn văn về lịch sử Việt Nam"
                  fullWidth
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung
                  </label>
                  <textarea
                    value={newPassage?.content || ""}
                    onChange={(e) =>
                      onNewPassageChange({
                        ...newPassage,
                        content: e.target.value,
                      })
                    }
                    rows={6}
                    placeholder="Nhập nội dung đoạn văn..."
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default PassageSelector;
