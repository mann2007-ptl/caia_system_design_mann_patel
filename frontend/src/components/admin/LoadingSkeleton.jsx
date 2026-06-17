import React from 'react';

const CHART_HEIGHTS = [45, 60, 30, 80, 50, 75, 40, 90, 65, 85, 55, 70];

const LoadingSkeleton = ({ type = 'table', rows = 5 }) => {
    if (type === 'card') {
        return (
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm animate-pulse">
                <div className="flex justify-between items-start mb-4">
                    <div className="space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                        <div className="h-8 bg-slate-200 rounded w-32"></div>
                    </div>
                    <div className="h-12 w-12 bg-slate-200 rounded-xl"></div>
                </div>
                <div className="h-4 bg-slate-200 rounded w-48"></div>
            </div>
        );
    }

    if (type === 'chart') {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-80 flex flex-col">
                <div className="h-6 w-1/3 bg-slate-200 rounded animate-pulse mb-8"></div>
                <div className="flex-1 flex items-end gap-2">
                    {CHART_HEIGHTS.map((h, i) => (
                        <div key={i} className="bg-slate-200 rounded-t-sm w-full animate-pulse" style={{ height: `${h}%` }}></div>
                    ))}
                </div>
            </div>
        );
    }

    // Default to table
    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex gap-4">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            </div>
            <div>
                {[...Array(rows)].map((_, i) => (
                    <div key={i} className="p-4 border-b border-slate-100 flex gap-4 items-center">
                        <div className="h-10 w-10 bg-slate-200 rounded-full shrink-0"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                        <div className="h-8 bg-slate-200 rounded w-20 shrink-0 ml-auto"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoadingSkeleton;
