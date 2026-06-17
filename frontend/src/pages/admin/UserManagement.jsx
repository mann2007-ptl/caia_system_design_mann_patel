import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getAllUsers, changeUserRole, deleteUser } from '../../features/admin/adminSlice';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { FiEye, FiSearch, FiFilter, FiShield, FiUserX, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, loading } = useSelector(state => state.admin);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        dispatch(getAllUsers({ page, limit: 10, search }));
    }, [dispatch, page, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleRoleChange = (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        dispatch(changeUserRole({ id, role: newRole })).then((res) => {
            if (!res.error) toast.success(`User role changed to ${newRole}`);
            else toast.error('Failed to change role');
        });
    };

    const confirmDelete = () => {
        if (selectedUser) {
            dispatch(deleteUser(selectedUser._id)).then((res) => {
                if (!res.error) toast.success('User deleted successfully');
                setDeleteModalOpen(false);
            });
        }
    };

    const columns = [
        { 
            header: 'User', 
            accessorKey: 'user',
            cell: (row) => (
                <div className="user-name-cell">
                    <div className="user-avatar-mini">
                        {row.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <div style={{ color: 'var(--color-midnight)' }}>{row.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-graphite)', fontWeight: '400' }}>{row.email}</div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Role', 
            accessorKey: 'role',
            cell: (row) => (
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${row.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-slate-100 text-slate-600'}`}>
                    {row.role === 'admin' ? 'Admin' : 'User'}
                </span>
            )
        },
        { 
            header: 'Status', 
            accessorKey: 'status',
            cell: (row) => (
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${row.isBanned ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {row.isBanned ? 'Deactivated' : 'Active'}
                </span>
            )
        },
        { 
            header: 'Joined Date', 
            accessorKey: 'createdAt',
            cell: (row) => new Date(row.createdAt).toLocaleDateString()
        },
        { 
            header: 'Actions', 
            accessorKey: 'actions',
            cell: (row) => (
                <div className="admin-table-actions">
                    <button onClick={() => navigate(`/admin/users/${row._id}`)} className="table-action-btn" title="View Profile">
                        <FiEye />
                    </button>
                    <button onClick={() => handleRoleChange(row._id, row.role)} className="table-action-btn" title={`Change to ${row.role === 'admin' ? 'User' : 'Admin'}`}>
                        <FiShield />
                    </button>
                    <button onClick={() => { setSelectedUser(row); setDeleteModalOpen(true); }} className="table-action-btn danger" title="Delete">
                        <FiTrash2 />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="dash-page fade-in">
            <Helmet>
                <title>User Management — CAIA Admin</title>
            </Helmet>
            <PageHeader 
                title="User Management" 
                description="Manage users, roles, and account statuses."
                breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Users' }]}
            />

            <div className="admin-toolbar">
                <div className="admin-search-wrapper">
                    <FiSearch className="admin-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search users by name or email..." 
                        value={search}
                        onChange={handleSearch}
                        className="admin-search-input"
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select className="admin-filter-select">
                        <option value="">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={users.data} 
                isLoading={loading}
                pagination={{
                    start: (page - 1) * 10 + 1,
                    end: Math.min(page * 10, users.pagination?.total || 0),
                    total: users.pagination?.total || 0,
                    hasNext: page < (users.pagination?.pages || 1),
                    hasPrev: page > 1,
                    onNext: () => setPage(p => p + 1),
                    onPrev: () => setPage(p => p - 1)
                }}
            />

            <ConfirmModal 
                isOpen={deleteModalOpen} 
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to permanently delete "${selectedUser?.name}"? All their data will be removed.`}
                confirmText="Delete"
            />
        </div>
    );
};

export default UserManagement;

