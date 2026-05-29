import GlassCard from '../ui/GlassCard';

const AuthCard = ({ children, className = '' }) => {
    return (
        <GlassCard className={`auth-card ${className}`}>
            {children}
        </GlassCard>
    );
};

export default AuthCard;
