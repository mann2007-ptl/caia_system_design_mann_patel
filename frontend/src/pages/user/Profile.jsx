import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
    HiOutlineUser, HiOutlineEnvelope, HiOutlineShieldCheck,
    HiOutlineCalendarDays, HiOutlinePencilSquare
} from 'react-icons/hi2';
import { Badge } from '../../components/dashboard/DashboardComponents';

const Profile = () => {
    const { user, role } = useSelector((state) => state.auth);

    const profileFields = [
        { icon: HiOutlineUser, label: 'Full Name', value: user?.name || 'N/A' },
        { icon: HiOutlineEnvelope, label: 'Email', value: user?.email || 'N/A' },
        { icon: HiOutlineShieldCheck, label: 'Role', value: role || 'user' },
        { icon: HiOutlineCalendarDays, label: 'Joined', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A' },
    ];

    return (
        <>
            <Helmet>
                <title>Profile — CAIA Platform</title>
                <meta name="description" content="Your CAIA profile and account settings." />
            </Helmet>

            <div className="profile-page">
                <div className="page-header">
                    <h1 className="page-title">Profile</h1>
                    <p className="page-subtitle">Your account information</p>
                </div>

                <div className="profile-card">
                    {/* Avatar Section */}
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="profile-avatar-info">
                            <h2 className="profile-name">{user?.name || 'User'}</h2>
                            <Badge variant={role === 'admin' ? 'primary' : 'success'}>{role || 'user'}</Badge>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="profile-info-grid">
                        {profileFields.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="profile-field">
                                <div className="profile-field-icon">
                                    <Icon />
                                </div>
                                <div className="profile-field-content">
                                    <span className="profile-field-label">{label}</span>
                                    <span className="profile-field-value">{value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;
