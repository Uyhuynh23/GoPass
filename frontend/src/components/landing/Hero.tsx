import Link from 'next/link';

export default function Hero() {
    return (
        <section className="bg-gradient-to-br from-blue-50 to-teal-50 py-20">
            <div className="container mx-auto px-6 flex items-center">
                <div className="w-1/2 pr-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
                        Luyện thi THPT<br />Quốc gia
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Lựa chọn hàng đầu trong việc ôn tập và chuẩn bị cho Kỳ thi
                        THPTQG của bạn.
                    </p>

                    {/* Button */}
                    <div className="mb-12">
                        <Link
                            href="/login"
                            className="inline-block bg-teal-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg text-lg"
                        >
                            Bắt đầu miễn phí →
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <p className="text-sm text-gray-500 mb-4 font-medium">Được tin tưởng bởi</p>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-teal-600 mb-1">50K+</div>
                                <div className="text-sm text-gray-600">Học sinh</div>
                            </div>
                            <div className="text-center border-l border-gray-200">
                                <div className="text-2xl font-bold text-teal-600 mb-1">10K+</div>
                                <div className="text-sm text-gray-600">Đề thi</div>
                            </div>
                            <div className="text-center border-l border-gray-200">
                                <div className="text-2xl font-bold text-teal-600 mb-1">95%</div>
                                <div className="text-sm text-gray-600">Hài lòng</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-1/2">
                    <div className="bg-white rounded-2xl shadow-xl p-2">
                        <img
                            src="/images/student-learning.png"
                            alt="Student studying"
                            className="rounded-xl w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}