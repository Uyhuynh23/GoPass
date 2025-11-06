import Link from 'next/link';

export default function CTA() {
    return (
        <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600 text-white text-center">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold mb-4">Sẵn sàng bắt đầu?</h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                    Tham gia hàng ngàn học sinh đang luyện thi thành công với GoPass. Miễn phí 100% cho 120+ đề thi đầu tiên.
                </p>
                <Link
                    href="/register"
                    className="inline-block bg-white text-teal-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
                >
                    Đăng ký ngay →
                </Link>
            </div>
        </section>
    );
}