import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import { HiOutlineLockClosed, HiOutlineKey, HiOutlineArrowRight } from 'react-icons/hi2';

import AuthPageLayout from '../../components/auth/AuthPageLayout';
import AuthCard from '../../components/auth/AuthCard';
import PasswordInput from '../../components/auth/PasswordInput';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';
import AuthSuccessCard from '../../components/auth/AuthSuccessCard';
import GradientButton from '../../components/ui/GradientButton';
import { resetPassword, resetAuthStates } from '../../features/auth/authSlice';
import { VALIDATION } from '../../constants';

const resetSchema = Yup.object().shape({
    newPassword: Yup.string()
        .min(6, VALIDATION.PASSWORD_MIN)
        .required(VALIDATION.PASSWORD_REQUIRED),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], VALIDATION.PASSWORD_MATCH)
        .required(VALIDATION.CONFIRM_PASSWORD_REQUIRED),
});

const ResetPassword = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();
    const { loading, resetPasswordSuccess, error } = useSelector((state) => state.auth);

    useEffect(() => {
        return () => {
            dispatch(resetAuthStates());
        };
    }, [dispatch]);

    const handleSubmit = async (values) => {
        try {
            await dispatch(
                resetPassword({ resetToken: token, newPassword: values.newPassword })
            ).unwrap();
            toast.success('Password reset successful!', {
                icon: '🔐',
                style: { borderRadius: '12px', background: '#fff', color: '#1e293b' },
            });
        } catch (err) {
            toast.error(err || 'Failed to reset password.', {
                style: { borderRadius: '12px', background: '#fff', color: '#1e293b' },
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Reset Password — CAIA Platform</title>
                <meta name="description" content="Create a new password for your CAIA Platform account." />
            </Helmet>

            <AuthPageLayout>
                {resetPasswordSuccess ? (
                    <AuthSuccessCard
                        title="Password Reset!"
                        message="Your password has been reset successfully. You can now sign in with your new password."
                        buttonText="Go to Login"
                        onButtonClick={() => navigate('/login', { replace: true })}
                    />
                ) : (
                    <AuthCard>
                        <div className="auth-card-header">
                            <div className="auth-card-icon">
                                <HiOutlineKey />
                            </div>
                            <h2 className="auth-card-title">Reset Password</h2>
                            <p className="auth-card-subtitle">
                                Create a strong new password for your account.
                            </p>
                        </div>

                        <Formik
                            initialValues={{ newPassword: '', confirmPassword: '' }}
                            validationSchema={resetSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ values }) => (
                                <Form noValidate>
                                    <Field
                                        name="newPassword"
                                        component={PasswordInput}
                                        label="New Password"
                                        icon={HiOutlineLockClosed}
                                        placeholder="Enter new password"
                                        id="reset-new-password"
                                    />
                                    <PasswordStrengthMeter password={values.newPassword} />

                                    <div style={{ marginTop: '0.5rem' }}>
                                        <Field
                                            name="confirmPassword"
                                            component={PasswordInput}
                                            label="Confirm Password"
                                            icon={HiOutlineLockClosed}
                                            placeholder="Confirm new password"
                                            id="reset-confirm-password"
                                        />
                                    </div>

                                    <GradientButton loading={loading}>
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                        {!loading && <HiOutlineArrowRight />}
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
                )}
            </AuthPageLayout>
        </>
    );
};

export default ResetPassword;
