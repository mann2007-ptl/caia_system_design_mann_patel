import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
    HiOutlineBookmarkSquare, HiOutlineArchiveBox, HiOutlineHandThumbUp,
    HiOutlinePencilSquare, HiOutlineClipboard, HiOutlineArrowLeft,
    HiOutlineEye, HiOutlineHandThumbDown
} from 'react-icons/hi2';
import { DifficultyBadge, Badge, ActionButton, NoteModal } from '../../components/dashboard/DashboardComponents';
import MarkdownRenderer from '../../components/dashboard/MarkdownRenderer';
import {
    fetchConceptById, clearSelectedConcept, addBookmark, removeBookmark,
    archiveConcept, voteOnConcept, fetchNotes, addNote, fetchBookmarks
} from '../../features/concepts/conceptSlice';
import toast from 'react-hot-toast';

const ConceptDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { selectedConcept: concept, loading, bookmarks, notes, noteLoading, items } = useSelector((state) => state.concepts);
    const [noteOpen, setNoteOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchConceptById(id));
        dispatch(fetchBookmarks());
        dispatch(fetchNotes(id));
        return () => dispatch(clearSelectedConcept());
    }, [dispatch, id]);

    const isBookmarked = bookmarks.some(b => (b.conceptId || b._id) === id);

    const handleCopy = (text, label) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard!`);
    };

    const handleBookmark = () => {
        if (isBookmarked) {
            dispatch(removeBookmark(id));
            toast.success('Bookmark removed');
        } else {
            dispatch(addBookmark(id));
            toast.success('Bookmarked!');
        }
    };

    const handleVote = (voteType) => {
        dispatch(voteOnConcept({ conceptId: id, voteType }));
        toast.success(voteType === 'up' ? 'Upvoted!' : 'Downvoted');
    };

    const handleAddNote = (content) => {
        dispatch(addNote({ conceptId: id, data: { content } }));
        setNoteOpen(false);
        toast.success('Note added!');
    };

    if (loading || !concept) {
        return (
            <div className="detail-loading">
                <div className="spinner spinner-lg spinner-indigo" />
                <p>Loading concept...</p>
            </div>
        );
    }

    // ── Extract metadata safely ──
    const meta = concept.metadata || {};
    const title = meta.concept || concept.prompt?.slice(0, 80) || 'System Design Concept';
    const category = meta.category || 'System Design';
    const subcategory = meta.subcategory || '';
    const difficulty = meta.difficulty || '';
    const language = meta.language || '';
    const questionType = meta.question_type || '';

    // ── Next/Prev Navigation ──
    const currentIndex = items.findIndex(c => c._id === id);
    const prevConcept = (currentIndex > 0) ? items[currentIndex - 1] : null;
    const nextConcept = (currentIndex !== -1 && currentIndex < items.length - 1) ? items[currentIndex + 1] : null;

    return (
        <>
            <Helmet>
                <title>{title} — CAIA Platform</title>
                <meta name="description" content={`Learn about ${title} - ${category}`} />
            </Helmet>

            <div className="detail-page fade-in">
                {/* Back Button */}
                <button className="detail-back" onClick={() => navigate(-1)}>
                    <HiOutlineArrowLeft /> Back to Explorer
                </button>

                {/* Header */}
                <div className="detail-header">
                    <h1 className="detail-title">{title}</h1>
                    <div className="detail-meta">
                        <span className="detail-category">{category}</span>
                        {subcategory && <span className="detail-subcategory">› {subcategory}</span>}
                    </div>
                    <div className="detail-badges">
                        {difficulty && <DifficultyBadge difficulty={difficulty} />}
                        {language && <Badge variant="info">{language}</Badge>}
                        {questionType && <Badge variant="primary">{questionType}</Badge>}
                        <span className="detail-views"><HiOutlineEye /> {concept.views || 0} views</span>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="detail-actions">
                    <ActionButton icon={HiOutlineBookmarkSquare} label={isBookmarked ? 'Bookmarked' : 'Bookmark'} onClick={handleBookmark} active={isBookmarked} variant="bookmark" />
                    <ActionButton icon={HiOutlineArchiveBox} label="Archive" onClick={() => { dispatch(archiveConcept(id)); toast.success('Archived'); }} />
                    <ActionButton icon={HiOutlineHandThumbUp} label="Upvote" onClick={() => handleVote('up')} />
                    <ActionButton icon={HiOutlineHandThumbDown} label="Downvote" onClick={() => handleVote('down')} />
                    <ActionButton icon={HiOutlinePencilSquare} label="Add Note" onClick={() => setNoteOpen(true)} />
                    <ActionButton icon={HiOutlineClipboard} label="Copy Prompt" onClick={() => handleCopy(concept.prompt || '', 'Prompt')} />
                    <ActionButton icon={HiOutlineClipboard} label="Copy Response" onClick={() => handleCopy(concept.response || '', 'Response')} />
                </div>

                {/* Prompt Section */}
                {concept.prompt && (
                    <div className="detail-section">
                        <h2 className="detail-section-title">📝 Prompt</h2>
                        <div className="detail-prompt-block">
                            <pre>{concept.prompt}</pre>
                        </div>
                    </div>
                )}

                {/* Response Section */}
                {concept.response && (
                    <div className="detail-section">
                        <h2 className="detail-section-title">🤖 AI Response</h2>
                        <div className="detail-response-block markdown-content">
                            <MarkdownRenderer content={concept.response} />
                        </div>
                    </div>
                )}

                {/* Notes Section */}
                {notes.length > 0 && (
                    <div className="detail-section">
                        <h2 className="detail-section-title">📒 Your Notes</h2>
                        <div className="detail-notes-list">
                            {notes.map((note) => (
                                <div key={note._id} className="detail-note-item">
                                    <p>{note.content}</p>
                                    <span className="detail-note-date">{new Date(note.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Concept Navigation ── */}
                {(prevConcept || nextConcept) && (
                    <div className="concept-navigation">
                        {prevConcept ? (
                            <button className="nav-btn prev" onClick={() => navigate(`/concepts/${prevConcept._id}`)}>
                                <span className="nav-label">← Previous</span>
                                <span className="nav-title">{prevConcept.metadata?.concept || prevConcept.title || 'Concept'}</span>
                            </button>
                        ) : <div />}
                        {nextConcept ? (
                            <button className="nav-btn next" onClick={() => navigate(`/concepts/${nextConcept._id}`)}>
                                <span className="nav-label">Next →</span>
                                <span className="nav-title">{nextConcept.metadata?.concept || nextConcept.title || 'Concept'}</span>
                            </button>
                        ) : <div />}
                    </div>
                )}
            </div>

            <NoteModal isOpen={noteOpen} onClose={() => setNoteOpen(false)} onSave={handleAddNote} loading={noteLoading} />
        </>
    );
};

export default ConceptDetails;
