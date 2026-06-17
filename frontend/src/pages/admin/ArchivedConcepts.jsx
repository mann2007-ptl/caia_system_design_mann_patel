import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import PageHeader from '../../components/admin/PageHeader';
import DataTable from '../../components/admin/DataTable';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { FiRefreshCcw, FiTrash2, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ArchivedConcepts = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [restoreModalOpen, setRestoreModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedConcept, setSelectedConcept] = useState(null);

    // Mock data for archived concepts
    const [archived, setArchived] = useState(() => [
        { _id: '1', prompt: 'Explain SOAP vs REST', metadata: { concept: 'SOAP vs REST', category: 'Architecture' }, archivedAt: new Date().toISOString() },
        { _id: '2', prompt: 'What is XML?', metadata: { concept: 'XML Parsing', category: 'Backend' }, archivedAt: new Date(Date.now() - 86400000).toISOString() },
    ]);

    const confirmRestore = () => {
        if (selectedConcept) {
            setArchived(archived.filter(c => c._id !== selectedConcept._id));
            toast.success('Concept restored successfully');
            setRestoreModalOpen(false);
        }
    };

    const confirmDelete = () => {
        if (selectedConcept) {
            setArchived(archived.filter(c => c._id !== selectedConcept._id));
            toast.success('Concept permanently deleted');
            setDeleteModalOpen(false);
        }
    };

    const columns = [
        { 
            header: 'Concept', 
            accessorKey: 'concept',
            cell: (row) => (
                <div>
                    <div style={{ color: 'var(--color-midnight)', fontWeight: '600' }}>{row.metadata?.concept}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-graphite)', maxWidth: '16rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.prompt}</div>
                </div>
            )
        },
        { 
            header: 'Category', 
            accessorKey: 'category',
            cell: (row) => <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">{row.metadata?.category}</span>
        },
        { 
            header: 'Archived Date', 
            accessorKey: 'archivedAt',
            cell: (row) => new Date(row.archivedAt).toLocaleDateString()
        },
        { 
            header: 'Actions', 
            accessorKey: 'actions',
            cell: (row) => (
                <div className="admin-table-actions">
                    <button onClick={() => { setSelectedConcept(row); setRestoreModalOpen(true); }} className="table-action-btn" style={{ padding: '0.5rem 1rem', width: 'auto', borderRadius: '8px' }}>
                        <FiRefreshCcw size={14} /> Restore
                    </button>
                    <button onClick={() => { setSelectedConcept(row); setDeleteModalOpen(true); }} className="table-action-btn danger" title="Delete Permanently">
                        <FiTrash2 size={16} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="dash-page fade-in">
            <Helmet>
                <title>Archived Concepts — CAIA Admin</title>
            </Helmet>
            <PageHeader 
                title="Archived Concepts" 
                description="Manage concepts that have been hidden from public view."
                breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Archive' }]}
            />

            <div className="admin-toolbar">
                <div className="admin-search-wrapper" style={{ width: '100%', maxWidth: '400px' }}>
                    <FiSearch className="admin-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search archives..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="admin-search-input"
                    />
                </div>
            </div>

            <DataTable 
                columns={columns} 
                data={archived} 
                isLoading={false}
                pagination={{
                    start: 1,
                    end: archived.length,
                    total: archived.length,
                    hasNext: false,
                    hasPrev: false,
                    onNext: () => {},
                    onPrev: () => {}
                }}
            />

            <ConfirmModal 
                isOpen={restoreModalOpen} 
                onClose={() => setRestoreModalOpen(false)}
                onConfirm={confirmRestore}
                title="Restore Concept"
                message={`Are you sure you want to restore "${selectedConcept?.metadata?.concept}"? It will be visible to all users again.`}
                confirmText="Restore"
                confirmColor="bg-blue-600 hover:bg-blue-700"
            />

            <ConfirmModal 
                isOpen={deleteModalOpen} 
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Permanently"
                message={`Are you sure you want to permanently delete "${selectedConcept?.metadata?.concept}"? This action cannot be undone.`}
                confirmText="Delete Permanently"
            />
        </div>
    );
};

export default ArchivedConcepts;

