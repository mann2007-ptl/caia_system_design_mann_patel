import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
    HiOutlineEnvelope,
    HiOutlineCheckBadge,
    HiOutlineExclamationTriangle,
    HiOutlineArrowPath,
} from 'react-icons/hi2';

import AuthPageLayout from '../../components/auth/AuthPageLayout';
import AuthCard from '../../components/auth/AuthCard';
import AuthInput from '../../components/auth/AuthInput';
import AuthSuccessCard from '../../components/auth/AuthSuccessCard';
import GradientButton from '../../components/ui/GradientButton';
import LoadingSpinner from '../../components/loaders/LoadingSpinner';
import { verifyEmail, resetAuthStates } from '../../features/auth/authSlice';
import { VALIDATION } from '../../constants';

const verifySchema = Yup.object().shape({
    email: Yup.string()
        .email(VALIDATION.EMAIL_INVALID)
        .required(VALIDATION.EMAIL_REQUIRED),
});

const VerifyEmail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, emailVerified, error } = useSelector((state) => state.auth);

    useEffect(() => {
        return () => {
            dispatch(resetAuthStates());
        };
    }, [dispatch]);

    const handleSubmit = async (values) => {
        try {
            await dispatch(verifyEmail(values.email)).unwrap();
            toast.success('Email verified successfully!', {
                icon: '✅',
                style: { borderRadius: '12px', background: '#fff', color: '#1e293b' },
            });
        } catch (err) {
            toast.error(err || 'Verification failed.', {
                style: { borderRadius: '12px', background: '#fff', color: '#1e293b' },
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Verify Email — CAIA Platform</title>
                <meta name="description" content="Verify your email address for CAIA Platform." />
            </Helmet>

            <AuthPageLayout>
                {emailVerified ? (
                    <AuthSuccessCard
                        title="Email Verified!"
                        message="Your email has been verified successfully. You can now enjoy the full features of CAIA Platform."
                        buttonText="Go to Login"
                        onButtonClick={() => navigate('/login', { replace: true })}
                        icon={<HiOutlineCheckBadge />}
                    />
                ) : (
                    <AuthCard>
                        <div className="auth-card-header">
                            <div className="auth-card-icon">
                                <HiOutlineEnvelope />
                            </div>
                            <h2 className="auth-card-title">Verify Email</h2>
                            <p className="auth-card-subtitle">
                                Enter your email address to verify your account.
                            </p>
                        </div>

                        <Formik
                            initialValues={{ email: '' }}
                            validationSchema={verifySchema}
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
                                        id="verify-email"
                                    />

                                    <GradientButton loading={loading}>
                                        {loading ? 'Verifying...' : 'Verify Email'}
                                        {!loading && <HiOutlineCheckBadge />}
                                    </GradientButton>
                                </Form>
                            )}
                        </Formik>

                        <div className="auth-footer">
                            <p>
                                Already verified?{' '}
                                <Link to="/login">Sign in</Link>
                            </p>
                        </div>
                    </AuthCard>
                )}
            </AuthPageLayout>
        </>
    );
};

export default VerifyEmail;
