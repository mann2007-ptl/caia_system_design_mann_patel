import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { HiOutlineBookmarkSquare, HiOutlineArchiveBox, HiOutlineHandThumbUp, HiOutlineEye, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';
import { DifficultyBadge, Badge } from './DashboardComponents';
import { addBookmark, removeBookmark, archiveConcept } from '../../features/concepts/conceptSlice';
import toast from 'react-hot-toast';

const ConceptCard = ({ concept, isBookmarked = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ── Extract from metadata (backend model nests title/category inside metadata) ──
    const meta = concept.metadata || {};
    const title = meta.concept || concept.prompt?.slice(0, 80) || 'System Design Concept';
    const category = meta.category || 'System Design';
    const subcategory = meta.subcategory || '';
    const difficulty = meta.difficulty || '';
    const language = meta.language || '';
    const questionType = meta.question_type || '';
    const promptPreview = concept.prompt
        ? concept.prompt.length > 100
            ? concept.prompt.slice(0, 100) + '…'
            : concept.prompt
        : '';

    const handleBookmark = (e) => {
        e.stopPropagation();
        if (isBookmarked) {
            dispatch(removeBookmark(concept._id));
            toast.success('Bookmark removed');
        } else {
            dispatch(addBookmark(concept._id));
            toast.success('Bookmarked!');
        }
    };

    const handleArchive = (e) => {
        e.stopPropagation();
        dispatch(archiveConcept(concept._id));
        toast.success('Concept archived');
    };

    return (
        <div className="concept-card" onClick={() => navigate(`/concepts/${concept._id}`)}>
            <div className="concept-card-header">
                <h3 className="concept-card-title">{title}</h3>
                <button
                    className={`concept-card-bookmark ${isBookmarked ? 'active' : ''}`}
                    onClick={handleBookmark}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                    <HiOutlineBookmarkSquare />
                </button>
            </div>

            <p className="concept-card-category">
                {category}{subcategory ? ` › ${subcategory}` : ''}
            </p>

            {promptPreview && (
                <p className="concept-card-preview">{promptPreview}</p>
            )}

            <div className="concept-card-badges">
                {difficulty && <DifficultyBadge difficulty={difficulty} />}
                {language && <Badge variant="info">{language}</Badge>}
                {questionType && <Badge variant="primary">{questionType}</Badge>}
            </div>

            <div className="concept-card-footer">
                <div className="concept-card-stats">
                    <span className="concept-card-stat">
                        <HiOutlineEye /> {concept.views || 0}
                    </span>
                    <span className="concept-card-stat">
                        <HiOutlineHandThumbUp /> {concept.votes || 0}
                    </span>
                </div>
                <div className="concept-card-actions">
                    <button className="concept-card-action-btn" onClick={handleArchive} title="Archive">
                        <HiOutlineArchiveBox />
                    </button>
                    <button className="concept-card-action-btn open" onClick={() => navigate(`/concepts/${concept._id}`)} title="Open">
                        <HiOutlineArrowTopRightOnSquare />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConceptCard;
