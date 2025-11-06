export default function TeacherTools() {
    return (
        <section id="teacher-tools" className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold mb-4">
                        DÀNH CHO GIÁO VIÊN
                    </span>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Tạo đề thi tự động thông minh</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Công cụ AI hỗ trợ giáo viên tạo đề thi nhanh chóng, chính xác và đa dạng
                    </p>
                </div>

                <div className="flex items-center gap-16">
                    {/* Left Content */}
                    <div className="w-1/2 space-y-8">
                        {/* Feature Cards */}
                        <div className="space-y-4">
                            <div className="group p-6 bg-white rounded-2xl border border-indigo-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                                        🎯
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Chọn chủ đề và mức độ</h3>
                                        <p className="text-gray-600">Tùy chỉnh nội dung theo chương trình học và trình độ học sinh</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group p-6 bg-white rounded-2xl border border-indigo-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                                        ⚡
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Tạo tự động trong 30 giây</h3>
                                        <p className="text-gray-600">AI tạo đề thi hoàn chỉnh với đáp án và thang điểm chi tiết</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group p-6 bg-white rounded-2xl border border-indigo-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                                        📊
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Theo dõi và phân tích</h3>
                                        <p className="text-gray-600">Dashboard chi tiết về kết quả học tập của từng học sinh</p>
                                    </div>
                                </div>
                            </div>

                            <div className="group p-6 bg-white rounded-2xl border border-indigo-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform duration-300">
                                        📈
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2">Báo cáo thông minh</h3>
                                        <p className="text-gray-600">Xuất báo cáo PDF với biểu đồ và insights chi tiết</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="pt-6">
                            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Dùng thử miễn phí →
                            </button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="w-1/2">
                        <div className="relative">
                            {/* Background decoration */}
                            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-3xl opacity-50"></div>

                            {/* Main image container */}
                            <div className="relative bg-white rounded-3xl shadow-2xl p-3 border border-white">
                                <img
                                    src="/images/teacher-teaching.png"
                                    alt="Teacher using AI tools"
                                    className="rounded-2xl w-full h-auto"
                                />

                                {/* Floating stats */}
                                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                            <span className="text-green-600 font-bold">✓</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-800">2,500+</div>
                                            <div className="text-xs text-gray-600">Đề thi đã tạo</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -top-6 -right-12 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <span className="text-blue-600 font-bold">⚡</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-800">30s</div>
                                            <div className="text-xs text-gray-600">Thời gian tạo</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Features Grid */}
                <div className="mt-20 grid grid-cols-3 gap-8">
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">🎓</span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">1,200+ Giáo viên</h3>
                        <p className="text-gray-600 text-sm">Đang sử dụng hàng ngày</p>
                    </div>

                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">📝</span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">50,000+ Đề thi</h3>
                        <p className="text-gray-600 text-sm">Đã được tạo thành công</p>
                    </div>

                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white text-2xl">⭐</span>
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">4.9/5 Đánh giá</h3>
                        <p className="text-gray-600 text-sm">Từ cộng đồng giáo viên</p>
                    </div>
                </div>
            </div>
        </section>
    );
}