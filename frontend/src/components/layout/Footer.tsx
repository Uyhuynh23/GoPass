import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-4 gap-8 mb-8">
                    <div>
                        <Link href="/" className="flex items-center gap-2 text-2xl font-bold mb-4">
                            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">G</span>
                            </div>
                            GoPass
                        </Link>
                        <p className="text-gray-400 leading-relaxed">
                            Nền tảng luyện thi THPT Quốc gia hàng đầu Việt Nam
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-white">Sản phẩm</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Đề thi thử</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Ôn tập</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Bảng xếp hạng</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-white">Công ty</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Liên hệ</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4 text-white">Pháp lý</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Điều khoản</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                    <p>© 2025 GoPass. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
}