import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { HiOutlineMagnifyingGlass, HiOutlineFunnel, HiOutlineSquares2X2 } from 'react-icons/hi2';
import ConceptCard from '../../components/dashboard/ConceptCard';
import { Pagination, SkeletonCard, EmptyState } from '../../components/dashboard/DashboardComponents';
import { fetchConcepts, fetchTaxonomy, fetchBookmarks, setPage } from '../../features/concepts/conceptSlice';

const ConceptExplorer = () => {
    const dispatch = useDispatch();
    const { items, loading, pagination, taxonomy, bookmarks } = useSelector((state) => state.concepts);

    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ category: '', difficulty: '', language: '', questionType: '' });
    const [sort, setSort] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    // Debounced search
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        dispatch(fetchTaxonomy());
        dispatch(fetchBookmarks());
    }, [dispatch]);

    useEffect(() => {
        const params = { page: pagination.page, limit: pagination.limit };
        if (debouncedSearch) params.search = debouncedSearch;
        if (filters.category) params.category = filters.category;
        if (filters.difficulty) params.difficulty = filters.difficulty;
        if (filters.language) params.language = filters.language;
        if (filters.questionType) params.questionType = filters.questionType;
        if (sort) params.sort = sort;
        dispatch(fetchConcepts(params));
    }, [dispatch, pagination.page, debouncedSearch, filters, sort]);

    const bookmarkIds = bookmarks.map(b => b.conceptId || b._id);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        dispatch(setPage(1));
    };

    const clearFilters = () => {
        setFilters({ category: '', difficulty: '', language: '', questionType: '' });
        setSearch('');
        setSort('');
        dispatch(setPage(1));
    };

    const hasActiveFilters = Object.values(filters).some(v => v) || search || sort;

    return (
        <>
            <Helmet>
                <title>Concept Explorer — CAIA Platform</title>
                <meta name="description" content="Explore system design concepts with advanced filtering, search, and sorting." />
            </Helmet>

            <div className="explorer-page">
                <div className="explorer-header">
                    <div>
                        <h1 className="explorer-title">Concept Explorer</h1>
                        <p className="explorer-subtitle">Discover and learn system design concepts</p>
                    </div>
                </div>

                {/* Search + Filter Toggle */}
                <div className="explorer-toolbar">
                    <div className="explorer-search">
                        <HiOutlineMagnifyingGlass className="explorer-search-icon" />
                        <input
                            type="text"
                            placeholder="Search concepts..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); dispatch(setPage(1)); }}
                            className="explorer-search-input"
                        />
                    </div>
                    <button className={`filter-toggle-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                        <HiOutlineFunnel /> Filters
                    </button>
                    <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="">Sort by</option>
                        <option value="-createdAt">Newest</option>
                        <option value="createdAt">Oldest</option>
                        <option value="title">Title A-Z</option>
                        <option value="views">Most Viewed</option>
                        <option value="difficulty">Difficulty</option>
                    </select>
                </div>

                {/* Filter Bar */}
                {showFilters && (
                    <div className="filter-bar">
                        <select className="filter-select" value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}>
                            <option value="">All Categories</option>
                            {(Array.isArray(taxonomy.categories) ? taxonomy.categories : []).map((c, i) => (
                                <option key={i} value={typeof c === 'string' ? c : c.name || c._id}>{typeof c === 'string' ? c : c.name || c._id}</option>
                            ))}
                        </select>
                        <select className="filter-select" value={filters.difficulty} onChange={(e) => handleFilterChange('difficulty', e.target.value)}>
                            <option value="">All Difficulties</option>
                            {(Array.isArray(taxonomy.difficulties) ? taxonomy.difficulties : []).map((d, i) => (
                                <option key={i} value={typeof d === 'string' ? d : d.name || d._id}>{typeof d === 'string' ? d : d.name || d._id}</option>
                            ))}
                        </select>
                        <select className="filter-select" value={filters.language} onChange={(e) => handleFilterChange('language', e.target.value)}>
                            <option value="">All Languages</option>
                            {(Array.isArray(taxonomy.languages) ? taxonomy.languages : []).map((l, i) => (
                                <option key={i} value={typeof l === 'string' ? l : l.name || l._id}>{typeof l === 'string' ? l : l.name || l._id}</option>
                            ))}
                        </select>
                        <select className="filter-select" value={filters.questionType} onChange={(e) => handleFilterChange('questionType', e.target.value)}>
                            <option value="">All Question Types</option>
                            {(Array.isArray(taxonomy.questionTypes) ? taxonomy.questionTypes : []).map((q, i) => (
                                <option key={i} value={typeof q === 'string' ? q : q.name || q._id}>{typeof q === 'string' ? q : q.name || q._id}</option>
                            ))}
                        </select>
                        {hasActiveFilters && (
                            <button className="clear-filters-btn" onClick={clearFilters}>Clear all</button>
                        )}
                    </div>
                )}

                {/* Grid */}
                {loading ? (
                    <div className="concept-grid">
                        {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : items.length > 0 ? (
                    <>
                        <div className="concept-grid">
                            {items.map((concept) => (
                                <ConceptCard
                                    key={concept._id}
                                    concept={concept}
                                    isBookmarked={bookmarkIds.includes(concept._id)}
                                />
                            ))}
                        </div>
                        <Pagination
                            page={pagination.page}
                            totalPages={pagination.totalPages}
                            onPageChange={(p) => dispatch(setPage(p))}
                        />
                    </>
                ) : (
                    <EmptyState
                        icon={HiOutlineSquares2X2}
                        title="No concepts found"
                        message="Try adjusting your filters or search query."
                        action={hasActiveFilters ? 'Clear Filters' : undefined}
                        onAction={clearFilters}
                    />
                )}
            </div>
        </>
    );
};

export default ConceptExplorer;
