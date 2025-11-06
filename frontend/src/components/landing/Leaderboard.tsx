const leaderboardData = [
    { rank: 1, name: "Nguyễn Minh Anh", score: 245, change: "+2" },
    { rank: 2, name: "Trần Văn Hùng", score: 278, change: "+1" },
    { rank: 3, name: "Phạm Thị Hương", score: 265, change: "+3" },
    { rank: 4, name: "Lê Hoàng Minh", score: 258, change: "-1" },
    { rank: 5, name: "Đỗ Thị Linh", score: 245, change: "+1" }
];

export default function Leaderboard() {
    return (
        <section id="leaderboard" className="py-20 bg-gradient-to-br from-blue-50 to-teal-50">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">Bảng xếp hạng hàng tuần</h2>
                <p className="text-gray-600 mb-12 text-lg">Cạnh tranh lành mạnh và theo dõi tiến độ của bạn</p>

                <div className="max-w-4xl mx-auto">
                    <div className="flex gap-2 mb-6 justify-center">
                        <button className="px-6 py-3 bg-gray-800 text-white rounded-lg font-medium">Khối A</button>
                        <button className="px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium">Khối B</button>
                        <button className="px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium">Khối C</button>
                        <button className="px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium">Khối D</button>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 font-semibold text-gray-800">
                            <div>Xếp hạng</div>
                            <div>Học sinh</div>
                            <div>Điểm</div>
                            <div>Môn học</div>
                            <div>Thay đổi</div>
                        </div>

                        {leaderboardData.map((student, index) => (
                            <div key={index} className="grid grid-cols-5 gap-4 p-4 border-t border-gray-200 items-center hover:bg-gray-50 transition-colors">
                                <div className="font-semibold text-gray-800">{student.rank}</div>
                                <div className="text-gray-800">{student.name}</div>
                                <div className="font-semibold text-blue-600">{student.score}</div>
                                <div className="text-gray-600">Toán, Lý, Hóa</div>
                                <div className={`font-semibold ${student.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                                    {student.change}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}