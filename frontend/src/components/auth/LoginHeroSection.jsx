import FloatingShapes from '../ui/FloatingShapes';
import { HiSparkles, HiChartBar, HiUsers, HiCpuChip, HiShieldCheck, HiBolt } from 'react-icons/hi2';

const LoginHeroSection = () => {
    return (
        <div className="auth-hero">
            <FloatingShapes />

            <div className="auth-hero-content">
                {/* Brand Badge */}
                <div className="auth-hero-brand">
                    <div className="auth-hero-brand-icon">
                        <HiSparkles />
                    </div>
                    CAIA Platform
                </div>

                {/* Headline */}
                <h1>Design Systems,{'\n'}Reimagined</h1>
                <p className="hero-subtitle">
                    Build smarter architecture with AI-powered system design tools.
                    Collaborate, analyze, and ship with confidence.
                </p>

                {/* Stats */}
                <div className="hero-stats">
                    <div className="hero-stat-card">
                        <div className="hero-stat-value">12K+</div>
                        <div className="hero-stat-label">Users</div>
                    </div>
                    <div className="hero-stat-card">
                        <div className="hero-stat-value">98%</div>
                        <div className="hero-stat-label">Uptime</div>
                    </div>
                    <div className="hero-stat-card">
                        <div className="hero-stat-value">4.9★</div>
                        <div className="hero-stat-label">Rating</div>
                    </div>
                </div>

                {/* Preview Cards */}
                <div className="hero-preview-cards">
                    <div className="preview-card">
                        <div className="preview-card-icon">
                            <HiShieldCheck style={{ color: 'white' }} />
                        </div>
                        <div className="preview-card-title">Enterprise Security</div>
                        <div className="preview-card-value">SOC 2 compliant</div>
                    </div>
                    <div className="preview-card">
                        <div className="preview-card-icon">
                            <HiBolt style={{ color: 'white' }} />
                        </div>
                        <div className="preview-card-title">Lightning Fast</div>
                        <div className="preview-card-value">Sub-100ms response</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginHeroSection;
