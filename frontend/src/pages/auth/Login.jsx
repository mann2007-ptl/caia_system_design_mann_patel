import { Helmet } from 'react-helmet-async';
import LoginHeroSection from '../../components/auth/LoginHeroSection';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
    return (
        <>
            <Helmet>
                <title>Sign In — CAIA Platform</title>
                <meta name="description" content="Sign in to your CAIA Platform account to access AI-powered system design tools." />
            </Helmet>

            <div className="auth-layout">
                <LoginHeroSection />
                <LoginForm />
            </div>
        </>
    );
};

export default Login;
