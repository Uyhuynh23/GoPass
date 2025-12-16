"use client";

import React from "react";

interface ClassMembersViewProps {
  classDetail: any;
  onUpdate: () => void;
}

const ClassMembersView: React.FC<ClassMembersViewProps> = ({ classDetail, onUpdate }) => {
  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quản lý thành viên</h3>
            <p className="text-sm text-gray-600">Duyệt yêu cầu tham gia và quản lý học sinh trong lớp</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              {classDetail.stats.totalMembers} thành viên
            </span>
            {classDetail.stats.pendingRequests > 0 && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                {classDetail.stats.pendingRequests} yêu cầu chờ duyệt
              </span>
            )}
          </div>
        </div>

        {/* Join Requests */}
        {classDetail.joinRequests.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 mb-3">Yêu cầu tham gia lớp</h4>
            <div className="space-y-3">
              {classDetail.joinRequests.map((request: any) => (
                <div key={request.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-sm">
                        {request.student.full_name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{request.student.full_name}</h5>
                      <p className="text-sm text-gray-600">{request.student.email}</p>
                      <p className="text-xs text-gray-500">
                        Yêu cầu lúc: {new Date(request.requested_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => console.log('Approve request:', request.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => console.log('Reject request:', request.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current Members */}
        <div>
          <h4 className="font-medium text-gray-900 mb-4">Thành viên lớp học</h4>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
            {classDetail.members.map((member: any) => (
              <div key={member.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-600 font-medium text-sm">
                      {member.student.full_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{member.student.full_name}</h5>
                    <p className="text-sm text-gray-600">{member.student.email}</p>
                    <p className="text-xs text-gray-500">
                      Tham gia: {new Date(member.joined_date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.status === 'approved' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {member.status === 'approved' ? 'Đã duyệt' : 'Chờ duyệt'}
                  </span>
                  <button
                    onClick={() => console.log('Remove member:', member.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassMembersView;