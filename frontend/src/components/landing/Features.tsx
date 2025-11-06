const subjects = [
    { icon: "∑", name: "Toán", desc: "Hàng ngàn đề thi", color: "bg-gradient-to-br from-blue-500 to-blue-600", bgLight: "bg-blue-50" },
    { icon: "⚡", name: "Lý", desc: "Hàng ngàn đề thi", color: "bg-gradient-to-br from-purple-500 to-purple-600", bgLight: "bg-purple-50" },
    { icon: "🧪", name: "Hóa", desc: "Hàng ngàn đề thi", color: "bg-gradient-to-br from-green-500 to-green-600", bgLight: "bg-green-50" },
    { icon: "🧬", name: "Sinh", desc: "Hàng ngàn đề thi", color: "bg-gradient-to-br from-pink-500 to-pink-600", bgLight: "bg-pink-50" },
    { icon: "📚", name: "Văn", desc: "Hàng ngàn đề thi", color: "bg-gradient-to-br from-red-500 to-red-600", bgLight: "bg-red-50" },
    { icon: "🌐", name: "Anh", desc: "Hàng ngàn đề thi", color: "bg-gradient-to-br from-indigo-500 to-indigo-600", bgLight: "bg-indigo-50" },
    { icon: "📜", name: "Sử", desc: "Hàng ngàn đề thi", color: "bg-gradient-to-br from-amber-500 to-yellow-600", bgLight: "bg-amber-50" },
    { icon: "🌍", name: "Địa", desc: "Hàng ngàn đề thi", color: "bg-gradient-to-br from-teal-500 to-teal-600", bgLight: "bg-teal-50" }
];

export default function Features() {
    return (
        <section id="features" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-6 text-center">
                <div className="mb-12">
                    <span className="inline-block px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-semibold mb-4">
                        8 MÔN THI CHÍNH THỨC
                    </span>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Tất cả các môn thi THPT</h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Luyện tập đầy đủ 8 môn thi với hàng ngàn đề thi chuẩn bộ giáo dục
                    </p>
                </div>

                <div className="grid grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {subjects.map((subject, index) => (
                        <div
                            key={index}
                            className={`group relative overflow-hidden rounded-2xl ${subject.bgLight} border border-white shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300`}
                        >
                            {/* Icon Circle */}
                            <div className="relative p-6">
                                <div className={`w-16 h-16 ${subject.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="text-2xl text-white">{subject.icon}</span>
                                </div>

                                <h3 className="text-xl font-bold mb-2 text-gray-800">{subject.name}</h3>
                                <p className="text-gray-600 text-sm">{subject.desc}</p>
                            </div>

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <button className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    Bắt đầu luyện tập →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom stats */}
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-teal-600 mb-2">16,000+</div>
                        <div className="text-gray-600">Đề thi tổng cộng</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-teal-600 mb-2">8</div>
                        <div className="text-gray-600">Môn học đầy đủ</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-teal-600 mb-2">100%</div>
                        <div className="text-gray-600">Chuẩn Bộ GD&ĐT</div>
                    </div>
                </div>
            </div>
        </section>
    );
}