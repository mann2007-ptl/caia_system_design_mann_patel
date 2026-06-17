import React from 'react';

const DataTable = ({ columns, data, isLoading, emptyState, pagination }) => {
    if (isLoading) {
        return (
            <div className="admin-table-wrapper" style={{ opacity: 0.7, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-mist)', background: 'var(--color-snow)', display: 'flex', gap: '1rem' }}>
                    {columns.map((_, i) => (
                        <div key={i} style={{ height: '16px', background: 'var(--color-mist)', borderRadius: '4px', flex: 1 }}></div>
                    ))}
                </div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ padding: '1rem', borderBottom: '1px solid var(--color-mist)', display: 'flex', gap: '1rem' }}>
                        {columns.map((_, j) => (
                            <div key={j} style={{ height: '16px', background: 'var(--color-mist)', borderRadius: '4px', flex: 1 }}></div>
                        ))}
                    </div>
                ))}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return emptyState || (
            <div className="admin-table-wrapper" style={{ padding: '3rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-slate)' }}>No data available.</p>
            </div>
        );
    }

    return (
        <div className="admin-table-wrapper">
            <div className="admin-table-scroll">
                <table className="admin-table">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index}>
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>
                                        {col.cell ? col.cell(row) : row[col.accessorKey]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {pagination && (
                <div className="admin-table-footer">
                    <span className="admin-table-footer-text">
                        Showing {pagination.start} to {pagination.end} of {pagination.total} results
                    </span>
                    <div className="admin-table-footer-btns">
                        <button
                            onClick={pagination.onPrev}
                            disabled={!pagination.hasPrev}
                            className="admin-table-page-btn"
                        >
                            Previous
                        </button>
                        <button
                            onClick={pagination.onNext}
                            disabled={!pagination.hasNext}
                            className="admin-table-page-btn"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;

