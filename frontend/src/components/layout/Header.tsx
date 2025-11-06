'use client';
import Link from 'next/link';

export default function Header() {
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <header className="bg-teal-600 shadow-sm">
            <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white hover:text-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-teal-600 font-bold text-lg">G</span>
                    </div>
                    GoPass
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    <button
                        onClick={() => scrollToSection('features')}
                        className="text-white hover:text-gray-100 font-medium transition-colors cursor-pointer"
                    >
                        Các môn thi
                    </button>
                    <button
                        onClick={() => scrollToSection('main-features')}
                        className="text-white hover:text-gray-100 font-medium transition-colors cursor-pointer"
                    >
                        Tính năng
                    </button>
                    <button
                        onClick={() => scrollToSection('leaderboard')}
                        className="text-white hover:text-gray-100 font-medium transition-colors cursor-pointer"
                    >
                        Bảng xếp hạng
                    </button>
                    <button
                        onClick={() => scrollToSection('ai-features')}
                        className="text-white hover:text-gray-100 font-medium transition-colors cursor-pointer"
                    >
                        AI Chấm thi
                    </button>
                </div>

                <div className="flex items-center space-x-4">
                    <Link
                        href="/login"
                        className="text-white hover:text-gray-100 font-medium transition-colors"
                    >
                        Đăng nhập
                    </Link>
                    <Link
                        href="/register"
                        className="bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-sm"
                    >
                        Đăng ký
                    </Link>
                </div>
            </nav>
        </header>
    );
}