import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PageHeader from '../../components/admin/PageHeader';
import toast from 'react-hot-toast';
import { FiUser, FiLock, FiShield, FiSave, FiMail, FiKey, FiAlertTriangle, FiToggleLeft } from 'react-icons/fi';

const Settings = () => {
    const { user } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('profile');

    const profileFormik = useFormik({
        initialValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
        }),
        onSubmit: () => {
            toast.success('Profile updated successfully');
        }
    });

    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            currentPassword: Yup.string().required('Current password is required'),
            newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
            confirmPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match').required('Confirm password is required'),
        }),
        onSubmit: (values, { resetForm }) => {
            toast.success('Password changed successfully');
            resetForm();
        }
    });

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: FiUser },
        { id: 'security', label: 'Security', icon: FiLock },
        { id: 'platform', label: 'Platform', icon: FiShield },
    ];

    return (
        <div className="dash-page fade-in">
            <Helmet>
                <title>Settings — CAIA Admin</title>
            </Helmet>

            <PageHeader
                title="Admin Settings"
                description="Manage your account preferences and security settings."
                breadcrumbs={[{ label: 'Admin', path: '/admin/dashboard' }, { label: 'Settings' }]}
            />

            <div style={{
                display: 'grid',
                gridTemplateColumns: '260px 1fr',
                gap: '1.5rem',
                alignItems: 'start',
            }}>
                {/* ── Sidebar ── */}
                <div className="admin-card" style={{ padding: '1rem' }}>
                    {/* User avatar block */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '1.5rem 1rem',
                        marginBottom: '0.75rem',
                        borderBottom: '1px solid var(--color-mist)',
                    }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-indigo), var(--color-blue))',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '0.75rem',
                            boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <p style={{ fontWeight: '700', color: 'var(--color-midnight)', fontSize: '0.95rem' }}>
                            {user?.name || 'Admin User'}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--color-graphite)', marginTop: '0.2rem' }}>
                            {user?.email || 'admin@example.com'}
                        </p>
                        <span style={{
                            marginTop: '0.6rem',
                            padding: '0.2rem 0.75rem',
                            background: 'var(--color-sky)',
                            color: 'var(--color-blue)',
                            borderRadius: '999px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                        }}>
                            Administrator
                        </span>
                    </div>

                    {/* Nav links */}
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {tabs.map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: '600',
                                    transition: 'all 0.15s',
                                    background: activeTab === id ? 'var(--color-sky)' : 'transparent',
                                    color: activeTab === id ? 'var(--color-blue)' : 'var(--color-graphite)',
                                    width: '100%',
                                    textAlign: 'left',
                                }}
                            >
                                <Icon size={17} />
                                {label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* ── Content Panel ── */}
                <div>
                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                        <div className="admin-card fade-in">
                            {/* Header */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '2rem',
                                paddingBottom: '1.25rem',
                                borderBottom: '1px solid var(--color-mist)',
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: 'var(--color-sky)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <FiUser size={18} color="var(--color-blue)" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-midnight)' }}>
                                        Profile Settings
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-graphite)', marginTop: '0.1rem' }}>
                                        Update your display name and email address.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={profileFormik.handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    {/* Full Name */}
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-slate)', marginBottom: '0.5rem' }}>
                                            <FiUser size={13} /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileFormik.values.name}
                                            onChange={profileFormik.handleChange}
                                            onBlur={profileFormik.handleBlur}
                                            placeholder="e.g., John Smith"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                border: `1.5px solid ${profileFormik.touched.name && profileFormik.errors.name ? '#FCA5A5' : 'var(--color-mist)'}`,
                                                borderRadius: '12px',
                                                background: 'var(--color-snow)',
                                                fontSize: '0.9rem',
                                                outline: 'none',
                                                transition: 'all 0.15s',
                                                boxSizing: 'border-box',
                                                color: 'var(--color-midnight)',
                                            }}
                                        />
                                        {profileFormik.touched.name && profileFormik.errors.name && (
                                            <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#EF4444' }}>{profileFormik.errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-slate)', marginBottom: '0.5rem' }}>
                                            <FiMail size={13} /> Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileFormik.values.email}
                                            onChange={profileFormik.handleChange}
                                            onBlur={profileFormik.handleBlur}
                                            placeholder="admin@example.com"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 1rem',
                                                border: `1.5px solid ${profileFormik.touched.email && profileFormik.errors.email ? '#FCA5A5' : 'var(--color-mist)'}`,
                                                borderRadius: '12px',
                                                background: 'var(--color-snow)',
                                                fontSize: '0.9rem',
                                                outline: 'none',
                                                transition: 'all 0.15s',
                                                boxSizing: 'border-box',
                                                color: 'var(--color-midnight)',
                                            }}
                                        />
                                        {profileFormik.touched.email && profileFormik.errors.email && (
                                            <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#EF4444' }}>{profileFormik.errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Info note */}
                                <div style={{
                                    padding: '0.9rem 1.1rem',
                                    background: 'var(--color-sky)',
                                    borderRadius: '10px',
                                    fontSize: '0.83rem',
                                    color: 'var(--color-blue)',
                                    marginBottom: '1.75rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.6rem',
                                }}>
                                    <FiAlertTriangle size={15} style={{ flexShrink: 0 }} />
                                    Changing your email may require re-verification before taking effect.
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" className="admin-action-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.9rem' }}>
                                        <FiSave size={16} /> Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="admin-card fade-in">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '2rem',
                                paddingBottom: '1.25rem',
                                borderBottom: '1px solid var(--color-mist)',
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: '#FEF3C7', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <FiLock size={18} color="#D97706" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-midnight)' }}>
                                        Change Password
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-graphite)', marginTop: '0.1rem' }}>
                                        Use a strong password at least 6 characters long.
                                    </p>
                                </div>
                            </div>

                            <form onSubmit={passwordFormik.handleSubmit}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '480px', marginBottom: '1.75rem' }}>
                                    {[
                                        { name: 'currentPassword', label: 'Current Password', placeholder: '••••••••' },
                                        { name: 'newPassword', label: 'New Password', placeholder: '••••••••' },
                                        { name: 'confirmPassword', label: 'Confirm New Password', placeholder: '••••••••' },
                                    ].map(({ name, label, placeholder }) => (
                                        <div key={name}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', color: 'var(--color-slate)', marginBottom: '0.5rem' }}>
                                                <FiKey size={13} /> {label}
                                            </label>
                                            <input
                                                type="password"
                                                name={name}
                                                value={passwordFormik.values[name]}
                                                onChange={passwordFormik.handleChange}
                                                onBlur={passwordFormik.handleBlur}
                                                placeholder={placeholder}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1rem',
                                                    border: `1.5px solid ${passwordFormik.touched[name] && passwordFormik.errors[name] ? '#FCA5A5' : 'var(--color-mist)'}`,
                                                    borderRadius: '12px',
                                                    background: 'var(--color-snow)',
                                                    fontSize: '0.9rem',
                                                    outline: 'none',
                                                    transition: 'all 0.15s',
                                                    boxSizing: 'border-box',
                                                    color: 'var(--color-midnight)',
                                                }}
                                            />
                                            {passwordFormik.touched[name] && passwordFormik.errors[name] && (
                                                <p style={{ marginTop: '0.4rem', fontSize: '0.8rem', color: '#EF4444' }}>{passwordFormik.errors[name]}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    <button type="submit" className="admin-action-primary" style={{ padding: '0.75rem 2rem', fontSize: '0.9rem' }}>
                                        <FiSave size={16} /> Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Platform Settings */}
                    {activeTab === 'platform' && (
                        <div className="admin-card fade-in">
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '2rem',
                                paddingBottom: '1.25rem',
                                borderBottom: '1px solid var(--color-mist)',
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: '#F0FDF4', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <FiShield size={18} color="#16A34A" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--color-midnight)' }}>
                                        Platform Settings
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-graphite)', marginTop: '0.1rem' }}>
                                        Control global platform behaviour and access.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    {
                                        title: 'Maintenance Mode',
                                        desc: 'Temporarily disable access for all non-admin users while you perform updates.',
                                        defaultChecked: false,
                                        color: '#EF4444',
                                        bg: '#FEF2F2',
                                    },
                                    {
                                        title: 'Open Registration',
                                        desc: 'Allow new users to create accounts on the platform.',
                                        defaultChecked: true,
                                        color: '#16A34A',
                                        bg: '#F0FDF4',
                                    },
                                    {
                                        title: 'Email Notifications',
                                        desc: 'Send automated email digests and system alerts to admins.',
                                        defaultChecked: true,
                                        color: '#6366F1',
                                        bg: 'var(--color-sky)',
                                    },
                                ].map(({ title, desc, defaultChecked, color, bg }) => (
                                    <div key={title} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1.25rem 1.5rem',
                                        border: '1.5px solid var(--color-mist)',
                                        borderRadius: '14px',
                                        background: 'var(--color-white)',
                                        gap: '1rem',
                                        transition: 'border-color 0.15s',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                width: '36px', height: '36px', borderRadius: '9px',
                                                background: bg, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            }}>
                                                <FiToggleLeft size={16} color={color} />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: '700', color: 'var(--color-midnight)', fontSize: '0.9rem' }}>{title}</p>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-graphite)', marginTop: '0.15rem', lineHeight: '1.4' }}>{desc}</p>
                                            </div>
                                        </div>
                                        {/* Toggle switch */}
                                        <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', flexShrink: 0 }}>
                                            <input type="checkbox" defaultChecked={defaultChecked} style={{ display: 'none' }} />
                                            <div style={{
                                                width: '44px', height: '24px', borderRadius: '999px',
                                                background: defaultChecked ? color : '#CBD5E1',
                                                position: 'relative', transition: 'background 0.2s',
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '3px',
                                                    left: defaultChecked ? '23px' : '3px',
                                                    width: '18px', height: '18px',
                                                    borderRadius: '50%', background: '#fff',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                    transition: 'left 0.2s',
                                                }} />
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.75rem' }}>
                                <button
                                    type="button"
                                    className="admin-action-primary"
                                    style={{ padding: '0.75rem 2rem', fontSize: '0.9rem' }}
                                    onClick={() => toast.success('Platform settings saved')}
                                >
                                    <FiSave size={16} /> Save Settings
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
