import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Users } from 'lucide-react';
import { adminService } from '../../../service/adminService';
import type { User } from '../../../types';

const emptyForm = {
  _id: '',
  name: '',
  email: '',
  password: '',
  role: 'buyer' as 'buyer' | 'seller' | 'admin',
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        const payload: any = {
          name: form.name,
          email: form.email,
          role: form.role,
        };
        if (form.password) payload.password = form.password;
        await adminService.updateUser(form._id, payload);
      } else {
        await adminService.createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
      }

      resetForm();
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể lưu người dùng.');
    } finally {
      setSaving(false);
    }
  };

  const editUser = (user: User) => {
    setForm({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setIsEditing(true);
  };

  const toggleBlock = async (user: User) => {
    await adminService.toggleUserBlock(user._id, !user.isBlocked);
    loadUsers();
  };

  const deleteUser = async (id: string) => {
    if (!window.confirm('Xóa tài khoản này?')) return;
    await adminService.deleteUser(id);
    loadUsers();
  };

  if (loading) {
    return <div className="flex justify-center p-[60px]"><Loader2 className="animate-spin text-apple-blue" size={32} /></div>;
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="bg-white border border-[#e5e5ea] rounded-lg p-5 grid grid-cols-1 lg:grid-cols-[1fr_1fr_160px_1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm font-semibold text-[#1d1d1f]">Họ tên</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5" required />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[#1d1d1f]">Email</span>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5" required />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[#1d1d1f]">Vai trò</span>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })} className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 bg-white">
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[#1d1d1f]">Mật khẩu</span>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5" required={!isEditing} placeholder={isEditing ? 'Bỏ trống nếu không đổi' : ''} />
        </label>
        <div className="flex gap-2">
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#0071e3] text-white px-4 py-2.5 font-semibold disabled:opacity-60">
            <Plus size={16} />
            {isEditing ? 'Lưu' : 'Thêm'}
          </button>
          {isEditing && <button type="button" onClick={resetForm} className="rounded-lg bg-[#f5f5f7] px-4 py-2.5 font-semibold">Hủy</button>}
        </div>
      </form>

      {error && <div className="bg-white border border-[#ffd0d0] rounded-lg p-4 text-[#d70015]">{error}</div>}

      <div className="bg-white border border-[#e5e5ea] rounded-lg p-6 mb-6 overflow-x-auto">
        {users.length === 0 ? (
          <div className="text-center py-[60px] px-5 text-apple-gray">
            <Users size={48} className="mx-auto" />
            <h3 className="text-apple-dark mt-4 mb-2 text-lg font-semibold">Không có dữ liệu</h3>
          </div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">ID</th>
                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Họ tên</th>
                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Email</th>
                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Vai trò</th>
                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Trạng thái</th>
                <th className="p-4 text-[14px] font-semibold text-apple-gray border-b border-[#e5e5ea]">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="last:border-b-0 border-b border-[#e5e5ea]">
                  <td className="p-4 text-[15px] text-apple-dark">{user._id?.slice(-8).toUpperCase()}</td>
                  <td className="p-4 text-[15px] text-apple-dark font-medium">{user.name}</td>
                  <td className="p-4 text-[15px] text-apple-dark">{user.email}</td>
                  <td className="p-4 text-[15px] text-apple-dark capitalize">{user.role}</td>
                  <td className="p-4">
                    <span className={`inline-block py-1 px-2.5 rounded-xl text-[13px] font-semibold ${user.isBlocked ? 'bg-[#ffecec] text-[#d70015]' : 'bg-[#e6f4ea] text-[#1e8e3e]'}`}>
                      {user.isBlocked ? 'Đã khóa' : 'Hoạt động'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => editUser(user)} className="rounded-lg bg-[#f5f5f7] px-3 py-2 text-sm font-semibold">Sửa</button>
                      <button onClick={() => toggleBlock(user)} className="rounded-lg bg-[#fff4d6] px-3 py-2 text-sm font-semibold">{user.isBlocked ? 'Mở khóa' : 'Khóa'}</button>
                      <button onClick={() => deleteUser(user._id)} className="rounded-lg bg-[#ffecec] text-[#d70015] px-3 py-2 text-sm font-semibold">Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserList;
