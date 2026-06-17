import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createConcept } from '../../features/admin/adminSlice';
import PageHeader from '../../components/admin/PageHeader';
import toast from 'react-hot-toast';
import { FiSave, FiArrowLeft, FiBookOpen, FiEdit3, FiAlertTriangle } from 'react-icons/fi';

const validationSchema = Yup.object({
    prompt: Yup.string().required('Prompt is required').min(10, 'Prompt must be at least 10 characters'),
    response: Yup.string().required('Response is required').min(20, 'Response must be at least 20 characters'),
    metadata: Yup.object({
        concept: Yup.string().required('Concept Name is required'),
        category: Yup.string().required('Category is required'),
        subcategory: Yup.string().required('Subcategory is required'),
        difficulty: Yup.string().required('Difficulty is required').oneOf(['Easy', 'Medium', 'Hard', 'Expert']),
        question_type: Yup.string().required('Question Type is required'),
        language: Yup.string().required('Language is required'),
    })
});

/* ── Shared inline-style helpers ── */
const inputBase = (hasError) => ({
    width: '100%',
    padding: '0.75rem 1rem',
    border: `1.5px solid ${hasError ? '#FCA5A5' : 'var(--color-mist)'}`,
    borderRadius: '12px',
    background: 'var(--color-snow)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.15s',
    boxSizing: 'border-box',
    color: 'var(--color-midnight)',
    fontFamily: 'var(--font-primary)',
});

const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--color-slate)',
    marginBottom: '0.5rem',
};

const errorStyle = {
    marginTop: '0.4rem',
    fontSize: '0.8rem',
    color: '#EF4444',
};

const CreateConcept = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.admin);

    const formik = useFormik({
        initialValues: {
            prompt: '',
            response: '',
            metadata: {
                concept: '',
                category: '',
                subcategory: '',
                difficulty: 'Medium',
                question_type: 'Concept',
                language: 'General'
            }
        },
        validationSchema,
        onSubmit: async (values) => {
            const resultAction = await dispatch(createConcept(values));
            if (createConcept.fulfilled.match(resultAction)) {
                toast.success('Concept created successfully!');
                navigate('/admin/concepts');
            } else {
                toast.error(resultAction.payload || 'Failed to create concept');
            }
        }
    });

    return (
        <div className="dash-page fade-in" style={{ maxWidth: '860px', margin: '0 auto' }}>
            <Helmet>
                <title>Create Concept — CAIA Admin</title>
            </Helmet>
            
            <PageHeader 
                title="Create New Concept" 
                breadcrumbs={[
                    { label: 'Admin', path: '/admin/dashboard' }, 
                    { label: 'Concepts', path: '/admin/concepts' },
                    { label: 'Create' }
                ]}
                actionButton={
                    <button 
                        onClick={() => navigate(-1)}
                        className="admin-action-secondary"
                    >
                        <FiArrowLeft /> Back
                    </button>
                }
            />

            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                <form onSubmit={formik.handleSubmit}>

                    {/* ── Basic Information Section ── */}
                    <div style={{ padding: '2rem 2rem 0' }}>
                        {/* Section Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '1.75rem',
                            paddingBottom: '1.25rem',
                            borderBottom: '1px solid var(--color-mist)',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: 'var(--color-sky)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <FiBookOpen size={18} color="var(--color-blue)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-midnight)' }}>
                                    Basic Information
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-graphite)', marginTop: '0.1rem' }}>
                                    Define the concept metadata and classification details.
                                </p>
                            </div>
                        </div>

                        {/* 2-col grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.75rem' }}>
                            {/* Concept Name */}
                            <div>
                                <label style={labelStyle}>
                                    Concept Name <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="metadata.concept"
                                    value={formik.values.metadata.concept}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="e.g., Database Sharding"
                                    style={inputBase(formik.touched.metadata?.concept && formik.errors.metadata?.concept)}
                                />
                                {formik.touched.metadata?.concept && formik.errors.metadata?.concept && (
                                    <p style={errorStyle}>{formik.errors.metadata.concept}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label style={labelStyle}>
                                    Category <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="metadata.category"
                                    value={formik.values.metadata.category}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="e.g., System Design"
                                    style={inputBase(formik.touched.metadata?.category && formik.errors.metadata?.category)}
                                />
                                {formik.touched.metadata?.category && formik.errors.metadata?.category && (
                                    <p style={errorStyle}>{formik.errors.metadata.category}</p>
                                )}
                            </div>

                            {/* Subcategory */}
                            <div>
                                <label style={labelStyle}>
                                    Subcategory <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="metadata.subcategory"
                                    value={formik.values.metadata.subcategory}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="e.g., Databases"
                                    style={inputBase(formik.touched.metadata?.subcategory && formik.errors.metadata?.subcategory)}
                                />
                                {formik.touched.metadata?.subcategory && formik.errors.metadata?.subcategory && (
                                    <p style={errorStyle}>{formik.errors.metadata.subcategory}</p>
                                )}
                            </div>

                            {/* Difficulty */}
                            <div>
                                <label style={labelStyle}>
                                    Difficulty <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <select
                                    name="metadata.difficulty"
                                    value={formik.values.metadata.difficulty}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    style={{
                                        ...inputBase(formik.touched.metadata?.difficulty && formik.errors.metadata?.difficulty),
                                        cursor: 'pointer',
                                        appearance: 'auto',
                                    }}
                                >
                                    <option value="Easy">Easy</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Hard">Hard</option>
                                    <option value="Expert">Expert</option>
                                </select>
                                {formik.touched.metadata?.difficulty && formik.errors.metadata?.difficulty && (
                                    <p style={errorStyle}>{formik.errors.metadata.difficulty}</p>
                                )}
                            </div>

                            {/* Question Type */}
                            <div>
                                <label style={labelStyle}>
                                    Question Type <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="metadata.question_type"
                                    value={formik.values.metadata.question_type}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="e.g., Concept"
                                    style={inputBase(formik.touched.metadata?.question_type && formik.errors.metadata?.question_type)}
                                />
                                {formik.touched.metadata?.question_type && formik.errors.metadata?.question_type && (
                                    <p style={errorStyle}>{formik.errors.metadata.question_type}</p>
                                )}
                            </div>

                            {/* Language */}
                            <div>
                                <label style={labelStyle}>
                                    Language <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="metadata.language"
                                    value={formik.values.metadata.language}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="e.g., General"
                                    style={inputBase(formik.touched.metadata?.language && formik.errors.metadata?.language)}
                                />
                                {formik.touched.metadata?.language && formik.errors.metadata?.language && (
                                    <p style={errorStyle}>{formik.errors.metadata.language}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Content Section ── */}
                    <div style={{ padding: '0 2rem 2rem' }}>
                        {/* Section Header */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '1.75rem',
                            paddingBottom: '1.25rem',
                            borderBottom: '1px solid var(--color-mist)',
                        }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '10px',
                                background: '#F0FDF4', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                            }}>
                                <FiEdit3 size={18} color="#16A34A" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-midnight)' }}>
                                    Content
                                </h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-graphite)', marginTop: '0.1rem' }}>
                                    Write the prompt and its detailed response. Markdown is supported in the response.
                                </p>
                            </div>
                        </div>

                        {/* Prompt */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>
                                Prompt <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <textarea
                                name="prompt"
                                value={formik.values.prompt}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows="3"
                                placeholder="Enter the prompt or question..."
                                style={{
                                    ...inputBase(formik.touched.prompt && formik.errors.prompt),
                                    resize: 'vertical',
                                    minHeight: '80px',
                                }}
                            ></textarea>
                            {formik.touched.prompt && formik.errors.prompt && (
                                <p style={errorStyle}>{formik.errors.prompt}</p>
                            )}
                        </div>

                        {/* Response */}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={labelStyle}>
                                Response (Markdown supported) <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <textarea
                                name="response"
                                value={formik.values.response}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                rows="12"
                                placeholder="Enter the detailed response..."
                                style={{
                                    ...inputBase(formik.touched.response && formik.errors.response),
                                    resize: 'vertical',
                                    minHeight: '200px',
                                    fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace",
                                    fontSize: '0.85rem',
                                    lineHeight: '1.6',
                                }}
                            ></textarea>
                            {formik.touched.response && formik.errors.response && (
                                <p style={errorStyle}>{formik.errors.response}</p>
                            )}
                        </div>

                        {/* Info tip */}
                        <div style={{
                            padding: '0.9rem 1.1rem',
                            background: 'var(--color-sky)',
                            borderRadius: '10px',
                            fontSize: '0.83rem',
                            color: 'var(--color-blue)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                        }}>
                            <FiAlertTriangle size={15} style={{ flexShrink: 0 }} />
                            The response field supports full Markdown syntax including headings, lists, code blocks, and tables.
                        </div>
                    </div>

                    {/* ── Footer Actions ── */}
                    <div style={{
                        padding: '1.25rem 2rem',
                        background: 'var(--color-snow)',
                        borderTop: '1px solid var(--color-mist)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.75rem',
                    }}>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/concepts')}
                            disabled={loading}
                            className="admin-action-secondary"
                            style={{ opacity: loading ? 0.5 : 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="admin-action-primary"
                            style={{ padding: '0.75rem 2rem', fontSize: '0.9rem', opacity: loading ? 0.5 : 1 }}
                        >
                            {loading && (
                                <svg style={{ animation: 'spin 0.7s linear infinite', width: '16px', height: '16px' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            <FiSave size={16} /> Create Concept
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateConcept;
