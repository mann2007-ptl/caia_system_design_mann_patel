import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getAllConcepts, deleteConcept, archiveConcept } from '../../features/admin/adminSlice';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { FiPlus, FiEdit2, FiTrash2, FiArchive, FiEye, FiSearch, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ConceptManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { concepts, loading } = useSelector(state => state.admin);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [archiveModalOpen, setArchiveModalOpen] = useState(false);
    const [selectedConcept, setSelectedConcept] = useState(null);

    useEffect(() => {
        dispatch(getAllConcepts({ page, limit: 10, search }));
    }, [dispatch, page, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const confirmDelete = () => {
        if (selectedConcept) {
            dispatch(deleteConcept(selectedConcept._id)).then((res) => {
                if (!res.error) toast.success('Concept deleted successfully');
                setDeleteModalOpen(false);
            });
        }
    };

    const confirmArchive = () => {
        if (selectedConcept) {
            dispatch(archiveConcept(selectedConcept._id)).then((res) => {
                if (!res.error) toast.success('Concept archived successfully');
                setArchiveModalOpen(false);
            });
        }
    };

    const columns = [
        { 
            header: 'Concept', 
            accessorKey: 'concept',
            cell: (row) => (
                <div className="user-name-cell">
                    <div className="user-avatar-mini" style={{ background: 'var(--color-sky)', color: 'var(--color-blue)', borderRadius: '8px' }}>
                        {row.metadata?.concept?.charAt(0) || 'C'}
                    </div>
                    <div>
                        <div style={{ color: 'var(--color-midnight)' }}>{row.metadata?.concept || 'Unknown Concept'}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-graphite)', fontWeight: '400', maxWidth: '12rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.prompt}</div>
                    </div>
                </div>
            )
        },
        { 
            header: 'Category', 
            accessorKey: 'category',
            cell: (row) => (
                <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
                    {row.metadata?.category || 'General'}
                </span>
            )
        },
        { 
            header: 'Difficulty', 
            accessorKey: 'difficulty',
            cell: (row) => {
                const diff = row.metadata?.difficulty || 'Medium';
                const colors = {
                    Easy: 'bg-emerald-50 text-emerald-600',
                    Medium: 'bg-amber-50 text-amber-600',
                    Hard: 'bg-red-50 text-red-600'
                };
                return <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${colors[diff] || colors.Medium}`}>{diff}</span>;
            }
        },
        { header: 'Views', accessorKey: 'views', cell: (row) => row.views || 0 },
        { header: 'Votes', accessorKey: 'votes', cell: (row) => row.votes || 0 },
        { 
            header: 'Actions', 
            accessorKey: 'actions',
            cell: (row) => (
                <div className="admin-table-actions">
                    <button onClick={() => navigate(`/concepts/${row._id}`)} className="table-action-btn" title="View">
                        <FiEye />
                    </button>
                    <button onClick={() => navigate(`/admin/concepts/${row._id}/edit`)} className="table-action-btn" title="Edit">
                        <FiEdit2 />
                    </button>
                    <button onClick={() => { setSelectedConcept(row); setArchiveModalOpen(true); }} className="table-action-btn" title="Archive">
                        <FiArchive />
                    </button>
                    <button onClick={() => { setSelectedConcept(row); setDeleteModalOpen(true); }} className="table-action-btn danger" title="Delete">
                        <FiTrash2 />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="dash-page fade-in">
            <Helmet>
                <title>Concept Management — CAIA Admin</title>
            </Helmet>
            <PageHeader 
                title="Concept Management" 
                description="Manage all AI, System Design, and Backend Engineering concepts."
                breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Concepts' }]}
                actionButton={
                    <Link to="/admin/concepts/create" className="admin-action-primary">
                        <FiPlus /> Add Concept
                    </Link>
                }
            />

            <div className="admin-toolbar">
                <div className="admin-search-wrapper">
                    <FiSearch className="admin-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search concepts by prompt or name..." 
                        value={search}
                        onChange={handleSearch}
                        className="admin-search-input"
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="admin-action-secondary">
                        <FiFilter /> Filter
                    </button>
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={concepts.data} 
                isLoading={loading}
                pagination={{
                    start: (page - 1) * 10 + 1,
                    end: Math.min(page * 10, concepts.pagination?.total || 0),
                    total: concepts.pagination?.total || 0,
                    hasNext: page < (concepts.pagination?.pages || 1),
                    hasPrev: page > 1,
                    onNext: () => setPage(p => p + 1),
                    onPrev: () => setPage(p => p - 1)
                }}
            />

            <ConfirmModal 
                isOpen={deleteModalOpen} 
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Concept"
                message={`Are you sure you want to permanently delete "${selectedConcept?.metadata?.concept}"? This action cannot be undone.`}
                confirmText="Delete"
            />

            <ConfirmModal 
                isOpen={archiveModalOpen} 
                onClose={() => setArchiveModalOpen(false)}
                onConfirm={confirmArchive}
                title="Archive Concept"
                message={`Are you sure you want to archive "${selectedConcept?.metadata?.concept}"? It will be hidden from public view.`}
                confirmText="Archive"
                confirmColor="bg-amber-600 hover:bg-amber-700"
            />
        </div>
    );
};

export default ConceptManagement;

