const testimonials = [
    {
        text: "GoPass giúp tôi luyện thi hiệu quả. Bảng xếp hạng tạo động lực học tập rất lớn!",
        name: "Nguyễn Minh Anh",
        role: "Học sinh lớp 12",
        rating: 5
    },
    {
        text: "Giao diện đẹp và dễ sử dụng. Chất lượng đề thi rất tốt.",
        name: "Trần Văn Hùng",
        role: "Giáo viên Toán",
        rating: 5
    },
    {
        text: "Tôi thích tính năng chấm thi Ngữ Văn bằng AI. Nhận xét rất chi tiết và hữu ích.",
        name: "Phạm Thị Hương",
        role: "Học sinh lớp 12",
        rating: 5
    }
];

export default function Testimonials() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Cảm nhận từ người dùng</h2>
                <p className="text-gray-600 mb-12 text-lg">Hàng nghìn học sinh và giáo viên tin tương GoPass</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                            <div className="flex gap-1 mb-4 justify-center">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-lg">⭐</span>
                                ))}
                            </div>
                            <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                                    <span className="text-teal-600 font-semibold text-lg">{testimonial.name.charAt(0)}</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}