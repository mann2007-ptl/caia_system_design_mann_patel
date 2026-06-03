import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiOutlineBookmarkSquare, HiOutlineBookOpen } from 'react-icons/hi2';
import ConceptCard from '../../components/dashboard/ConceptCard';
import { SkeletonCard, EmptyState } from '../../components/dashboard/DashboardComponents';
import { fetchBookmarks } from '../../features/concepts/conceptSlice';

const Bookmarks = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { bookmarks, bookmarkLoading } = useSelector((state) => state.concepts);

    useEffect(() => {
        dispatch(fetchBookmarks());
    }, [dispatch]);

    // bookmarks can be an array of concepts or bookmark objects with nested concept
    const concepts = bookmarks.map(b => b.concept || b);

    return (
        <>
            <Helmet>
                <title>Bookmarks — CAIA Platform</title>
                <meta name="description" content="Your bookmarked system design concepts." />
            </Helmet>

            <div className="bookmarks-page">
                <div className="page-header">
                    <h1 className="page-title">Bookmarks</h1>
                    <p className="page-subtitle">Your saved concepts for quick access</p>
                </div>

                {bookmarkLoading ? (
                    <div className="concept-grid">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : concepts.length > 0 ? (
                    <div className="concept-grid">
                        {concepts.map((concept) => (
                            <ConceptCard key={concept._id} concept={concept} isBookmarked={true} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={HiOutlineBookmarkSquare}
                        title="No bookmarks yet"
                        message="Start bookmarking concepts to save them here for quick reference."
                        action="Explore Concepts"
                        onAction={() => navigate('/concepts')}
                    />
                )}
            </div>
        </>
    );
};

export default Bookmarks;
