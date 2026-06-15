import React, { useEffect, useState } from 'react';
import { userService } from '../../../service/userService';
import type { User } from '../../../types';
import { Loader2, Users } from 'lucide-react';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Không thể tải danh sách người dùng.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-[60px]">
        <Loader2 className="animate-spin text-apple-blue" size={32} />
      </div>
    );
  }

  if (error) {
    return <div className="text-[#ff3b30] p-5">{error}</div>;
  }

  return (
    <div className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 mb-6 overflow-x-auto">
      {users.length === 0 ? (
        <div className="text-center py-[60px] px-5 text-apple-gray">
          <Users size={48} className="mx-auto" />
          <h3 className="text-apple-dark mt-4 mb-2 text-lg font-semibold">Không có dữ liệu</h3>
        </div>
      ) : (
        <table className="w-full border-collapse text-left">
          <thead>
            <tr>
              <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">ID</th>
              <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Họ tên</th>
              <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Email</th>
              <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Vai trò</th>
              <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea] whitespace-nowrap">Ngày tham gia</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="last:border-b-0 border-b border-[#e5e5ea]">
                <td className="p-4 text-[15px] text-apple-dark align-middle">{user._id?.slice(-8).toUpperCase()}</td>
                <td className="p-4 text-[15px] text-apple-dark align-middle font-medium">{user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()}</td>
                <td className="p-4 text-[15px] text-apple-dark align-middle">{user.email}</td>
                <td className="p-4 text-[15px] text-apple-dark align-middle">
                  <span className={`inline-block py-1 px-2.5 rounded-xl text-[13px] font-semibold capitalize ${user.role === 'admin' ? 'bg-[#e8f0fe] text-apple-blue' : user.role === 'seller' ? 'bg-[#e6f4ea] text-[#1e8e3e]' : 'bg-[#f1f3f4] text-[#5f6368]'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-[15px] text-apple-dark align-middle">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;
