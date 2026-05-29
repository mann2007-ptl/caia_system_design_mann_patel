import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { HiOutlineEnvelope, HiOutlinePaperAirplane } from 'react-icons/hi2';

import AuthPageLayout from '../../components/auth/AuthPageLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import GradientButton from '../../components/ui/GradientButton';
import { forgotPassword, resetAuthStates } from '../../features/auth/authSlice';
import { VALIDATION } from '../../constants';

const forgotSchema = Yup.object().shape({
    email: Yup.string()
        .email(VALIDATION.EMAIL_INVALID)
        .required(VALIDATION.EMAIL_REQUIRED),
});

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    useEffect(() => {
        return () => {
            dispatch(resetAuthStates());
        };
    }, [dispatch]);

    const handleSubmit = async (values) => {
        try {
            const result = await dispatch(forgotPassword(values.email)).unwrap();
            toast.success('Email confirmed! Redirecting to reset password...', {
                icon: '🚀',
                style: { borderRadius: '12px', background: '#fff', color: '#1e293b' },
            });

            // Wait a brief moment to show the toast, then redirect using the token
            if (result.resetToken) {
                setTimeout(() => {
                    navigate(`/reset-password/${result.resetToken}`, { replace: true });
                }, 1000);
            }
        } catch (err) {
            toast.error(err || 'Something went wrong.', {
                style: { borderRadius: '12px', background: '#fff', color: '#1e293b' },
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Forgot Password — CAIA Platform</title>
                <meta name="description" content="Reset your CAIA Platform password." />
            </Helmet>

            <AuthPageLayout>
                <AuthCard>
                    <div className="auth-card-header">
                        <div className="auth-card-icon">
                            <HiOutlineEnvelope />
                        </div>
                        <h2 className="auth-card-title">Forgot Password?</h2>
                        <p className="auth-card-subtitle">
                            No worries. Enter your email and we'll let you reset your password.
                        </p>
                    </div>

                    <Formik
                        initialValues={{ email: '' }}
                        validationSchema={forgotSchema}
                        onSubmit={handleSubmit}
                    >
                        {() => (
                            <Form noValidate>
                                <Field
                                    name="email"
                                    component={AuthInput}
                                    label="Email Address"
                                    icon={HiOutlineEnvelope}
                                    placeholder="you@example.com"
                                    type="email"
                                    id="forgot-email"
                                />

                                <GradientButton loading={loading}>
                                    {loading ? 'Processing...' : 'Continue'}
                                    {!loading && <HiOutlinePaperAirplane />}
                                </GradientButton>
                            </Form>
                        )}
                    </Formik>

                    <div className="auth-footer">
                        <p>
                            Remember your password?{' '}
                            <Link to="/login">Back to Login</Link>
                        </p>
                    </div>
                </AuthCard>
            </AuthPageLayout>
        </>
    );
};

export default ForgotPassword;
