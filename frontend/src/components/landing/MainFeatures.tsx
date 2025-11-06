const features = [
    {
        title: "Contest Hàng Tuần",
        desc: "Admin tổ chức contest cạnh tranh với nhiều thưởng hấp dẫn",
        color: "bg-gradient-to-br from-rose-100 to-pink-100",
        icon: "🏆",
        textColor: "text-gray-800"
    },
    {
        title: "Bảng Xếp Hạng",
        desc: "Xếp hạng theo khối và theo số điểm từ trước tới nay",
        color: "bg-gradient-to-br from-amber-100 to-orange-100",
        icon: "📊",
        textColor: "text-gray-800"
    },
    {
        title: "Phân Tích Chi Tiết",
        desc: "Nhận phân tích chi tiết và gợi ý cải thiện từ AI",
        color: "bg-gradient-to-br from-violet-100 to-purple-100",
        icon: "📈",
        textColor: "text-gray-800"
    },
    {
        title: "Theo Dõi Tiến Độ",
        desc: "Xem lịch sử hoạt động của bản thân qua từng ngày của tuần",
        color: "bg-gradient-to-br from-emerald-100 to-teal-100",
        icon: "📅",
        textColor: "text-gray-800"
    }
];

export default function MainFeatures() {
    return (
        <section id="main-features" className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Tính năng chính</h2>
                <p className="text-gray-600 mb-12 text-lg">Mọi thứ bạn cần để luyện thi hiệu quả</p>

                <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group p-8 rounded-2xl ${feature.color} border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
                        >
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className={`text-xl font-bold mb-3 ${feature.textColor}`}>
                                {feature.title}
                            </h3>
                            <p className={`${feature.textColor} opacity-80 leading-relaxed`}>
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12">
                    <p className="text-gray-600 mb-6">Sẵn sàng trải nghiệm những tính năng tuyệt vời này?</p>
                    <button className="bg-teal-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-sm hover:shadow-md">
                        Khám phá ngay →
                    </button>
                </div>
            </div>
        </section>
    );
}