import React, { useEffect, useState } from 'react';
import { Loader2, Plus, Users } from 'lucide-react';
import { adminService } from '../../../service/adminService';
import type { User } from '../../../types';
import { useToast } from '../../../context/ToastContext';
import { ConfirmModal } from '../../../components/UI/ConfirmModal';

const emptyForm = {
  _id: '',
  name: '',
  email: '',
  password: '',
  role: 'buyer' as 'buyer' | 'seller' | 'admin',
};

const getErrorMessage = (error: any, fallback: string) => {
  return error?.response?.data?.message || error?.message || fallback;
};

const UserList: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);

  // States for ConfirmModal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Không thể tải danh sách người dùng.'));
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
        const updatedUser = await adminService.updateUser(form._id, payload);
        setUsers((current) => current.map((user) => user._id === updatedUser._id ? { ...user, ...updatedUser } : user));
        showToast('Đã cập nhật thông tin người dùng thành công!');
      } else {
        const createdUser = await adminService.createUser({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        setUsers((current) => [createdUser, ...current]);
        showToast('Đã thêm người dùng mới thành công!');
      }

      resetForm();
    } catch (err: any) {
      const message = getErrorMessage(err, 'Không thể lưu người dùng.');
      setError(message);
      showToast(message, 'error');
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
    const nextBlocked = !user.isBlocked;
    setActionId(`block-${user._id}`);
    try {
      await adminService.toggleUserBlock(user._id, nextBlocked);
      setUsers((current) => current.map((item) => item._id === user._id ? { ...item, isBlocked: nextBlocked } : item));
      showToast(nextBlocked ? 'Đã khóa tài khoản thành công!' : 'Đã mở khóa tài khoản thành công!');
    } catch (err: any) {
      showToast(getErrorMessage(err, 'Không thể cập nhật tài khoản.'), 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    const id = deleteTargetId;
    setActionId(`delete-${id}`);
    try {
      await adminService.deleteUser(id);
      setUsers((current) => current.filter((user) => user._id !== id));
      showToast('Đã xóa tài khoản thành công!');
    } catch (err: any) {
      showToast(getErrorMessage(err, 'Không thể xóa tài khoản.'), 'error');
    } finally {
      setActionId(null);
      setDeleteTargetId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-[60px]"><Loader2 className="animate-spin text-apple-blue" size={32} /></div>;
  }

  return (
    <div className="space-y-5">
      {/* Form adding/editing */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#e5e5ea] rounded-lg p-5 grid grid-cols-1 lg:grid-cols-[1fr_1fr_160px_1fr_auto] gap-3 items-end">
        <label className="block">
          <span className="text-sm font-semibold text-[#1d1d1f]">Họ tên</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 outline-none focus:border-apple-blue transition-all" required />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[#1d1d1f]">Email</span>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 outline-none focus:border-apple-blue transition-all" required />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[#1d1d1f]">Vai trò</span>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as any })} className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 bg-white outline-none focus:border-apple-blue transition-all">
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[#1d1d1f]">Mật khẩu</span>
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-2 w-full rounded-lg border border-[#d2d2d7] px-3 py-2.5 outline-none focus:border-apple-blue transition-all" required={!isEditing} placeholder={isEditing ? 'Bỏ trống nếu không đổi' : ''} />
        </label>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-[#0071e3] text-white px-4 py-2.5 font-semibold disabled:opacity-60 cursor-pointer transition-all hover:bg-[#0077ed] active:scale-95">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            {isEditing ? 'Lưu' : 'Thêm'}
          </button>
          {isEditing && <button type="button" onClick={resetForm} className="rounded-lg bg-[#f5f5f7] px-4 py-2.5 font-semibold cursor-pointer hover:bg-[#e5e5ea] active:scale-95 transition-all">Hủy</button>}
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
              {users.map((user) => {
                const blocking = actionId === `block-${user._id}`;
                const deleting = actionId === `delete-${user._id}`;

                return (
                  <tr key={user._id} className="last:border-b-0 border-b border-[#e5e5ea] hover:bg-[#f9f9fb] transition-colors">
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
                        <button type="button" onClick={() => editUser(user)} disabled={!!actionId} className="rounded-lg bg-[#f5f5f7] px-3 py-2 text-sm font-semibold disabled:opacity-60 hover:bg-[#e5e5ea] transition-all cursor-pointer">Sửa</button>
                        <button type="button" onClick={() => toggleBlock(user)} disabled={!!actionId} className="inline-flex items-center gap-1 rounded-lg bg-[#fff4d6] px-3 py-2 text-sm font-semibold disabled:opacity-60 hover:bg-[#ffe082] transition-all cursor-pointer">
                          {blocking && <Loader2 size={14} className="animate-spin" />}
                          {user.isBlocked ? 'Mở khóa' : 'Khóa'}
                        </button>
                        <button type="button" onClick={() => handleDeleteClick(user._id)} disabled={!!actionId} className="inline-flex items-center gap-1 rounded-lg bg-[#ffecec] text-[#d70015] px-3 py-2 text-sm font-semibold disabled:opacity-60 hover:bg-[#ffcdd2] transition-all cursor-pointer">
                          {deleting && <Loader2 size={14} className="animate-spin" />}
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Reusable ConfirmModal for deletion */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteTargetId(null);
        }}
        onConfirm={confirmDelete}
        title="Xóa tài khoản"
        message="Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể hoàn tác."
        confirmText="Xóa tài khoản"
        isDanger={true}
      />
    </div>
  );
};

export default UserList;
