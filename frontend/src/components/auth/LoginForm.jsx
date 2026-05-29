import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineArrowRight } from 'react-icons/hi2';

import AuthCard from './AuthCard';
import AuthInput from './AuthInput';
import PasswordInput from './PasswordInput';
import RememberMe from './RememberMe';
import GradientButton from '../ui/GradientButton';
import { loginUser } from '../../features/auth/authSlice';
import { VALIDATION, ROLES, STORAGE_KEYS } from '../../constants';

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email(VALIDATION.EMAIL_INVALID)
        .required(VALIDATION.EMAIL_REQUIRED),
    password: Yup.string()
        .min(6, VALIDATION.PASSWORD_MIN)
        .required(VALIDATION.PASSWORD_REQUIRED),
});

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);
    const [rememberMe, setRememberMe] = useState(
        () => localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true'
    );

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const result = await dispatch(loginUser(values)).unwrap();

            // Remember me persistence
            if (rememberMe) {
                localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, 'true');
            } else {
                localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
            }

            toast.success('Welcome back! Login successful.', {
                icon: '🎉',
                style: {
                    borderRadius: '12px',
                    background: '#fff',
                    color: '#1e293b',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                },
            });

            // Role-based redirect
            const role = result.user?.role;
            if (role === ROLES.ADMIN) {
                navigate('/admin/dashboard', { replace: true });
            } else {
                navigate('/dashboard', { replace: true });
            }
        } catch (error) {
            toast.error(error || 'Login failed. Please try again.', {
                style: {
                    borderRadius: '12px',
                    background: '#fff',
                    color: '#1e293b',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
                },
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-form-section">
            <AuthCard>
                {/* Header */}
                <div className="auth-card-header">
                    <div className="auth-card-icon">
                        <HiOutlineLockClosed />
                    </div>
                    <h2 className="auth-card-title">Welcome back</h2>
                    <p className="auth-card-subtitle">Sign in to your account to continue</p>
                </div>

                {/* Form */}
                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={loginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form noValidate>
                            <Field
                                name="email"
                                component={AuthInput}
                                label="Email Address"
                                icon={HiOutlineEnvelope}
                                placeholder="you@example.com"
                                type="email"
                                id="login-email"
                            />

                            <Field
                                name="password"
                                component={PasswordInput}
                                label="Password"
                                icon={HiOutlineLockClosed}
                                placeholder="Enter your password"
                                id="login-password"
                            />

                            {/* Options row */}
                            <div className="form-options">
                                <RememberMe
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <Link to="/forgot-password" className="forgot-link">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit */}
                            <GradientButton loading={loading || isSubmitting}>
                                {loading ? 'Signing in...' : 'Sign In'}
                                {!loading && <HiOutlineArrowRight />}
                            </GradientButton>
                        </Form>
                    )}
                </Formik>

                {/* Footer */}
                <div className="auth-footer">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/register">Create account</Link>
                    </p>
                </div>
            </AuthCard>
        </div>
    );
};

export default LoginForm;
