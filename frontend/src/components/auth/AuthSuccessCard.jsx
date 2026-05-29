import { HiCheckCircle } from 'react-icons/hi2';
import GlassCard from '../ui/GlassCard';
import GradientButton from '../ui/GradientButton';

const AuthSuccessCard = ({ title, message, buttonText, onButtonClick, icon }) => {
    return (
        <GlassCard className="auth-card">
            <div className="auth-success-card">
                <div className="success-icon-wrapper">
                    {icon || <HiCheckCircle />}
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

export default AuthSuccessCard;
