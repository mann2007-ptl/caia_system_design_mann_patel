import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiOutlineArchiveBox, HiOutlineArrowPath } from 'react-icons/hi2';
import { DifficultyBadge, Badge, SkeletonCard, EmptyState } from '../../components/dashboard/DashboardComponents';
import { fetchConcepts, restoreConcept } from '../../features/concepts/conceptSlice';
import toast from 'react-hot-toast';

const Archived = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, loading } = useSelector((state) => state.concepts);

    useEffect(() => {
        dispatch(fetchConcepts({ archived: true }));
    }, [dispatch]);

    const archivedItems = items.filter(c => c.isArchived || c.archived);

    const handleRestore = (id) => {
        dispatch(restoreConcept(id));
        toast.success('Concept restored!');
    };

    return (
        <>
            <Helmet>
                <title>Archived — CAIA Platform</title>
                <meta name="description" content="Your archived system design concepts." />
            </Helmet>

            <div className="archived-page">
                <div className="page-header">
                    <h1 className="page-title">Archived Concepts</h1>
                    <p className="page-subtitle">Concepts you've archived for later</p>
                </div>

                {loading ? (
                    <div className="concept-grid">
                        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : archivedItems.length > 0 ? (
                    <div className="concept-grid">
                        {archivedItems.map((concept) => (
                            <div key={concept._id} className="concept-card archived-card">
                                <div className="concept-card-header">
                                    <h3 className="concept-card-title">{concept.metadata?.concept || concept.title || "Untitled"}</h3>
                                </div>
                                <p className="concept-card-category">{concept.metadata?.category || "General"}</p>
                                <div className="concept-card-badges">
                                    {concept.metadata?.difficulty && <DifficultyBadge difficulty={concept.metadata.difficulty} />}
                                    {concept.metadata?.language && <Badge variant="info">{concept.metadata.language}</Badge>}
                                </div>
                                <div className="concept-card-footer">
                                    <button className="restore-btn" onClick={() => handleRestore(concept._id)}>
                                        <HiOutlineArrowPath /> Restore
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={HiOutlineArchiveBox}
                        title="No archived concepts"
                        message="Archive concepts from the explorer to manage your learning list."
                        action="Explore Concepts"
                        onAction={() => navigate('/concepts')}
                    />
                )}
            </div>
        </>
    );
};

export default Archived;
