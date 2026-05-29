import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';

const AuthMessageState = ({ icon, iconClassName, title, message, buttonText, onButtonClick }) => {
    return (
        <GlassCard className="auth-card">
            <div className="auth-message-state" style={{ padding: '2rem 0' }}>
                <div className={iconClassName || 'success-icon-wrapper'}>
                    {icon}
                </div>
                <h2 className="success-title">{title}</h2>
                <p className="success-message">{message}</p>
                {buttonText && (
                    <GradientButton onClick={onButtonClick} type="button">
                        {buttonText}
                    </GradientButton>
                )}
            </div>
        </GlassCard>
    );
};

export default AuthMessageState;
