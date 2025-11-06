export default function AIFeatures() {
    return (
        <section id="ai-features" className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Chấm thi Ngữ Văn bằng AI</h2>
                    <p className="text-gray-600 text-lg">Nhận phân tích chi tiết và nhận xét từ AI cho bài viết của bạn</p>
                </div>

                <div className="flex items-center gap-12">
                    <div className="w-1/2">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-gray-500 ml-auto">Bài làm của bạn</span>
                            </div>
                            <div className="space-y-3">
                                <p className="text-gray-800 font-medium">Câu hỏi: Phân tích hình ảnh "cây tre" trong bài thơ...</p>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-gray-700">Hình ảnh cây tre trong bài thơ thể hiện...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-1/2 space-y-4">
                        <h3 className="text-2xl font-semibold mb-6 text-gray-800">Phân tích bài viết tự động</h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">1</div>
                                <div>
                                    <p className="font-semibold text-gray-800 mb-1">Nhận xét chi tiết</p>
                                    <p className="text-gray-600">Phân tích nội dung, cấu trúc và ngôn ngữ của bài viết</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">2</div>
                                <div>
                                    <p className="font-semibold text-gray-800 mb-1">Chấm điểm theo từng tiêu chí đánh giá chuẩn bộ GD</p>
                                    <p className="text-gray-600">Điểm số cụ thể cho từng phần</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">3</div>
                                <div>
                                    <p className="font-semibold text-gray-800 mb-1">Đưa ra lời khuyên để nâng cao chất lượng bài viết</p>
                                    <p className="text-gray-600">Gợi ý cải thiện cụ thể</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">4</div>
                                <div>
                                    <p className="font-semibold text-gray-800 mb-1">Theo dõi quá trình phát triển kỹ năng viết qua thời gian</p>
                                    <p className="text-gray-600">Thống kê tiến bộ</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}